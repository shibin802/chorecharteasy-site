# 上线前 QA 验收报告

## 1. 基本信息

- 项目：ChoreChartEasy
- 域名：`https://chorecharteasy.com`
- 当前阶段：`09-qa`
- 目标市场：US / English
- 执行日期：2026-07-26
- 当前状态：`PRODUCTION_PASS_WITH_LIGHTHOUSE_EXCEPTION`
- Release verdict：`LAUNCHED`
- 一句话结论：**本报告最初给出 NO_GO；随后 Preview 通过、Owner 明确接受剩余风险并授权 Production，正式域名浏览器/技术/API QA 已通过。法律、邮箱、内容与实机打印仍待 Owner 闭环，不代表专业合规完成。**

> Sections 2–15 保留上线前 Gate 快照与问题发现过程；当前发布事实以 Section 17、`docs/project-control.md` 和 `docs/PRODUCTION-LAUNCH-2026-07-26.md` 为准。

## 2. 上游输入与准入

### 已读取

- `docs/PRD-product-definition-v2-lean-validation-2026-07-26.md`
- `docs/PRICING-commercial-model-calibration-2026-07-26.md`
- `docs/COMPLIANCE-legal-baseline-analysis-2026-07-26.md`
- `docs/COPY-home-seo-freeze-2026-07-26.md`
- `docs/design/DESIGN-HANDOFF-2026-07-26.md`
- `docs/FRONTEND-HANDOFF-2026-07-26.md`
- `docs/BACKEND-HANDOFF-2026-07-26.md`
- `backend/contracts/*.json`

### Gate 状态

| Gate | 状态 | QA 判断 |
|---|---|---|
| PRD | NEEDS_REVIEW | Lean P0 清楚，可继续技术 QA，不能跳 Owner Review |
| Pricing | NEEDS_REVIEW | Family Pack 仅 planned pilot；支付不在本轮 QA_GO 范围 |
| Compliance / Legal | BLOCKED | 发布 P0 |
| Copy | NEEDS_REVIEW | 技术合同已实现；starter task 人工审核未完成 |
| Design | NEEDS_REVIEW | 实现完成；Owner Visual Review 未完成 |
| Frontend | NEEDS_REVIEW / NOT_DEPLOYED | 可做本地 QA，不能给生产 QA_GO |
| Backend | NEEDS_REVIEW / NOT_DEPLOYED | 可做本地权限和错误态 QA；生产能力不可宣称上线 |

### 环境 Preflight

- Git、Node、npm、Python、curl、Wrangler、GitHub CLI：可用。
- 浏览器/CDP：可用。
- Cloudflare Pages 本地 runtime：可用。
- 新版本 Preview URL：**缺失**。
- 新版本 Production URL：**缺失**。
- 当前生产 `https://chorecharteasy.com/`：HTTP 200，但 H1 仍为旧版 `Free printable chore chart maker your kids can actually follow`，不是本轮冻结 Hero。
- 当前工作树：未 commit、未 push、未部署。

根据 Skill 输入契约，“无生产/预览 URL”不能给全站 `QA_GO`。

## 3. 5 秒测试

首屏可在 5 秒内说明：

- What：`Make a printable chore chart that fits your child’s age`
- Who：`For parents and caregivers`
- Why：年龄带 starter、可编辑任务、Letter/A4 打印
- Cost/Boundary：`Free printable tool · No sign-up · Ages 3–12`
- Primary CTA：`Make my free chart`
- Secondary CTA：`Start with a blank chart`
- Account boundary：`No child account required`

结论：**PASS**。核心价值先于 Family Pack 和增长内容出现。

## 4. 真实用户任务

### 4.1 Maker 核心任务

真实执行：

1. 选择 Ages 7–9。
2. 选择 Morning starter。
3. 创建 chart。
4. 将标题编辑为 Launch QA Morning。
5. 新增 `Place lunch bag by the door`。
6. 勾选一个完成状态。
7. 选择 A4。
8. 打开打印预览。
9. Reload 页面。

结果：

- 创建后 6 行。
- 新任务存在。
- checkbox 状态为 checked。
- A4 预览 Dialog 打开，print sheet=`a4`。
- Reload 后标题、6 行、新任务、checkbox 和 A4 全部恢复。

结论：**PASS**。

### 4.2 Multiple Kids

- 真实选择 Multiple Kids。
- 添加到 4 个孩子。
- 第 4 个后 Add disabled。
- 生成 12 行。
- 显示 adult-review / suitability boundary。

结论：**PASS**。

### 4.3 Storage 不可用

- 模拟 localStorage 抛错。
- 编辑器仍生成 5 行。
- 状态显示 `Draft not saved` 和浏览器存储不可用说明。

结论：**PASS**。

### 4.4 No-JS

