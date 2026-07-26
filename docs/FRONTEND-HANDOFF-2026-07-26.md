# ChoreChartEasy Frontend Implementation Handoff

日期：2026-07-26
阶段：`06-frontend-implementation`
状态：`PRODUCTION_PASS / OWNER_FOLLOW_UP_OPEN`
部署状态：`PRODUCTION_DEPLOYED`

> Production：`https://chorecharteasy.com`，commit `fb6ad17`。正式域名 9 viewport、Maker、Consent/GPC 和 12-page technical smoke 已通过。法律、邮箱、内容与实机打印仍是 Owner follow-up，详见 `docs/PRODUCTION-LAUNCH-2026-07-26.md`。

## 1. 实现范围

### 首页

- 使用 `Kitchen Table Utility` 视觉方向重新实现 `index.html`。
- 冻结 Hero：
  - `Free printable tool · No sign-up · Ages 3–12`
  - `Make a printable chore chart that fits your child’s age`
- 完整保留生产移动页内容，不采用 Stitch Mobile 省略模块：
  - `See what you’ll print`
  - `Choose the way you want to start`
  - `Chore ideas and printable tools`
  - `Want more ready-to-print layouts?`
- 使用真实产品 UI 作为 Hero proof，不使用概念截图、stock family photo 或 Stitch 临时图。

### 真实生成器闭环

- 四个年龄带：`3–4`、`5–6`、`7–9`、`10–12`。
- Starter：`Weekly`、`Morning`、`Blank`、`Multiple kids (Beta)`。
- 可选 `Nickname or initials`，带敏感数据提醒。
- 编辑标题和所有任务。
- 添加/删除任务，最多 16 行。
- 周一到周日原生 checkbox。
- 一个 active draft 保存到 `localStorage`。
- Storage 不可用时仍可编辑和打印，并显示明确降级状态。
- 支持 URL 初始化：`template`、`age`、`paper`。
- Multiple Kids 最多四人，输出年龄带 starting suggestions，并明确不保证 effort/suitability。

### 打印

- 打印前真实预览 Dialog。
- `US Letter` / `A4`。
- `Color` / `Ink-friendly`。
- 浏览器打印和 Print-to-PDF。
- 打印 CSS 只保留 chart，移除 Header、CTA、Consent 和页面内容。
- 修复过一次真实 P0：旧 `visibility:hidden` 仍占布局，曾生成 13 页；现改为 `display:none`，已验证 Letter/A4 均为单页。

### Consent 与 Analytics

- `Essential` 默认启用。
- `Analytics` 默认关闭。
- `Advertising` 不使用。
- 同等明显入口：
  - `Accept analytics`
  - `Reject non-essential`
  - `Cookie settings`
- GA4 只在用户接受后动态加载。
- 拒绝不影响 Maker、编辑、localStorage 或打印。
- 撤回同意后更新 Consent Mode 并清理 `_ga` / `_ga_*` Cookie。
- GPC 开启时禁用 Accept，并保持 Analytics denied。
- Clarity 已从全部根级 HTML 移除。
- 事件使用 allowlist；禁止 title、nickname、task text、checkbox state 等用户输入进入 Analytics。

### 法律/联系路由

已创建并使用共享视觉系统：

- `/privacy`
- `/terms`
- `/cookies`
- `/refund`
- `/contact`

这些页面由 `docs/legal-drafts/*.md` 全量转换，不自行改写法律内容。因为运营主体、地址、联系邮箱和管辖地尚未冻结：

- 页面显示 Draft/blocked 提示。
- 页面使用 `noindex,follow`。
- 法律页已从 sitemap 移除。
- **不得按当前状态部署到生产。**

### 现有增长页

没有批量重设计所有 SEO 页，只做 P0 兼容修复：

- 移除 GA4 直载和 Clarity。
- 抽离 inline executable JS。
- Randomizer 继续可用。
- 旧 `family-builder` 和失效 `template=toddler/preschool` 深链已修正。
- 移除/校准旧的公平、减少提醒、Pro、水印等冲突承诺。

## 2. 主要生产文件

```text
index.html
assets/site.css
assets/site.js
assets/consent.js
assets/pages/chore-randomizer.js
assets/fonts/*.woff2
assets/fonts/OFL-*.txt
favicon.svg
_headers
sitemap.xml
404.html
privacy.html
terms.html
cookies.html
refund.html
contact.html
```

测试与证据：

```text
tests/test_frontend_v2.py
tests/test_growth_pages.py
docs/qa/browser-qa.json
docs/qa/home-320.png
docs/qa/home-390.png
docs/qa/home-768.png
docs/qa/home-1024.png
docs/qa/home-1440.png
docs/qa/chore-chart-letter.pdf
docs/qa/chore-chart-a4.pdf
```

## 3. 真实 QA 结果

### 静态合同

```text
python3 -m unittest discover -s tests -v
Ran 13 tests
OK
```

同时通过：

```text
node --check assets/site.js
node --check assets/consent.js
node --check assets/pages/chore-randomizer.js
git diff --check
```

### 路由与 SEO

