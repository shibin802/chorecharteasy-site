# ChoreChartEasy 项目控制板

更新时间：2026-07-26 16:05 CST
事实源：本文件用于阶段 Gate、返修和上线状态；聊天不是发布状态真源。

## 当前发布状态

- Release verdict：`NO_GO`
- QA stage：`BLOCKED_PENDING_OWNER_AND_PREVIEW`
- Local technical Re-QA：`PASS`
- Production：旧版本仍在线；本轮候选代码未 commit、未 push、未部署。
- Current candidate：仅本地 Cloudflare Pages Functions + D1 runtime 验证。
- Open severity：P0=2，P1=2，P2=0。

## Stage Gates

| Stage | Status | Evidence / Blocker |
|---|---|---|
| Opportunity / Keyword | DONE | `BUILD_NOW（有条件）`，机会评分见上游研究 |
| PRD | NEEDS_REVIEW | Lean P0 已冻结；Owner Review 未完成 |
| Pricing | NEEDS_REVIEW | Family Pack 仅 planned pilot，不可收费 |
| Compliance / Legal | NEEDS_OWNER_REVIEW | 当前免费版本法律页已重写且无占位；需确认 operator-neutral 文本是否满足适用法律，并验证 support 邮箱收发 |
| SEO / Copy | NEEDS_OWNER_REVIEW | 技术合同通过；starter chores 已完成来源化安全审查，待 Owner 签字 |
| Design | NEEDS_OWNER_REVIEW | 首页和增长页设计系统已统一；Owner Visual/Print Review 未完成 |
| Frontend | NEEDS_REVIEW | 本地实现和 QA 通过，未部署 |
| Backend | NEEDS_REVIEW | 本地 dormant foundation 通过，远端 D1/email/payment 未启用 |
| QA | BLOCKED / NO_GO | 本地技术 Re-QA 通过；Owner Gate 和 Preview Release Candidate 缺失 |
| Owner Review | PENDING | 需完成法律、内容、视觉/打印签字 |
| Launch | BLOCKED | 禁止 push `main` 触发生产部署 |

## 已完成返修

1. 5 个法律/联系页改为只描述当前免费产品；占位符和 do-not-publish 标记为 0。
2. 四年龄带 starter tasks 完成 AAP/HealthyChildren.org 来源化安全审查并缩小高风险文本。
3. 生成并接入 1200×630 OG image。
4. Randomizer inline CSS 迁移到静态资源；CSP 删除 `style-src 'unsafe-inline'`。
5. 6 个增长/工具页迁移到 Kitchen Table Utility 共享设计 token。
6. 首屏字体 preload；Desktop/Mobile CLS 最终均为 0。
7. unittest 28/28、9 viewport、12-page technical smoke、Lighthouse、单页打印全部通过。

## 剩余 Gate DAG

1. **P0 Legal / Owner**
   - Owner 审阅 `privacy/terms/cookies/refund/contact`。
   - 决定适用法律是否要求公开 legal operator、地址或指定司法辖区；当前文本不猜这些事实。
   - 实测 `support@chorecharteasy.com` 收信与回复。
2. **P1 Content / Visual**
   - Owner 签字 `docs/content/STARTER-CHORES-SAFETY-REVIEW-2026-07-26.md`。
   - Owner 查看截图与最新 Letter/A4 PDF，确认视觉、字号、留白、Logo 和纸面可读性。
3. **Preview Release Candidate**
   - 仅在 Owner Gate 完成后 commit。
   - 创建 Cloudflare Preview；生产 feature flags 全 false。
   - 提供 Preview URL 和候选 commit，做独立 Preview Re-QA。
4. **Launch**
   - Preview P0=0、P1=0 且 Owner 明确批准后，才允许 push/deploy production。
   - 上线后执行 production smoke + GA/GSC/Cloudflare 数据链路复验。

## 当前 QA 证据

- `docs/QA-ACCEPTANCE-2026-07-26.md`
- `docs/QA-REPAIR-2026-07-26.md`
- `docs/content/STARTER-CHORES-SAFETY-REVIEW-2026-07-26.md`
- `docs/qa/launch-browser-qa.json`
- `docs/qa/launch-technical-smoke.json`
- `docs/qa/lighthouse-repair-home-mobile-final.json`
- `docs/qa/lighthouse-repair-home-desktop-reqa.json`
- `docs/qa/lighthouse-repair-randomizer-mobile.json`
- `docs/qa/repair-chore-chart-letter.pdf`
- `docs/qa/repair-chore-chart-a4.pdf`

## 禁止假设

- 不得假设新版本已在线。
- 不得把未获 Owner/专业复核的法律文本声明为“法律合规完成”。
- 不得假设 `support@chorecharteasy.com` 已端到端验证。
- 不得假设 Early Access 已开放或可收邮箱。
- 不得假设 Auth/email delivery、Production D1、R2、Creem 或 payment 已在生产可用。
- 不得因本地 QA 全绿而跳过 Preview Re-QA 和 Owner Review。
