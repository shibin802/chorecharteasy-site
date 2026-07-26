# ChoreChartEasy 视觉设计与页面生成 Prompt — Design Handoff

## 1. 基本信息

- 项目：`ChoreChartEasy`
- 域名：`https://chorecharteasy.com`
- 当前阶段：`06-design`
- 目标市场：US / English
- 日期：2026-07-26
- 状态：`NEEDS_REVIEW`
- 推荐方向：`A — Kitchen Table Utility`
- Stitch SDK：`@google/stitch-sdk@0.3.5`
- Stitch 项目 ID：`10112449553961527926`

状态说明：设计系统、页面 Prompt、3 套 Desktop 方向、推荐方向精修 Desktop、Mobile 及二次 Mobile 修订均已真实生成；但 Mobile 长页被 Stitch 自动压缩、合规仍为 BLOCKED、生成 HTML 不是生产代码，故不能标记 Design DONE。

---

## 2. 上游输入

- `docs/PRD-product-definition-v2-lean-validation-2026-07-26.md`
- `docs/PRICING-commercial-model-calibration-2026-07-26.md`
- `docs/COMPLIANCE-legal-baseline-analysis-2026-07-26.md`
- `docs/COPY-home-seo-freeze-2026-07-26.md`
- 当前 `index.html` 和 `favicon.svg`
- Stitch 认证环境变量：执行时在内存中做 `STITCH_API_KEY ← STITCH_API_TOKEN` 映射；没有打印、复制或写入仓库 Token。

### 2.1 已确认

- 主页面不是 SaaS dashboard，而是面向家长的 printable utility。
- 首屏必须出现真实编辑器/输出，不使用 stock family photo。
- 主 CTA 是生成免费图表，不是登录、Pricing 或购买。
- 免费核心不能被付费墙阻断。
- Family Pack 只做 planned early-access interest test。
- 多孩是 Beta，不承诺公平。
- 成人使用与儿童数据最小化必须进入视觉层级。
- US Letter/A4、ink-friendly、浏览器打印是视觉系统的一部分。

### 2.2 待确认

- Owner 对 A/B/C 的最终视觉偏好。
- Logo concept 是否采用。
- 字体使用 Google Fonts CDN 还是 self-host。
- 真实 Letter/A4 产品 screenshot。
- Age task 人工审核结果。
- Family Pack early-access 是否在首次实现中展示。

---

## 3. 当前线上视觉审计

当前首页基础视觉：

- Inter/system font。
- 主色 `#1d4ed8` 通用蓝。
- 淡蓝渐变 builder / Pro panel。
- 居中 Hero。
- Feature、Steps、Pricing 大量统一圆角卡片。
- 模板列表使用 emoji 作为图标。
- Pro、Pricing、Login 抢占页面层级。

### 3.1 保留

- 44px 最小控件尺寸。
- Chart table 是清晰的核心交互。
- 响应式断点基本存在。
- Print CSS 已有基础结构。
- 可编辑任务、添加任务和本地草稿是有效产品 Proof。

### 3.2 必须重做

- 通用 SaaS 蓝白语言。
- 全居中 Hero。
- 重复三卡片布局。
- Emoji icon system。
- Pricing/Pro/Google Sign-in。
- 大背景 watermark upsell。
- 绝对隐私、安全、公平话术。
- 精确年龄选择器和必填 Child name。

---

# 4. Visual Style Rationale

## 4.1 方向 A：Kitchen Table Utility — 推荐

### 概念

像一份放在厨房桌上的高质量家庭工作表：暖纸、清楚墨色、真实表格、手册式细节。

### 适配性

- **站点类型**：Printable 工具本身就是视觉资产；纸张隐喻与输出一致。
- **用户**：家长需要可靠、快速、可扫读，不需要儿童娱乐化界面。
- **内容密度**：可以容纳编辑器、FAQ、年龄指南和安全说明。
- **SERP 预期**：相比 Canva 模板和 App dashboard，更像“立即可用的免费工具”。
- **转化**：Hero 右侧直接展示真实 weekly chart，减少对解释和 testimonial 的依赖。

### 风险

- 暖纸色过重会让页面显旧。
- Print-workbook 装饰过多会干扰工具。
- Coral CTA 必须选深色版本以保证对比度。

### 控制

- Canvas 只在网页使用，真实 printable 使用白底。
- 只允许 registration line、checkbox、paper corner 三类装饰。
- CTA 固定 `#C9432B`，不使用首版 `#E85D3F`。

## 4.2 方向 B：Editorial Family Workbook

### 概念