- 13 个根级 HTML：每页恰好 1 个 H1、1 个 title。
- 所有 JSON-LD 均可解析。
- `/`、6 个工具/指南页、5 个法律/联系页：200。
- 缺失路由：404。
- 旧 GA4 直载、Clarity、Google 登录、`/api/me`、月订阅和 test checkout：扫描结果 0。

### 浏览器响应式

| Viewport | 根页面水平滚动 | 可见越界元素 | 主按钮最小高度 | Console errors | Failed requests |
|---:|---:|---:|---:|---:|---:|
| 320 | 0 | 0 | 49.27px | 0 | 0 |
| 390 | 0 | 0 | 44px | 0 | 0 |
| 768 | 0 | 0 | 44px | 0 | 0 |
| 1024 | 0 | 0 | 44px | 0 | 0 |
| 1440 | 0 | 0 | 44px | 0 | 0 |

说明：Chart table 在小屏拥有独立横向滚动区域；`documentElement.scrollWidth` 会包含表格内部宽度，但根页面实际 `scrollX=0`，且无元素在滚动容器外可见越界。

### 键盘与字体

- 首次 Tab：Skip Link 可见。
- Focus outline：`3px solid`。
- Body：`Atkinson Hyperlegible`，loaded。
- H1：`Bricolage Grotesque`，loaded。
- 字体请求全部本地。

### Consent

| 场景 | 结果 |
|---|---|
| 首次访问 | GA4/Clarity 请求 0，Cookie 空 |
| Reject | 偏好存为 false，第三方请求 0 |
| Accept | 之后才注入 `gtag.js`，之后才出现 `_ga` |
| Withdraw | Consent Mode denied，`_ga` / `_ga_*` 清空 |
| GPC | Accept 禁用，第三方请求 0 |

### Storage / No-JS / Multiple Kids

- localStorage 不可用：5 个任务行仍可编辑，状态为 `Draft not saved`。
- JavaScript 禁用：内容、导航、指南和 legal links 可读；显示编辑/打印需要 JS 的说明。
- Multiple Kids：最多 4 人；第 4 人后 Add disabled；生成 12 行；显示 adult-review boundary。

### 打印

| 输出 | 页数 | MediaBox | 文件大小 |
|---|---:|---:|---:|
| Letter | 1 | `612 × 792 pt` | 31,141 bytes |
| A4 | 1 | `594.96 × 841.92 pt` | 30,956 bytes |

### Cloudflare Pages runtime

本地命令：

```bash
npx --yes wrangler pages dev . \
  --port 8789 \
  --ip 127.0.0.1 \
  --compatibility-date=2026-04-08
```

实测：

- Wrangler 解析 6 条 `_headers` 规则。
- CSP、HSTS、X-Frame-Options、COOP、Permissions-Policy 等响应头存在。
- CSP 下本地字体、`consent.js`、`site.js` 正常加载。
- 编辑器生成 5 行。
- Console error 0。
- 未 consent 时追踪请求 0。

备注：当前缓存 Wrangler 为 `4.80.0`，默认使用 2026-07-26 时，其内置 runtime 最高只支持 2026-04-08；因此本地 QA 显式传兼容日期。生产静态部署 workflow 不依赖这个本地命令。

## 4. 已知阻塞与风险

### 发布阻塞

1. **Legal 仍 BLOCKED**：需确认运营主体、地址、联系邮箱、司法管辖地。
2. **Contact 邮箱未验证**：当前 Draft 中保留占位符，不能发布。
3. **Early Access 后端已实现但默认关闭**：`/api/early-access` 已完成本地 D1 和安全联调；首页仍不提交邮箱，生产 `EARLY_ACCESS_ENABLED=false`，待营销 consent、退订、删除和保留期批准后再做前端联调。
4. **Age task source/review 未冻结**：当前任务是一般 starting ideas，不应宣传为专家或专业建议。
5. **Owner Visual Review 未完成**：需要人工查看五档截图、Letter/A4 PDF、Logo 和真实页面。

### 非阻塞技术债

- 旧增长页仍使用 `guide.css` 和 inline CSS，故 CSP `style-src` 暂时保留 `'unsafe-inline'`；`script-src` 已无 `'unsafe-inline'`。
- 当前是无构建静态站，未引入 bundler；这符合 Lean 验证阶段，但组件复用依赖手工维护。
- OG image 尚未生成。
- 现有增长页只完成合规和合同最小修复，未按新设计系统全面重构。

## 5. Owner Review 清单

1. 打开 `docs/qa/home-1440.png`、`home-390.png`，确认视觉方向和首屏信息密度。
2. 打开 `docs/qa/chore-chart-letter.pdf`、`chore-chart-a4.pdf`，确认打印字号、行高和留白。
3. 确认新 Logo 是否接受。
4. 确认四年龄带任务内容是否需要专业/家长人工复核。
5. 提供并验证 legal operator、address、contact email、jurisdiction。
6. 决定是否批准 Early Access 的营销 consent、邮件服务商、退订/删除和保留期；批准前保持首页无提交、生产 flag 关闭。

## 6. 发布纪律

当前未 commit、未 push、未部署。由于 `main` push 会触发 GitHub Actions → Cloudflare Pages，只有 Owner Review 通过并解除 Legal P0 后，才应提交和 push。

[NEEDS_REVIEW]
