# ChoreChartEasy backend v1

状态：本地实现完成；生产保持关闭。
架构：Cloudflare Pages Functions（同源 `/api/*`）+ D1。

## 产品边界

- 免费 Maker 不需要账号。
- Chart title、nickname、task、checks 只在浏览器 localStorage，不进入 D1。
- 不提供云草稿。
- Family Pack 是 `planned`，不收费、不预订。
- 没有 checkout 或 payment webhook。
- Auth 只有 loopback 开发模式；未接生产邮件 provider。

## 文件

```text
functions/api/[[path]].js          Pages Functions 路由入口
functions/_lib/api.mjs             API、安全、session、D1 逻辑
backend/migrations/0001_initial.sql
backend/migrations/0002_feedback.sql
backend/seed/dev.sql               仅 .test 假数据
backend/contracts/api-v1.json
backend/contracts/env.schema.json
backend/contracts/deployment-manifest.example.json
backend/contracts/r2-plan.json
backend/scripts/integration_local.py
```

## API

| Method | Path | 默认状态 | 作用 |
|---|---|---:|---|
| GET | `/api/health` | 开放 | D1 readiness |
| GET | `/api/membership` | 开放 | 机器可读能力状态 |
| POST | `/api/feedback` | 开放 | 无账号产品反馈；不收邮箱、儿童资料或图表内容 |
| POST | `/api/early-access` | 关闭 | 成人邮箱兴趣列表 |
| POST | `/api/auth/request-link` | 关闭 | 开发态 Magic Link |
| GET | `/api/auth/verify` | 关闭 | 一次性 token → session |
| GET | `/api/me` | 开放 | 可选 session；首页不自动调用 |
| POST | `/api/logout` | 开放 | 撤销服务端 session |

完整字段、错误码和数据分类：`backend/contracts/api-v1.json`。

## 安全设计

- Session：随机 256-bit token；D1 只存 HMAC-SHA256 hash。
- Cookie：`HttpOnly; Secure; SameSite=Lax; Path=/`。
- Magic Link：15 分钟、一次性原子消费。
- 状态写入要求严格同源 `Origin`。
- JSON body 最大 4096 bytes，字段 allowlist。
- Email 和 chart/child 数据不进入 Analytics。
- D1 限流 key 是带 secret salt 的 IP/email pseudonymous HMAC bucket，不存原 IP。
- Feedback 只存类型、消息、页面路径、时间和随机 reference；不存邮箱、IP、账号或图表字段。
- 错误响应不返回 stack、SQL 或 PII。
- 生产 `AUTH_DEV_BYPASS` 必须为 `false`；代码同时限制 bypass 只能在 loopback 使用。

## 本地运行

Wrangler 需要一个临时 D1 binding config。不要把真实 ID 或 secret 写进仓库。

```bash
# 1. 建立仅本机使用的临时 config（binding 名必须为 DB）
# 2. 执行 migration；重复执行也应成功
npx wrangler d1 execute DB \
  --config /tmp/chorecharteasy-wrangler-local.jsonc \
  --local \
  --persist-to .wrangler/state/backend-v1 \
  --file backend/migrations/0001_initial.sql

# 3. 可选开发 seed；绝不能 --remote
npx wrangler d1 execute DB \
  --config /tmp/chorecharteasy-wrangler-local.jsonc \
  --local \
  --persist-to .wrangler/state/backend-v1 \
  --file backend/seed/dev.sql

# 4. Pages Functions 本地服务
SESSION_SECRET=$(openssl rand -hex 32)
RATE_LIMIT_SALT=$(openssl rand -hex 32)
npx wrangler pages dev . \
  --port 8790 --ip 127.0.0.1 \
  --compatibility-date=2026-04-08 \
  --persist-to .wrangler/state/backend-v1 \
  --d1 DB=[LOCAL_D1_ID] \
  --binding PUBLIC_ORIGIN=http://127.0.0.1:8790 \
  --binding AUTH_ENABLED=true \
  --binding AUTH_DEV_BYPASS=true \
  --binding EARLY_ACCESS_ENABLED=true \
  --binding PAYMENTS_ENABLED=false \
  --binding SESSION_SECRET="$SESSION_SECRET" \
  --binding RATE_LIMIT_SALT="$RATE_LIMIT_SALT"

# 5. 黑盒 HTTP 测试
python3 backend/scripts/integration_local.py --base http://127.0.0.1:8790
```

## 生产准备顺序

1. Owner 确认是否允许偏离 Lean PRD，启用账号或 Early Access 数据收集。
2. 法律确认运营主体、联系邮箱、邮件服务商、保留/删除、退订流程。
3. 创建 production/preview 独立 D1，绑定名均为 `DB`。
4. 设置 Cloudflare Pages Variables/Secrets；不要提交 `.dev.vars`。
5. 先以四个 feature flag 全 false 部署 Preview。
6. 对 Preview 远端 migration、API、Headers、日志和数据删除做 QA。
7. Early Access 和 Auth 分别单独启用，不能一次全开。
8. 支付继续保持关闭，直到付费 Gate、退款和 entitlement 生命周期完整。

## 当前不能做的生产操作

- 远端 D1 create/migration：缺 `CLOUDFLARE_ACCOUNT_ID` 且未获部署确认。
- Auth：没有生产邮件 provider、法律披露和删除流程。
- Early Access：营销 consent/退订/保留期未批准。
- Family Pack：没有批准的资产包、R2 交付、支付和退款合同。
