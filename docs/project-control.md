# ChoreChartEasy 项目控制板

更新时间：2026-08-22 00:15 CST
事实源：本文件用于阶段 Gate、返修、Preview 和上线状态；聊天不是发布状态真源。

## 2026-08-22 本地优化候选（尚未发布）

- 状态：`LOCAL_REPAIR_PASS / OWNER_REVIEW / NOT_DEPLOYED`
- 基线 commit：`417df65dce13a8a1c3199dfd835b019c6d6999f9`
- 当前工作树：移除不可用的 Early Access/$9.99 CTA；将内部写作提示改为用户文案；删除误导性的 `print_confirmed`，增加语义准确的 `afterprint_returned`；修复 Windows UTF-8 测试；更新首页 sitemap lastmod；增加同仓库 PR → Cloudflare Preview 的安全部署路径。
- 发布边界：本节只记录本地候选，不代表已 push、Preview、Production 或 GSC 提交。
- 本地证据：39/39 unittest PASS；Node syntax PASS；minimal artifact builder PASS（32 files）；`git diff --check` PASS；390px/1440px 无页面级横向溢出；移动端生成、编辑、加任务、打印预览 PASS；console errors=0。
- 待完成：Owner Review、Preview 部署、真实 URL Re-QA、Production 发布确认和 GSC 提交。
- 新发现：`docs/keyword-research-2026-07-22.md` 混入与 chore chart 无关的关键词数据，Opportunity Gate 降级为 `NEEDS_REPAIR`；必须以当前 GSC/SERP 重建事实源。

## 当前发布状态

- Production release verdict：`LAUNCHED / QA_PASS_WITH_LIGHTHOUSE_EXCEPTION`
- Preview QA：`PASS_WITH_LIGHTHOUSE_EXCEPTION`
- Preview branch：`preview-lean-v2-20260726`
- Preview candidate commit：`4121b60159b2298b066a0bc2c2626e83e90ad1c6`
- Preview direct URL：`https://22ec0c2d.chorecharteasy.pages.dev`
- Preview alias：`https://preview-lean-v2-20260726.chorecharteasy.pages.dev`
- Production：`https://chorecharteasy.com` 已部署，commit `fb6ad171415b78bb640519863c42728c535122bc`。
- Production fixed deployment：`https://790990e5.chorecharteasy.pages.dev`，Cloudflare status=`success`。
- GitHub Actions：`https://github.com/shibin802/chorecharteasy-site/actions/runs/30207465864`，conclusion=`success`。
- Blocking production severity：P0=0，P1=0；仍有 Owner follow-up risks P0=2、P1=2，不代表法律/邮箱/内容/实机验收已完成。

## Preview 部署事实

- Cloudflare deployment ID：`22ec0c2d-5281-4e35-b187-c62ef2bf7163`
- Environment：`preview`
- Branch：`preview-lean-v2-20260726`
- Cloudflare status：`success`
- Preview D1：`chorecharteasy-preview`
- D1 binding：仅 `deployment_configs.preview.DB`
- Production D1 binding：上线阶段已单独绑定 `chorecharteasy-production`；Preview 仍使用独立 Preview D1。
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

## Production 部署与验收事实

- Production D1：`chorecharteasy-production`，仅绑定 `deployment_configs.production.DB`。
- Migration：7 张业务表；建库时验证初始数据为空、禁止字段为 0。
- Feature flags：`AUTH_ENABLED=false`、`EARLY_ACCESS_ENABLED=false`、`PAYMENTS_ENABLED=false`。
- Production 9 viewport browser QA：PASS。
- Production technical smoke：12 pages / 12 links / 7 assets / 7 sitemap URLs；failures=[]，warnings=[]。
- Production API：health=200/database ready；membership 全部 disabled；写入口 fail-closed。
- Consent：Reject/Accept/Withdraw/GPC PASS；Accept 后 GA cookies=2，Withdraw 后=0。
- Cloudflare Configuration Rule：全站禁用未获 consent 的 RUM，并关闭 Email Address Obfuscation；状态 Active。
- 完整证据：`docs/PRODUCTION-LAUNCH-2026-07-26.md`。

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
| Frontend | PRODUCTION_PASS | Production 9 viewport 与技术 smoke 通过 |
| Backend | PRODUCTION_READY / WRITE_FEATURES_DISABLED | Production D1 ready；Auth/Early Access/Payments 继续关闭 |
| QA | PRODUCTION_PASS_WITH_EXCEPTION | 正式域名主流程通过；远端 Lighthouse 沿用已批准例外 |
| Owner Review | RISK_ACCEPTED_FOR_LAUNCH / FOLLOW_UP_OPEN | 法律、邮箱、内容、视觉/实机打印仍待闭环 |
| Production Launch | LAUNCHED | `main` 已部署，CI 与 Cloudflare 均 success |

## 上线后剩余 Follow-up

1. **P0 Legal / Owner**
   - 审阅 `privacy/terms/cookies/refund/contact`。
   - 决定适用法律是否要求公开 legal operator、地址或司法辖区。
   - 实测 `support@chorecharteasy.com` 收信与回复。
2. **P1 Content / Visual**
   - 签字 `docs/content/STARTER-CHORES-SAFETY-REVIEW-2026-07-26.md`。
   - 查看 Preview 与 Letter/A4 PDF，确认视觉、字号、Logo 和纸面可读性。
3. **运营与数据链路**
   - 实际运营流量进入后复验 GA4 / GSC / Cloudflare 数据链路。
   - Auth / Early Access / Payments 在各自 Gate 完成前继续关闭。

## 禁止假设

- 不得把旧 Preview 状态当作当前 Production 状态；正式发布事实以本文件和 Production launch 记录为准。
- 不得把未获 Owner/专业复核的法律文本声明为“法律合规完成”。
- 不得假设 `support@chorecharteasy.com` 已端到端验证。
- 不得启用 Early Access、Auth 或 Payments；Production D1 已绑定，但公开写能力保持关闭。
- 不得把本次 Owner 风险接受描述为专业法律审查完成。
