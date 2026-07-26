# Cloudflare 后端与会员系统交接摘要

日期：2026-07-26
项目：ChoreChartEasy
阶段：`08-backend`
状态：`PREVIEW_PASS / PRODUCTION_DISABLED`
生产状态：`NOT_DEPLOYED · ALL WRITE FEATURES DISABLED`

## Preview 增补

- Preview D1：`chorecharteasy-preview`，仅绑定 Preview 环境的 `DB`。
- Migration：17 queries；7 张业务表。
- `/api/health`：200，database=`ready`。
- `/api/membership`：200；Auth、Early Access、Payments 均 disabled。
- Production D1 binding 未修改，仍为空。

## 当前结论

Cloudflare Pages Functions + D1 的会员基础已在本地真实跑通；免费 Maker 继续无需账号，首页不自动访问 `/api/me`。由于 Lean PRD、法律、邮件服务商和付费 Gate 尚未解锁，生产 Auth、Early Access 和支付全部保持关闭。

## 关键输入

- `docs/PRD-product-definition-v2-lean-validation-2026-07-26.md`
- `docs/PRICING-commercial-model-calibration-2026-07-26.md`
- `docs/COMPLIANCE-legal-baseline-analysis-2026-07-26.md`
- `docs/FRONTEND-HANDOFF-2026-07-26.md`
- `backend-auto-site-cloudflare-workers` Skill v2.3.0

## 架构

```text
Browser
  ├─ static HTML/CSS/JS
  ├─ chart content → localStorage only
  └─ same-origin /api/*
         ↓
Cloudflare Pages Functions
  ├─ feature flags
  ├─ Origin/body/rate-limit validation
  ├─ Magic Link + server-side session
  └─ membership entitlement read
         ↓
Cloudflare D1
  ├─ users / login_tokens / sessions
  ├─ memberships
  ├─ early_access_signups
  ├─ rate_limits
  └─ audit_events
```

选择 Pages Functions 而不是独立 `workers.dev` API，避免跨域 CORS 和 `SameSite=None` Cookie；API 与网站使用同源 `/api/*`。

## 本阶段交付物

### 代码

- `functions/api/[[path]].js`
- `functions/_lib/api.mjs`
- `backend/scripts/integration_local.py`

### D1

- `backend/migrations/0001_initial.sql`
- `backend/seed/dev.sql`：仅 `.test` 假身份，禁止 remote

### 机器可读合同

- `backend/contracts/api-v1.json`
- `backend/contracts/env.schema.json`
- `backend/contracts/deployment-manifest.example.json`
- `backend/contracts/r2-plan.json`

### 运维说明

- `backend/README.md`

## API 合同

| Method | Endpoint | Auth | 默认 | 说明 |
|---|---|---|---:|---|
| GET | `/api/health` | 无 | 开放 | D1 readiness |
| GET | `/api/membership` | 无 | 开放 | 免费/账号/Early Access/支付能力态 |
| POST | `/api/early-access` | 无 | 关闭 | 显式 consent 的成人邮箱列表 |
| POST | `/api/auth/request-link` | 无 | 关闭 | 仅 loopback 开发 Magic Link |
| GET | `/api/auth/verify` | 一次性 token | 关闭 | 原子消费 token、创建 session |
| GET | `/api/me` | 可选 session | 开放 | 匿名/账号/entitlement 状态 |
| POST | `/api/logout` | 可选 session | 开放 | 服务端撤销 session |

没有 `/api/checkout`，没有 payment webhook，没有客户端写 membership 状态的接口。

## 数据边界

### 进入 D1

- 成人账号 email，仅 Auth 启用时。
- Early Access email、consent version/time，仅 Early Access 启用时。
- HMAC token hash、session expiry/revocation。
- Family Pack entitlement 状态。
- 不含 PII metadata 的安全审计事件。
- pseudonymous rate-limit bucket，不存原 IP。

### 永不进入 D1/API

- child nickname/name/age。
- chart title。
- chore/task text。
- daily completion state。
- school、address、health details。

这些字段继续只在浏览器 `chorecharteasy.activeDraft.v2`。

## Auth 与 entitlement

- Auth 类型：email Magic Link foundation。
- Magic Link：默认 15 分钟、256-bit random、D1 仅存 HMAC hash、一次性原子消费。
- Session：默认 30 天、D1 仅存 HMAC hash。
- Cookie：`HttpOnly; Secure; SameSite=Lax; Path=/`。
- 当前唯一 entitlement：`family_pack_download`。
- entitlement 只能从 D1 membership 读取；前端不能自授予。
- 当前没有管理员写接口，也没有支付写接口。

## 安全实现

- 所有状态写入要求严格同源 `Origin`。
- JSON body 限制 4096 bytes。
- request 字段显式 allowlist。
- Early Access honeypot。
- Early Access：每 pseudonymous IP bucket 每小时 10 次。
- Magic Link：每 email + pseudonymous IP 每 15 分钟 5 次。
- Verify：每 pseudonymous IP 每小时 20 次。
- 429 返回 `Retry-After`。
- API error 带 request ID，但不返回 stack、SQL、token 或 PII。
- 源码不记录 request body/email/token 到 Console。
- `.dev.vars`、`.dev.vars.*`、`*.local` 已加入 `.gitignore`。
- `AUTH_DEV_BYPASS=true` 同时受 loopback hostname 强制限制。