- H1 和内容仍可读。
- noscript 明确说明编辑/打印需要 JavaScript。
- 页面级根宽度没有因此被判为可交互通过；该模式仅承担内容降级。

结论：**PASS（按降级合同）**。

### 4.5 Chore Randomizer

真实键盘路径：

1. 输入 Alex / Jordan / Casey。
2. 输入 4 个 chores。
3. 从 textarea 按 Tab 聚焦 Randomize。
4. 按 Enter。

结果：

- 3 个 result cards。
- 4 个 chore 均唯一分配。
- Print assignments 启用。
- `/api/*` 请求 0。

结论：**PASS**。

### 4.6 Early Access CTA

- 页面没有 email input。
- 键盘触发 CTA 后提示：列表尚未开放、没有提交信息、没有收费。
- `/api/*` 请求 0。

结论：**PASS，符合 dormant boundary**。

## 5. 9 断点与交互证据

测试断点：

```text
320 / 360 / 390 / 430 / 768 / 1024 / 1280 / 1440 / 1920
```

全部满足：

- 根页面可实际水平滚动：0。
- 滚动容器外可见越界：0。
- 可见主按钮最小高度：≥44px。
- Console errors：0。
- Failed requests：0。
- Consent 前第三方 tracking：0。
- 首次 Tab：Skip Link 可见且有 focus outline。

证据：

- `docs/qa/launch-browser-qa.json`
- `docs/qa/launch-home-320.png`
- `docs/qa/launch-home-360.png`
- `docs/qa/launch-home-390.png`
- `docs/qa/launch-home-430.png`
- `docs/qa/launch-home-768.png`
- `docs/qa/launch-home-1024.png`
- `docs/qa/launch-home-1280.png`
- `docs/qa/launch-home-1440.png`
- `docs/qa/launch-home-1920.png`

结论：**PASS**。

## 6. Consent / Analytics

| 场景 | 结果 |
|---|---|
| 首次访问 | tracking 0 |
| Reject | `analytics=false`，tracking 0 |
| Accept | gtag loaded，tracking count 2，GA cookie count 2 |
| Withdraw | `analytics=false`，GA cookie count 0 |
| GPC | Accept disabled，settings Accept disabled，tracking 0 |
| Clarity | 请求 0，源码扫描无 loader |

证据只保存计数和布尔值，不保存 GA Client Cookie 或 collect URL。

结论：**PASS**。

## 7. 打印

当前候选代码重新生成：

| 输出 | 页数 | MediaBox | 文件大小 |
|---|---:|---:|---:|
| Letter | 1 | `612 × 792 pt` | 31,141 bytes |
| A4 | 1 | `594.96 × 841.92 pt` | 30,956 bytes |

证据：

- `docs/qa/launch-chore-chart-letter.pdf`
- `docs/qa/launch-chore-chart-a4.pdf`

结论：**PASS**。

## 8. HTTP / SEO / Schema / Links

### 路由

- 首页：200。
- 6 个增长/工具路由：200。
- 5 个 legal/contact 路由：200。
- `sitemap.xml`：200。
- `robots.txt`：200。
- 缺失路由：404。

### 页面合同

对 12 个公开页面验证：

- 每页 1 个 H1。
- title + meta description 存在。
- canonical 指向 `https://chorecharteasy.com`。
- JSON-LD 可解析。
- 图片 alt 无缺失。
- 12 条本地链接全部 <400。
- 6 个共享静态资源全部 <400。
- sitemap 7 个 URL 均映射到 200。
- Legal 页面不在 sitemap，并设置 noindex。

### 安全 Header

首页 runtime 响应存在：

- Content-Security-Policy
- Strict-Transport-Security
- X-Content-Type-Options
- X-Frame-Options
- Referrer-Policy
- Permissions-Policy
- Cross-Origin-Opener-Policy

证据：`docs/qa/launch-technical-smoke.json`。

结论：**技术 smoke PASS；Legal 文案内容仍是发布 P0。**

## 9. Lighthouse 与返修闭环

### 首轮

| Mode | Performance | Accessibility | Best Practices | SEO |
|---|---:|---:|---:|---:|
| Mobile | 91 | 95 | 100 | 100 |
| Desktop | 97 | 95 | 100 | 100 |

发现：

1. `.kicker` 在两种米色背景上的 contrast 为 4.31 / 4.01，低于 4.5。
2. Hero 示例卡从 H1 跳到 H3，heading order invalid。

### 修复

- `.kicker` 改用现有 `--coral-dark`，计算最小 contrast 4.726。
- Hero 示例标题从语义 H3 改为 `.mini-sheet-title` 非 heading 元素，保留视觉样式。

### 独立 Re-QA