独立出版商式家庭工作手册：Fraunces、纸张标签、章节编号、砖红/森林绿。

### 优点

- 内容页和年龄指南表现力强。
- 与通用 AI/SaaS 模板差异最大。
- 长文 SEO 的层次好。

### 风险

- 工具区可能被“杂志感”削弱。
- Fraunces 在密集控件旁容易显得过度风格化。
- 对首页核心转化不如 A 直接。

### 结论

保留给 Age Guide 内容页作为局部 editorial pattern，不作为全站主方向。

## 4.3 方向 C：Modular Fridge Board

### 概念

整齐的冰箱计划板与文具系统：模块色签、实线边框、清晰任务格。

### 优点

- 状态与模块非常直观。
- 对移动端分块和编辑器友好。
- 比传统蓝白工具更有识别度。

### 风险

- 稍不克制就会变成儿童产品。
- 色块太多会影响 Printable/Ink-friendly 心智。
- 可能强化“多孩家庭管理 App”而不是一次打印工具。

### 结论

可以借用其移动端分区标签，不作为品牌主方向。

## 4.4 选择结论

推荐 A，因为它同时满足：

1. 工具优先。
2. 真实输出优先。
3. 成人使用。
4. Printable 场景识别。
5. SEO 长文可承载。
6. 非通用 SaaS。
7. 不依赖人物插图或虚假 social proof。

---

# 5. Design System

设计真源：

- `docs/design/DESIGN.md`
- `docs/design/tokens.dtcg.json`

## 5.1 Typography

- Display：`Bricolage Grotesque` 600/700。
- Body/UI：`Atkinson Hyperlegible` 400/700。
- 非默认字体：**PASS**。
- 禁止生成器替换为 Inter、Roboto、Arial、Atkinson Hyperlegible Next。

## 5.2 Color

| Token | HEX | 用途 |
|---|---|---|
| Canvas | `#F6F1E7` | 网页背景 |
| Paper | `#FFFDF8` | 编辑器、输入、纸张 |
| Ink | `#17313A` | 正文/标题 |
| Primary | `#1F6D62` | 工具状态、链接、选择 |
| Action | `#C9432B` | 主 CTA |
| Action hover | `#B83A25` | CTA hover |
| Highlight | `#E9B949` | 标签/步骤 |
| Border | `#C9D7D1` | 边框 |
| Muted | `#5B6B70` | 辅助文本 |

### 对比度证据

| Pair | Contrast |
|---|---:|
| Ink / Canvas | 12.14:1 |
| Ink / Paper | 13.44:1 |
| White / Action | 4.86:1 |
| White / Primary | 6.14:1 |
| Ink / Highlight | 7.48:1 |
| Muted / Paper | 5.46:1 |

首版 coral `#E85D3F` + white 只有 3.46:1，已拒绝。

## 5.3 Shape

- Input/button：8px。
- Panel：12–16px。
- Pill 只用于 Age、Beta、Planned 短标签。
- 不使用统一 20–24px 大圆角。
- 不使用玻璃、发光、3D、紫蓝渐变。

非紫蓝白模板：**PASS**。

## 5.4 Spacing

- 4px base。
- Component gaps：12/16/24/32。
- Section gaps：64/96。
- Desktop max width：1180px。
- Long-form width：720px。
- Mobile gutter：16px。
- Minimum target：44px。

## 5.5 Depth

- 默认 surface 无 shadow。
- Paper preview 允许单层 `0 12px 30px rgba(23,49,58,.10)`。
- 主要用边框、纸张叠层、背景段落区分层级。

---

# 6. Logo System

## 6.1 概念

`paper sheet + folded corner + checked task`

相较现有蓝底白勾：

- 保留 check 的快速识别。
- 增加纸张/打印心智。
- 改为主品牌 teal + coral。
- 不加入儿童头像、盾牌或星级。

## 6.2 交付

- `docs/design/assets/logo-mark-concept.svg`
- `docs/design/assets/logo-mark-16.png`
- `docs/design/assets/logo-mark-64.png`

Logo 16px 可辨识：已由 Chrome 真实渲染 `16×16` 文件，但仍需 Owner 目视确认。

## 6.3 后续

- Owner Review 后再替换根目录 `favicon.svg`。
- 生成 favicon 16/32、apple touch 180、PWA 192/512。
- Wordmark 使用 HTML + Bricolage Grotesque，不急于转 path，避免不必要的 SVG 复杂度。

---

# 7. Homepage Desktop Contract

## 7.1 Header

- 72px。
- Logo + wordmark。
- How it works、Print examples、Age guides、FAQ。
- 主 CTA：Make a chart。
- 禁止 Pricing、Sign in、avatar、Pro。