## 真实验证证据

### 合同测试

```text
python3 -m unittest tests.test_backend_v1 -v
11/11 PASS
```

该测试先在旧代码上失败，再实现到通过。

### D1 migration

- `0001_initial.sql` 连续执行两次：PASS。
- 7 张业务表创建成功。
- 开发 seed：1 个 `.test` user + 1 个 Family Pack membership。

### Wrangler Pages Functions + D1 黑盒测试

```text
python3 backend/scripts/integration_local.py --base http://127.0.0.1:8791
14/14 PASS
```

覆盖：

- Health + D1 readiness。
- Public membership contract。
- Anonymous `/api/me`。
- Origin 拒绝。
- 字段 allowlist。
- 显式营销 consent。
- Early Access upsert。
- Magic Link 创建、一次性消费和 replay 拒绝。
- Secure Session Cookie。
- Family Pack entitlement。
- Logout 服务端撤销。
- Method allowlist 和 API 404。

### D1 读回

```text
users:                1
memberships:          1
early_access_unique:  1
consumed_tokens:      1
revoked_sessions:     1
audit_events:         3
```

### 安全边界

- 过大 body：413 `payload_too_large`。
- 非 JSON：415 `unsupported_media_type`。
- Honeypot：202，但不写真实 signup。
- Early Access 超限：429 + `Retry-After`。
- Magic Link 超限：429 + `Retry-After`。

### 默认关闭态

未配置 Session/Rate secrets，且 flags 全 false 时：

- `/api/health`：200。
- `/api/membership`：accounts=false、earlyAccess=false、payments=false。
- 匿名 `/api/me`：200。
- Early Access：503 `feature_unavailable`。
- Auth：503 `feature_unavailable`。

### 前端非回归

Wrangler runtime 浏览器验证：

- 首页编辑器 5 行正常。
- 页面加载自动 `/api/*` 请求：0。
- 未 consent 第三方追踪请求：0。

## R2 / 资产计划

当前 P0 不需要 R2：免费 Maker 本地生成和打印；Family Pack 资产、许可和交付尚未批准。

若以后解锁 Family Pack，必须先完成：私有 bucket、短期签名下载、资产 license ledger、下载审计、退款/撤权和保留删除策略。详见 `backend/contracts/r2-plan.json`。

## 风险

- **P0**：在法律、邮件服务商、退订/删除和 Owner 范围确认前启用 Auth 或 Early Access，会造成实际个人数据收集与披露不一致。
- **P1**：Preview/Production D1 尚未创建或迁移；若直接部署 Functions，写接口会 fail-closed，但不能宣称会员能力上线。
- **P2**：R2、Family Pack 资产和支付生命周期尚未实现；当前不影响免费 Maker，只影响未来商业化。

## Preflight 与生产阻塞

### 已确认

- 本地 Cloudflare Token 存在，但本阶段未调用远端资源。
- Node/Wrangler 可用。
- Pages Functions + Miniflare D1 可真实运行。

### `[BLOCKED]`

1. `CLOUDFLARE_ACCOUNT_ID` 未注入；未创建 production/preview D1。
2. 未获 Owner 对生产资源、migration、push/deploy 的确认。
3. PRD 仍明确不做 `/account` 和云端计划；启用账号属于范围变更。
4. 没有生产邮件 provider，也未冻结其数据处理条款。
5. Early Access 的营销 consent、退订、删除和保留期未获法律/Owner 批准。
6. Family Pack 内容、R2 资产、许可、退款和 Creem 模式未冻结。
7. 付费兴趣 Gate 尚未达到；不能创建生产 checkout。

## 质量门槛自检

- [x] 前端拿到机器可读 Data Contract。
- [x] D1 migration 可重复执行。
- [x] Auth/权限/错误态本地可测。
- [x] Session HttpOnly/Secure。
- [x] Source 中无生产 secret。
- [x] 免费工具无需账号且不自动触发 API。
- [x] Payments fail-closed。
- [ ] 远端 migration 与本地 schema 对齐：未执行。
- [ ] 合规披露与生产数据流一致：生产功能未启用。
- [ ] 生产 email delivery：未接。
- [ ] 生产支付/webhook/退款撤权：不在当前解锁范围。

## Owner Review 决策

1. 是否批准未来启用成人账号；若不批准，保持 Auth dormant。
2. 是否批准先开 Early Access email collection。
3. 确认邮件服务商、from address、unsubscribe 和 deletion 流程。
4. 确认 early-access retention period。
5. 确认是否创建 preview/production 独立 D1。
6. 在任何 payment 实施前重新确认 paid-interest Gate。

## 给下游的最小必要信息

- 下一阶段：Owner Review → Preview 环境绑定/远端 QA；不是直接 Production Launch。
- 必须读取：本文件、`backend/README.md`、`backend/contracts/*.json`、最新 PRD/Compliance。
- 不能假设：账号已获批准、Early Access 可收集、邮件已能发送、Family Pack 可售、D1 已创建、生产已部署。
- 生产初始 flags 必须全 false；`AUTH_DEV_BYPASS` 永远不能在非 loopback 环境启用。

本轮未 commit、未 push、未创建远端 D1、未 apply 远端 migration、未部署。

[NEEDS_REVIEW]