| Mode | Performance | Accessibility | Best Practices | SEO | LCP | CLS |
|---|---:|---:|---:|---:|---:|---:|
| Mobile | 91 | 100 | 100 | 100 | 1286ms | 0.0162 |
| Desktop | 98 | 100 | 100 | 100 | 455ms | 0.0996 |

证据：

- 首轮：`docs/qa/lighthouse-launch-mobile.json`、`lighthouse-launch-desktop.json`
- 复验：`docs/qa/lighthouse-launch-mobile-reqa.json`、`lighthouse-launch-desktop-reqa.json`

结论：**修复闭环 PASS**。

## 10. 会员、权限和数据边界

### 生产默认关闭态

| Endpoint | Status / Result |
|---|---|
| `/api/health` | 200，D1 ready |
| `/api/membership` | accounts=false / earlyAccess=false / payments=false |
| `/api/me` | 200 anonymous |
| `/api/early-access` | 503 feature unavailable |
| `/api/auth/request-link` | 503 feature unavailable |
| `/api/checkout` | 404 |

结论：**PASS**。

### 本地 enabled 权限链

隔离 D1 + local-only dev bypass：

- Health、public membership contract、anonymous me。
- Origin required。
- Field allowlist。
- Explicit consent。
- Early Access idempotent upsert。
- Magic Link 创建。
- `HttpOnly; Secure; SameSite=Lax` session。
- Magic Link replay 拒绝。
- Family Pack entitlement。
- Logout 撤销 session。
- Method allowlist 和 API 404。

结果：**14/14 PASS**。

### 儿童数据负向测试

恶意提交：

```text
nickname / child_name / chart_title / task_text / checks / school / health_details
```

结果：

- Early Access endpoint：400 `unknown_fields`。
- Auth endpoint：400 `unknown_fields`。
- D1 schema forbidden terms：0。
- D1 读回：1 user、1 membership、1 Early Access、1 consumed token、1 revoked session。

结论：**PASS**。

## 11. 自动化质量闸

```text
python3 -m unittest discover -s tests -v
Ran 24 tests
OK
```

同时通过：

- `node --check assets/site.js`
- `node --check assets/consent.js`
- `node --check assets/pages/chore-randomizer.js`
- `node --check functions/_lib/api.mjs`
- `node --check functions/api/[[path]].js`
- `git diff --check`
- Secret/private key/GA client identifier scan：0 matches

## 12. P0 / P1 / P2（返修后）

详细返修证据：`docs/QA-REPAIR-2026-07-26.md`。

### P0-01：Compliance / Legal Owner Gate 仍 BLOCKED

**已修复**：

- `/privacy`、`/terms`、`/cookies`、`/refund`、`/contact` 已按当前免费 Maker 的真实数据流重写。
- 方括号占位符、Draft/Do-not-publish 标记、未上线 OAuth/Clarity/Creem/Early Access/支付假设均为 0。
- Privacy/Cookies 与 localStorage、180 天 consent、Cloudflare 和 consent-gated GA4 一致。

**剩余阻塞**：

- Owner/适用法律专业复核 operator-neutral 文本；确认是否必须公开 legal operator、地址或指定司法辖区。
- `support@chorecharteasy.com` 已有域名 MX/SPF，但必须完成真实收信和回复验证。

**影响**：在 Owner 明确批准前仍阻断生产上线，不能把文本声明为“法律合规完成”。

### P0-02：没有可复验的 Preview Release Candidate

**复现步骤**：

1. 工作树仍是未 commit/未跟踪候选代码。
2. 生产站仍是旧版本。
3. 没有与本轮候选 commit 一一对应的 Cloudflare Preview URL。

**实际**：本轮返修仅在本地 Wrangler Pages Functions + D1 runtime 完成真实 Re-QA。

**影响**：不能给生产 `QA_GO`。

**解锁动作**：Owner P0/P1 签字后创建 Preview，提供 URL + commit，执行独立 Preview Re-QA；不得为了拿 URL 直接 push `main` 触发生产。

### P1-01：Starter chores 已完成来源化审查，待 Owner 签字

- 已建立 `docs/content/STARTER-CHORES-SAFETY-REVIEW-2026-07-26.md`。
- 已按 AAP/HealthyChildren.org 来源缩小 laundry/dishes/trash 等宽泛任务，并为 Ages 3–6 Morning starter 增加 adult help。
- 已排除清洁剂、洗衣产品、尖锐工具、热表面、重物和攀爬任务。
- 该工作是来源化产品编辑审查，不冒充儿科/职业治疗意见；Owner 仍需确认最终措辞。

### P1-02：Owner Visual / Print Review 未签字

- 9 viewport 自动化、增长页设计系统、Letter/A4 单页打印和可访问性技术检查均通过。
- 仍需 Owner 人工确认视觉方向、字号、留白、Logo 和纸面可读性。

### P2：0

已关闭：