## 7.2 Hero

- 48/52 asymmetric split。
- 左：Copy Freeze Hero。
- 右：真实 weekly chart sheet。
- Maker 在首屏或一次短滚动内。
- 不使用人物图、抽象插图或 testimonial。

## 7.3 Maker

- Age bands：3–4、5–6、7–9、10–12。
- Optional nickname/initials。
- Weekly、Morning、Blank、Multiple Kids Beta。
- Privacy helper 与 adult review helper 不得被设计删除。

## 7.4 Editor

- 页面最强视觉权重。
- 编辑 title/tasks。
- Mon–Sun。
- Add a task。
- Letter/A4。
- Preview and print。
- Clear local data。
- 不做 SaaS sidebar、analytics dashboard 或 cloud library。

## 7.5 Product Proof

- Weekly color Letter。
- Weekly ink-friendly A4。
- Morning routine Letter。
- 使用真实 output，不能用概念图冒充。

## 7.6 Long-form

必须完整落位：

- Skip blank design canvas。
- Three steps。
- Starting points。
- Adult/privacy block。
- Age guides/tools。
- Planned Family Pack。
- FAQ。
- Final CTA。
- Legal footer。

---

# 8. Mobile Contract

## 8.1 Viewports

- 主设计：390px。
- 最小验收：320px。
- Tablet：768px。
- Page 不横向滚动。
- Chart table 可在独立容器横向滚动。

## 8.2 Layout

- 单栏。
- Header：mark + wordmark + Make a chart + menu。
- Hero chart preview 放在 CTA 下。
- Age options 2×2。
- Starter full-width rows。
- Editor controls 置于表格上方/下方。
- Preview and print 全宽。
- FAQ full-width disclosure rows。

## 8.3 Chart table

- Task first column 可 sticky。
- Day checkbox target 44px。
- 显示 `Swipe sideways to see all days`。
- 不压缩到无法读取。

## 8.4 Consent

Mobile 设计状态必须有：

- Accept analytics。
- Reject non-essential。
- Cookie settings。
- Accept/Reject 同等尺寸和显著度。
- 不遮挡 Final CTA/Footer。

## 8.5 Stitch Mobile 限制

Mobile 二次修订已恢复：

- Adult-use block。
- Final CTA。
- Reject non-essential。
- Cookie settings。
- 正确字体。
- Inline SVG。
- 删除 developmental milestones。

但仍自动省略/合并：

- `See what you’ll print` 标题。
- `Choose the way you want to start` 标题。
- `Chore ideas and printable tools` 标题。
- `Want more ready-to-print layouts?` 标题。

因此：

> Mobile HTML 是布局/组件/Consent 参考，不是内容真源。完整内容继承 Desktop + Copy Freeze。

---

# 9. 状态设计合同

## 9.1 Default

- Weekly starter ready。
- 选中一个 age band。
- Editor 可立即编辑。

## 9.2 Empty

- Blank chart 含 3–5 个空 task rows。
- CTA：Add a task。
- 不展示“Nothing here”式死状态。

## 9.3 Loading

```text
Creating your starting chart…
```

- 保留原布局高度。
- 生成是本地即时逻辑时不使用长 skeleton。

## 9.4 Storage unavailable

使用 Copy Freeze 完整状态文案。

- 继续编辑可用。
- 明确 draft 不会恢复。
- 不清空当前内容。

## 9.5 Restored draft

- 小型 inline status。
- 提供 Clear local data。
- 不写 cloud saved。

## 9.6 Print overflow

- 指向具体问题：task 太长、paper size 不匹配。
- 保留当前 editor。
- 提供重试。

## 9.7 Error

- 红色不单独传达状态。
- Error icon + 标题 + recovery action。
- 不使用 toast 作为唯一通知。

## 9.8 Planned paid

- `PLANNED · NO CHARGE TODAY`。
- 不作为 live checkout。
- 不展示 Buy、Pro、subscription、countdown。

## 9.9 Permission/Auth

- P0 不存在。
- 不设计 Account/Google login state。

## 9.10 Cookie consent

- Essential 默认。
- Analytics 默认 off。
- Accept/Reject equal prominence。
- Settings 可撤回。

---

# 10. Page Family Contract

文件：`docs/design/PAGE-FAMILY-PROMPTS.md`

覆盖：

1. Printable Tool Landing。
2. Age Guide + Embedded Tool。
3. Morning Routine Tool。
4. Chore Randomizer。
5. Multiple Kids Beta。
6. Legal/Contact family。
7. 404。
8. 通用生成后 QA Prompt。

