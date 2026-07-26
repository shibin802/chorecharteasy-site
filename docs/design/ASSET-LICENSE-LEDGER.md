# ChoreChartEasy 设计素材与授权台账

日期：2026-07-26
状态：`NEEDS_REVIEW`

> 本台账记录设计阶段素材来源、授权和生产可用状态。Stitch 生成结果默认只作为设计参考，不能因为“能下载”就直接认定具有生产授权或技术质量。

| ID | 素材 | 来源/生成方式 | 授权/权属 | 生产状态 | 必要动作 |
|---|---|---|---|---|---|
| A-001 | `Bricolage Grotesque` | Google Fonts 官方仓库 `google/fonts/ofl/bricolagegrotesque` | SIL Open Font License 1.1；已访问官方 `OFL.txt` 验证 | 已 self-host 到 `assets/fonts/` | 生产 CSS 仅引用本地 WOFF2；OFL 1.1 文本随仓库保留 |
| A-002 | `Atkinson Hyperlegible` | Google Fonts 官方仓库 `google/fonts/ofl/atkinsonhyperlegible` | SIL Open Font License 1.1；已访问官方 `OFL.txt` 验证 | 已 self-host 到 `assets/fonts/` | 生产 CSS 加载 400/700；OFL 1.1 文本随仓库保留 |
| A-003 | 现有 `favicon.svg` | 仓库原有蓝底白色 check 几何 SVG | 历史素材，已由 A-004 替换 | 已退出生产 | Git 历史保留，不继续使用 |
| A-004 | `logo-mark-concept.svg` | 本阶段为 ChoreChartEasy 原创绘制的纸张折角 + check SVG | 项目原创；未使用第三方图形或商标 | 已进入 `favicon.svg` 与站点 Header/Footer；仍待 Owner Review | 已在 16/64px 和暖纸/白纸背景检查；Owner 可要求回退 |
| A-005 | `logo-mark-16.png` / `logo-mark-64.png` | Chrome 从 A-004 本地渲染 | A-004 派生物 | 仅评审证据 | 正式 favicon 应由源 SVG 生成全尺寸包 |
| A-006 | Stitch A/B/C HTML | `@google/stitch-sdk@0.3.5`，使用项目 Prompt 自动生成 | Stitch 输出使用权/服务条款尚未单独归档 | 仅设计参考，禁止直接上线 | 前端重写语义 HTML/CSS/JS；移除 Tailwind CDN 和临时依赖 |
| A-007 | Stitch API PNG 缩略图 | Stitch `screen.getImage()` | 同 A-006 | 仅 API 证据；尺寸仅约 138×512 | 不作公开截图或营销素材 |
| A-008 | 浏览器 Desktop/Mobile renders | Chrome 从本地 Stitch HTML 与真实生产 HTML 分别渲染 | 项目设计与前端 QA 证据 | 真实实现截图已生成在 `docs/qa/home-{320,390,768,1024,1440}.png` | Stitch render 继续仅作设计参考；对外展示只使用真实实现截图 |
| A-009 | Stitch inline SVG icons | Stitch 精修版自动生成 | 生成来源；未逐个做相似性/商标审核 | 可作构图参考，不直接复制整包 | 前端使用项目自己的小型 SVG icon set；逐个人工审查 |
| A-010 | Material Symbols | Stitch 首版外部字体图标 | Google Material Symbols；外部依赖 | 已从 Desktop 精修目标移除；Mobile 首稿仍有，二次返修中 | 生产不得依赖该外部 icon font；改 inline SVG |
| A-011 | Printable chart previews | 由产品真实 HTML/CSS 生成 | 项目自己的 UI 和任务文本 | Letter/A4 单页 PDF 已通过尺寸检查；内容仍待 Owner 视觉审核 | QA 证据：`docs/qa/chore-chart-letter.pdf`、`docs/qa/chore-chart-a4.pdf` |
| A-012 | Age task copy | PRD task library / 人工审核数据 | 项目内容；来源台账未完成 | `human_reviewed` 前不可作为专业建议 | 补 `source_note`、`review_status`、`reviewed_at` |
| A-013 | Stitch temporary image URLs | 本次生成未发现 `<img>`，但生成器可能后续加入 | 不稳定外链、许可不冻结 | 禁止生产 | 每次生成都扫描 `lh3.googleusercontent.com/aida-public` 和 `<img>` |
| A-014 | Stock family/children images | 本设计明确不使用 | 不适用 | 禁止 | 不新增；Product Proof 使用真实输出 |
| A-015 | OG image | 未生成 | 待创建 | BLOCKED | 真实前端完成后，用实际 chart screenshot + HTML text 制作 1200×630 |
| A-016 | Emoji | 当前产品模板中存在 emoji；新设计不将其作为 UI icon | 平台字体表现和商业使用口径不统一 | UI 禁用；内容装饰待审核 | 用自有 SVG 或纯文字；Printable 是否保留由素材审核决定 |

## 生产资产规则

1. 所有生产素材必须有 `source`、`license`、`commercial_use`、`attribution_required`、`review_status`。
2. Stitch HTML、PNG 和 screenshot 都是设计证据，不是上线凭证。
3. Stitch 输出中任何外链字体、图标、图片必须重新审核；不能只因来自 Google 域名就默认可商用。
4. 不使用儿童照片、家庭 stock photo 或拟真人物图，避免不必要的肖像、授权和儿童形象风险。
5. 产品截图必须来自真实实现，不能把概念 mockup 标成真实输出。
6. Logo 不模仿竞品，不使用模板站下载图标，不加入认证、盾牌或儿童头像。
7. 字体采用 CDN 时更新 Privacy/Cookie 技术清单；更稳妥方案是 self-host OFL 字体并保留授权文件。
8. OG、favicon、apple-touch-icon 和 social image 在前端最终 QA 后统一生成。

## 阻塞项

- Stitch 服务条款/生成输出商用边界尚未归档，故 Stitch 整体 HTML 不直接上线。
- Age task 来源与人工审核没有冻结。
- 真实 Letter/A4 PDF 已生成；纸张尺寸与单页性已验证，但仍待 Owner 视觉审核。
- Logo 尚待 Owner Review。

[NEEDS_REVIEW]
