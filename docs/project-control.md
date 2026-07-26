# ChoreChartEasy 项目控制板

更新时间：2026-07-26 22:44 CST
事实源：本文件用于阶段 Gate、返修、Preview 和上线状态；聊天不是发布状态真源。

## 当前发布状态

- Production release verdict：`NO_GO`
- Preview QA：`PASS_WITH_LIGHTHOUSE_EXCEPTION`
- Preview branch：`preview-lean-v2-20260726`
- Preview candidate commit：`4121b60159b2298b066a0bc2c2626e83e90ad1c6`
- Preview direct URL：`https://22ec0c2d.chorecharteasy.pages.dev`
- Preview alias：`https://preview-lean-v2-20260726.chorecharteasy.pages.dev`
- Production：旧版本仍在线；本轮候选未部署到 `main` / Production。
- Open production severity：P0=2，P1=2，P2=0。

## Preview 部署事实

- Cloudflare deployment ID：`22ec0c2d-5281-4e35-b187-c62ef2bf7163`
- Environment：`preview`
- Branch：`preview-lean-v2-20260726`
- Cloudflare status：`success`
- Preview D1：`chorecharteasy-preview`
- D1 binding：仅 `deployment_configs.preview.DB`
- Production D1 binding：未修改、仍为空。
- Feature flags：Auth / Early Access / Payments 默认关闭；免费 Maker 不调用会员 API。

## Preview Re-QA

- unittest：30/30 PASS。
- artifact builder：PASS；仅 33 个生产文件/Worker 产物，不包含 `docs/`、`tests/`、`backend/`、源 `functions/`、QA 截图或 Git 元数据。
- Pages Functions Worker：编译与 Node syntax PASS。
- 9 viewport（320–1920）：PASS。
- Maker 编辑、localStorage、A4 print state、reload persistence：PASS。
- Consent Reject / Accept / Withdraw / GPC：PASS。
- Preview GA cookies：Accept=2；Withdraw=0。
- 12 pages / 12 links / 7 assets / 7 sitemap URLs：PASS。
- `/api/health`：200，database=`ready`。
- `/api/membership`：200；account/early-access/payment disabled。
- strict CSP、OG image、404：PASS。
- 本地 Lighthouse：Home mobile 98/100/100/100；desktop 100/100/100/100；CLS=0。
- 远端 Lighthouse：执行安全层持续误判 `pages.dev` 并阻断；未执行、未伪造结果。由远端真实浏览器与技术 smoke 覆盖核心验收。

## Preview 中发现并关闭的问题

1. 原 workflow 使用 `pages deploy .`，会把内部文档、测试和 QA 证据作为静态文件公开。
   - 已新增 minimal artifact builder。
   - CI 只部署 `dist`。
2. Wrangler 4.80 `pages functions build --outfile` 输出 multipart body，不能直接作为 `_worker.js`。
   - 已改为 `--outdir .wrangler/pages-functions-build`，复制 `index.js → dist/_worker.js`。
   - artifact runtime 已真实验证。
3. GA cookie 在 `*.chorecharteasy.pages.dev` Preview 自动写到父域，Withdraw 无法删除。
   - 已覆盖 `.chorecharteasy.pages.dev`。
   - 已加入 `ga-disable-<ID>`，并修复 Reject → Accept 延迟清理竞态。
   - 最终远端浏览器 Re-QA PASS。

## Stage Gates

| Stage | Status | Evidence / Blocker |
|---|---|---|
| Opportunity / Keyword | DONE | `BUILD_NOW（有条件）` |
| PRD | NEEDS_OWNER_REVIEW | Lean P0 已冻结，Owner 尚未签字 |
| Pricing | NEEDS_OWNER_REVIEW | Family Pack 仅 planned pilot，不可收费 |
| Compliance / Legal | NEEDS_OWNER_REVIEW | 当前免费版本法律页无占位；需确认 operator-neutral 文本并验证 support 邮箱收发 |
| SEO / Copy | NEEDS_OWNER_REVIEW | starter chores 已完成来源化安全审查，待 Owner 签字 |
| Design | NEEDS_OWNER_REVIEW | 共享设计系统和打印已 QA，待 Owner 视觉签字 |
| Frontend | PREVIEW_PASS | Preview 真实浏览器与技术 smoke 通过 |
| Backend | PREVIEW_PASS / PRODUCTION_DISABLED | Preview D1 ready；Production D1/email/payment 未启用 |
| QA | PASS_WITH_EXCEPTION | 远端主流程通过；远端 Lighthouse 被工具安全层阻断 |
| Owner Review | PENDING | 法律、邮箱、内容、视觉/打印 |
| Production Launch | BLOCKED | 不得 merge/push `main` |

## 剩余 Gate DAG

1. **P0 Legal / Owner**
   - 审阅 `privacy/terms/cookies/refund/contact`。
   - 决定适用法律是否要求公开 legal operator、地址或司法辖区。
   - 实测 `support@chorecharteasy.com` 收信与回复。
2. **P1 Content / Visual**
   - 签字 `docs/content/STARTER-CHORES-SAFETY-REVIEW-2026-07-26.md`。
   - 查看 Preview 与 Letter/A4 PDF，确认视觉、字号、Logo 和纸面可读性。
3. **Production Launch**
   - Owner 明确接受后方可 merge PR。
   - Production D1 binding/feature flags 必须按 Lean P0 决策；默认继续全部关闭。
   - 上线后执行 production smoke + GA/GSC/Cloudflare 数据链路复验。

## 禁止假设

- 不得把 Preview 成功描述为 Production 已更新。
- 不得把未获 Owner/专业复核的法律文本声明为“法律合规完成”。
- 不得假设 `support@chorecharteasy.com` 已端到端验证。
- 不得启用 Early Access、Auth、Production D1 或 Payments。
- 不得因 Preview 技术 QA 通过而自动 merge `main`。