规则：

- 内页复用 Design System，不允许前端自由换视觉。
- Age page 不是只替换数字。
- Legal page 是阅读界面，不是 marketing card page。
- 404 保持 HTTP 404。
- SEO 文案必须在语义 HTML 中。

---

# 11. Stitch 真实生成证据

## 11.1 认证

```text
AUTH_OK projects=0
```

Token 值未输出。

## 11.2 项目

```text
Project ID: 10112449553961527926
```

## 11.3 Screens

| Screen | Screen ID | 状态 |
|---|---|---|
| A Kitchen Table Utility | `59ebbaf3cbab4f06a1a8f796cca1f42d` | 首稿，Copy QA 不通过 |
| B Editorial Workbook | `020094ddb56d4714a41c7d9b2d89a2f6` | 对比方向 |
| C Modular Fridge Board | `5acb2629359a4ecf872053b1d511f036` | 对比方向 |
| A Refined Desktop | `f454efcc4bf345d38f93c02db8a78e5d` | 推荐 Desktop 参考 |
| A Mobile | `eae28559483246638c3b37abd9e901b6` | 首稿，QA 不通过 |
| A Refined Mobile | `322db98e58654f0bab098caf36b97d5a` | 推荐 Mobile 参考；长页仍有省略 |

## 11.4 Desktop refined QA

通过：

- Exact H1。
- 11 个主要 H2。
- Privacy helper。
- Adult review helper。
- Family Pack planned price。
- Seven FAQ questions。
- Final CTA。
- Six footer actions。
- 23 inline SVG。
- 无 Material Symbols。
- 无 motor skills/developmental milestones。
- 无 MOST POPULAR/DRAFT SAVED。
- 无 Pricing/Sign in。
- CTA 色值修复为 `#C9432B`。

## 11.5 Browser evidence

- A Desktop：`1440×7000`。
- B Desktop：`1440×7000`。
- C Desktop：`1440×7000`。
- A Refined Desktop：`1440×9000`。
- A Mobile：`390×10000`。
- A Refined Mobile：`390×11000`。
- Console：0 JavaScript errors。
- Console warning：Tailwind CDN 不得用于 production。

---

# 12. 生成 Prompt 交付物

- `docs/design/prompts/stitch-direction-a-kitchen-table-utility.txt`
- `docs/design/prompts/stitch-direction-b-editorial-workbook.txt`
- `docs/design/prompts/stitch-direction-c-modular-fridge-board.txt`
- `docs/design/prompts/stitch-direction-a-refinement.txt`
- `docs/design/prompts/stitch-direction-a-mobile.txt`
- `docs/design/prompts/stitch-direction-a-mobile-refinement.txt`
- `docs/design/PAGE-FAMILY-PROMPTS.md`

Prompts 内没有 Token、Cookie、Account ID 或私有凭证。

---

# 13. 素材合同

文件：`docs/design/ASSET-LICENSE-LEDGER.md`

### 已确认

- Bricolage Grotesque：SIL OFL 1.1。
- Atkinson Hyperlegible：SIL OFL 1.1。
- 新 Logo concept：项目原创 SVG。
- 本次无 stock photo、children image、第三方 illustration。

### 不可直接生产

- Stitch 整体 HTML。
- Stitch API 138px thumbnail。
- Tailwind CDN。
- 生成器临时图片 URL。
- 未审核 inline SVG icon pack。
- 概念 screenshot。

---

# 14. Frontend Implementation Contract

1. 读取 `COPY-home-seo-freeze` 作为文字真源。
2. 读取 `DESIGN.md` / `tokens.dtcg.json` 作为样式真源。
3. 读取 A Refined Desktop HTML 只提取构图，不复制事实和交互。
4. Mobile 不得因为 Stitch 省略模块而删除内容。
5. 不使用 Tailwind CDN；当前项目可用 plain CSS variables，或构建期编译。
6. 不恢复旧蓝色 token、Inter、紫色 theme 或 emoji icon。
7. 不恢复 Pricing/Pro/Login/Subscription。
8. Consent、Clarity mask、GPC 和法律页面必须与 Compliance 同批实现。
9. `Preview and print` 必须是完整 preview → system print 流程。
10. `US Letter` 和 `A4` 必须有真实样式和 QA。
11. 打印时不输出网页 canvas 背景、CTA、helper、cookie banner。
12. 免费版不使用大面积背景 watermark。
13. 所有 Stitch copy 必须用 Copy Freeze 覆盖。
14. 所有 route 保留 canonical、metadata、heading hierarchy、FAQ/schema。
15. 所有新增素材进入资产台账。