1. 生成并接入 1200×630 OG social image。
2. 6 个增长/工具页迁移到首页 Kitchen Table Utility 设计 token。
3. Randomizer inline CSS 已外移，CSP 删除 `style-src 'unsafe-inline'`。
4. 首屏字体 preload 后 Mobile/Desktop CLS 最终均为 0。
5. 最终 Lighthouse：Home mobile 98/100/100/100，Home desktop 100/100/100/100，Randomizer mobile 100/100/100/100。

Auth、Early Access、Production D1、R2、Creem 和 payments 保持 dormant，是明确关闭的非 P0 能力，不作为当前免费 Maker 缺陷，也不得宣传为已上线。

## 13. GO / NO-GO

- 本地技术返修：`PASS`
- 技术候选：`READY_FOR_OWNER_REVIEW_AND_PREVIEW_PREPARATION`
- 公开上线：`NO_GO`
- P0：2
- P1：2
- P2：0

判定依据：生产上线要求 P0=0、P1=0；当前仍缺 Owner/法律/邮箱签字和 Preview release candidate。

## 14. 本阶段交付物

- 本报告：`docs/QA-ACCEPTANCE-2026-07-26.md`
- 返修报告：`docs/QA-REPAIR-2026-07-26.md`
- Starter 安全审查：`docs/content/STARTER-CHORES-SAFETY-REVIEW-2026-07-26.md`
- 项目控制板：`docs/project-control.md`
- 9 断点截图：`docs/qa/launch-home-*.png`
- 浏览器证据：`docs/qa/launch-browser-qa.json`
- 技术 smoke：`docs/qa/launch-technical-smoke.json`
- Lighthouse 首轮 + Re-QA：`docs/qa/lighthouse-launch-*.json`
- 返修 Lighthouse：`docs/qa/lighthouse-repair-home-mobile-final.json`、`lighthouse-repair-home-desktop-reqa.json`、`lighthouse-repair-randomizer-mobile.json`
- Print evidence：`docs/qa/launch-chore-chart-letter.pdf`、`launch-chore-chart-a4.pdf`
- 返修 Print evidence：`docs/qa/repair-chore-chart-letter.pdf`、`repair-chore-chart-a4.pdf`

## 15. 验收清单自检

- [x] 不是只测首页 200。
- [x] 9 断点真实运行，无根级横向滚动。
- [x] 移动端真实生成、编辑、持久化和 Consent。
- [x] Randomizer 真实键盘任务。
- [x] 404、links、robots、sitemap、canonical、metadata、schema。
- [x] Lighthouse Mobile/Desktop 有首轮和 Re-QA 记录。
- [x] 核心链路真实跑过。
- [x] 权限、会员、错误态和数据边界真实跑过。
- [x] 所有 P0 有复现步骤、影响和解锁动作。
- [x] QA 中 P1 修复有独立 Re-QA。
- [ ] 无 P0/P1 才能上线：**未满足**。
- [x] Production/Preview URL 真实复验：**Preview PASS；Production 未部署**。

## 16. Preview Re-QA 增补

- Preview branch：`preview-lean-v2-20260726`
- Preview commit：`4121b60159b2298b066a0bc2c2626e83e90ad1c6`
- Preview URL：`https://22ec0c2d.chorecharteasy.pages.dev`
- Cloudflare deployment：`preview / success`
- 30/30 unittest：PASS。
- 9 viewport、Maker 持久化、Consent/GPC、12-page technical smoke：PASS。
- Preview D1 `/api/health`：200 / ready。
- Consent 远端最终结果：Accept `_ga` cookies=2；Withdraw=0。
- 远端 Lighthouse 因执行安全层持续误判 `pages.dev` 而未运行；本地 Lighthouse 记录保持 mobile 98、desktop 100、A11y/BP/SEO 100、CLS 0。未伪造远端分数。

## 17. Production 上线增补

- Production：`https://chorecharteasy.com`，commit `fb6ad171415b78bb640519863c42728c535122bc`。
- CI 与 Cloudflare deployment：success。
- 9 viewport browser QA：PASS；12-page technical smoke：failures=[] / warnings=[]。
- Production D1：ready；Auth、Early Access、Payments 全 false。
- Consent/GPC：PASS；Accept 后 GA cookies=2，Withdraw 后=0。
- Cloudflare RUM 与 Email Obfuscation 已通过全站 Configuration Rule 关闭。
- 远端 Lighthouse 沿用 Owner 已批准的执行环境例外，未伪造分数。
- 下游不能改动：免费 Maker 无账号、active draft 本地保存、Analytics 默认关闭、payment disabled、儿童 chart 数据不进后端。
- 不得假设：法律已专业批准、support 邮箱已验证、Auth/Early Access/payment 已上线。
- 完整证据：`docs/PRODUCTION-LAUNCH-2026-07-26.md`。

[PRODUCTION_PASS]