---

# 15. 验收清单

- [x] Visual Style Rationale 比较 3 个方向。
- [x] 推荐方向与站点类型、内容密度、用户和 SERP intent 对齐。
- [x] 非默认字体。
- [x] 非紫蓝白模板。
- [x] Logo 16px 可辨识文件已生成。
- [x] 有 desktop/mobile 交付。
- [x] 设计 token 可提取。
- [x] DTCG token 已导出。
- [x] Design lint：0 errors。
- [x] CTA 对比度达到 WCAG AA。
- [x] 关键 Desktop 状态和内容齐全。
- [x] 3 套 Stitch Desktop 真实生成。
- [x] 推荐 Desktop 真实精修。
- [x] Mobile 真实生成并二次返修。
- [x] 浏览器本地截图已生成。
- [x] Stitch HTML 禁词/风险词自动扫描。
- [x] 资产来源和生产状态已记录。
- [x] 页面家族 Prompt 已提供。
- [ ] Owner 尚未目视选择 A/B/C。
- [ ] Mobile 全量内容没有由 Stitch 单屏完整保留。
- [ ] 合规 P0 尚未修复。
- [ ] 真实 Letter/A4 output 素材未冻结。
- [ ] 设计还未进入生产前端。

---

# 下游交接：视觉设计与页面生成 Prompt 摘要

## 当前结论

- 状态：`NEEDS_REVIEW`
- 一句话结论：推荐 `Kitchen Table Utility`；Desktop 精修真源可供前端还原，Mobile 只作为布局/状态参考，完整内容必须继承 Copy Freeze。

## 关键输入

- 项目：ChoreChartEasy。
- 当前阶段：06-design。
- 上游资料：PRD、Pricing、Compliance、Copy Freeze、当前 HTML。

## 本阶段交付物

- Design System：`docs/design/DESIGN.md`。
- Tokens：`docs/design/tokens.dtcg.json`。
- Handoff：本文件。
- Homepage Prompts：`docs/design/prompts/`。
- Route Prompts：`docs/design/PAGE-FAMILY-PROMPTS.md`。
- Asset Ledger：`docs/design/ASSET-LICENSE-LEDGER.md`。
- Logo concept：`docs/design/assets/`。
- Stitch HTML/PNG：`docs/design/stitch-artifacts/`。
- Browser screenshots：`docs/design/browser-renders/`。

## 质量门槛自检

- 通过项：3 方向 rationale、Design tokens、Desktop/Mobile artifacts、Logo 16px、WCAG color、Copy/compliance repair、route prompts、asset ledger。
- 未通过项：Owner visual review、Mobile full long-page fidelity、production implementation、Compliance P0。

## 风险

- P0：把 Stitch HTML 直接上线，导致 Tailwind CDN、假交互、Copy 偏移和合规逻辑缺失。
- P1：前端按 Mobile HTML 删除下半页 SEO/FAQ/隐私内容；真实打印输出与 mockup 不一致。
- P2：暖纸/Coral 使用过重；Logo 或 paper motif 装饰过度。

## 给下游的最小必要信息

- 下一阶段：`frontend-site-automation` / `software-engineering-workflow`，随后 PM/SEO/Compliance review 和 QA。
- 必须读取：PRD v2、Pricing、Compliance、Copy Freeze、`DESIGN.md`、本 Handoff、Asset Ledger。
- 不能假设：Stitch HTML 是生产代码；Mobile 已包含所有内容；Consent/Clarity 已实现；Family Pack 可购买；mockup 是真实打印结果。
- 下游不能改动：Hero copy/CTA intent、Adult/safety/privacy blocks、planned/no-charge wording、Letter/A4 contract、free core、legal footer、tokens 和字体。

## 建议启动 Prompt

```text
执行 ChoreChartEasy 前端实现阶段。
先读取 PRD v2、Pricing、Compliance、COPY-home-seo-freeze、docs/design/DESIGN.md、docs/design/DESIGN-HANDOFF-2026-07-26.md 和 Asset Ledger。
以 A Refined Desktop 的布局为视觉参考，但不要直接复制 Stitch HTML；以 Copy Freeze 为文字真源、DESIGN.md 为 token 真源、现有产品逻辑为功能基线。
先修 Compliance P0 和旧 SaaS/订阅边界，再实现首页、Print Preview、Letter/A4、响应式和状态。完成后必须实际浏览器 QA、打印 QA、Network/Console/Accessibility 检查；不要部署，等待 Owner Review。
```

[NEEDS_REVIEW]
