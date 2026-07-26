# ChoreChartEasy 产品定义与 PRD v2 — Lean Validation

## 1. 基本信息

- 项目：`ChoreChartEasy`
- 域名：`https://chorecharteasy.com`
- 当前阶段：`02-product`
- 目标市场：US / English
- 站点类型：工具 + Printable + 内容的混合型站点（utility-first hybrid）
- 日期：2026-07-26
- 状态：`DONE`（产品定义完成；付费方式和“多孩公平”价值仍需实验验证）
- 本版目标：替代 2026-07-18 的大而全 PRD，先验证真实用户是否完成“生成 → 编辑 → 打印”，避免过早建设订阅 SaaS。

---

## 2. 上游输入与证据边界

### 2.1 已读取资料

- `COMPETITOR_RESEARCH_2026-07-18.md`
- `docs/PRD-product-definition-2026-07-18.md`
- `https://chorecharteasy.com` 线上路由与当前实现
- ShipSolo `keyword-research-agent` 研究结果
- ShipSolo `product-definition-prd` v2.3.0
- GSC 冷启动数据：7 次曝光、0 点击、平均排名 28.6；已出现 `chore chart creator`、`chore chart generator`

### 2.2 有效市场证据

- `printable chore chart`：US 月搜索量约 1,900、KD 21（Semrush 2026-07-18）。
- `chores for 5 year olds`：约 1,600、KD 20。
- `chore chart maker`：约 210、KD 14。
- `chore chart generator`：约 170、KD 19。
- `random chore generator`：约 140、KD 0。
- Authority Score 仅 8 的 ChoreChartAI 能在多个工具词进入前十，说明小站可进入 SERP。
- RewardCharts4Kids 约 21,620 月访问、自然搜索占比约 81%，说明“Printable + 长尾页面矩阵”成立。
- ChoreChartAI 约 3,067 月访问，说明单一生成器有需求，但市场天花板有限。

### 2.3 缺失证据

- `[待确认]` 过去 12 个月 Google Trends 曲线；ShipSolo 定向 API 本轮退化到共享缓存，不能作为 chore 词证据。
- `[待确认]` 用户从生成到打印的真实转化率。
- `[待确认]` 用户是否会第二周回来继续使用。
- `[待确认]` 多孩家长对“公平分配”的真实优先级。
- `[待确认]` 一次性购买和订阅的支付意愿差异。
- `[待确认]` 一手英语家庭可用性测试和访谈。

---

## 3. 本阶段结论

### 3.1 一句话决策

**继续做，但只做一个能在 30–60 秒内生成、编辑并打印适龄家务表的低摩擦工具；订阅、云同步和复杂公平算法全部后置到行为证据出现之后。**

### 3.2 产品机会

搜索用户的第一任务不是“管理一个长期家庭 SaaS”，而是：

> 我现在需要一张适合孩子年龄、看起来清楚、可以马上编辑和打印的 chore chart。

因此，首版竞争单位不是“家庭管理系统”，而是“一次成功打印”。

### 3.3 产品北极星

**Weekly Qualified Prints**：每周完成打印预览并触发打印/PDF 导出的独立计划数。

不以页面访问、注册数、生成次数或 Pro Gate 曝光作为北极星。

---

## 4. ICP 与真实用户任务

### 4.1 用户分层

| 用户分层 | 触发场景 | 当前替代方案 | 核心痛点 | 产品角色 | 优先级 |
|---|---|---|---|---|---:|
| A. 立即需要 Printable 的家长 | 新的一周、开学、孩子开始承担家务 | Google 图片、Canva、纸笔、下载 PDF | 不想设计，不想注册，只想快速得到可打印结果 | **主 ICP** | P0 |
| B. 不知道什么任务适龄的家长 | 孩子 3–8 岁，开始培养习惯 | 搜索文章、问朋友、ChatGPT | 清单太泛，不知道是否安全、是否可执行 | SEO 获客 + 预设转化 | P0 |
| C. 多孩家庭家长 | 每周分工、孩子争论不公平 | 白板、Excel、口头轮换 | 不同年龄难度不同，重新分配费脑 | 差异化实验 | P1 |
| D. Homeschool/教师/照护者 | 新学期、多人轮值 | TPT、Canva、课堂 Job Chart | 需要多人视觉表和可复用模板 | 观察，不为其定制首版 | P2 |

### 4.2 主 ICP

美国英语家长，通常在手机上搜索 `printable chore chart`、`chore chart maker` 或某个年龄的 chores；希望不注册账号，在一分钟内得到一张能在 US Letter/A4 上正常打印的表。

选择理由：

- 需求触发明确且即时。
- 搜索词与产品动作直接对应。
- 不依赖尚未验证的长期留存和订阅意愿。
- 可通过 Google SEO、Pinterest 和 Printable 社区触达。

### 4.3 P0 Jobs to Be Done

1. 当我需要本周的家务表时，让我不用从空白模板开始，在一分钟内得到一张可打印计划。
2. 当我不知道孩子能做什么时，给我适龄且可观察的任务建议，同时允许我自行修改。
3. 当我用手机访问时，让我能顺利完成输入、编辑和打印预览，而不是必须使用桌面电脑。
4. 当打印结果不合适时，让我在打印前发现截断、分页和纸张方向问题。

### 4.4 P1 验证任务

1. 当家里有多个孩子时，按年龄给出一个可解释的初始分工，家长能锁定和调整。
2. 当下周继续使用时，恢复上周计划并快速复制/轮换，而不是重新输入。

P1 任务只有在 P0 打印行为成立后进入开发。

---

## 5. 定位与竞争边界

### 5.1 定位语句

```text
FOR parents who need a printable chore chart now,
WHO do not want to design a template or create another family account,
ChoreChartEasy IS an age-aware printable chore chart maker
THAT turns a child's age and a few choices into an editable, print-ready weekly chart in under a minute,
UNLIKE generic template libraries and screen-heavy chore apps,
ChoreChartEasy starts with realistic chores and keeps the child experience on paper.
```

### 5.2 一句话定位

> **An age-aware chore chart you can edit and print in under a minute.**

### 5.3 首页消息冻结（SEO-Copy Freeze 输入）

- Title：`Free Printable Chore Chart Maker for Kids | ChoreChartEasy`
- H1：`Make a printable chore chart your child can actually follow`
- Subhead：`Choose an age, start with realistic chores, edit anything, and print a clear weekly chart—no sign-up required.`
- Primary CTA：`Make my free chart`
- Secondary CTA：`Start with a blank chart`
- Proof points：`Age-aware starters` / `Editable` / `US Letter & A4` / `No child account`
- 不使用：`AI-powered`、`expert-approved`、`guaranteed to stop nagging`、`perfectly fair`、`secure cloud backup`。

### 5.4 Competitive Minimum

要在目标 SERP 中成为合格产品，P0 必须同时做到：

- 无注册即可开始。
- 首屏或一次滚动内进入编辑器。
- 有可编辑的默认任务，而不是空白画布。
- 支持适龄起始方案。
- 打印前可预览。
- US Letter 和 A4 不截断。
- 手机可完成核心流程。
- 结果视觉质量足以直接贴在冰箱上。
- 清楚说明数据保存在本机，不采集儿童姓名到 Analytics。

---

## 6. MVP 与 NOT-DO

### 6.1 MVP P0：验证“生成 → 编辑 → 打印”

#### FR-01：低摩擦起始入口

- 用户可选择：孩子年龄、目标场景、空白模板。
- 昵称为可选；界面提示可使用 initials/nickname。
- 无需登录，无需先选价格。
- 移动首屏在一次滚动内出现年龄选择或模板入口。

验收：新用户从加载首页到出现可编辑计划，中位操作步骤不超过 4 个。

#### FR-02：适龄 Starter Library v1

不是先做复杂“公平引擎”，而是建立可审阅的年龄带任务库：

```text
id, title, age_band, category, supervision,
safety_note, default_frequency, icon_key, source_note, review_status
```

年龄带先按：`3–4`、`5–6`、`7–9`、`10–12`。

- 每个年龄带至少 12 个经过人工审阅的候选任务。
- 覆盖 self-care、bedroom、shared spaces、mealtime、laundry helper、pet helper。
- 危险任务默认不进入低龄预设。
- 家长能删除、改名、增补任务。
- 不声称医学、儿童发展专家背书。

#### FR-03：可编辑周表

- 编辑标题、孩子标签、任务和星期。
- 支持增加、删除、排序任务。
- 提供 3 个 P0 预设：Weekly Chores、Morning Routine、Blank Chart。
- 多孩模式沿用现有功能，但只承诺“age-aware starting point”，不承诺绝对公平。

#### FR-04：打印闭环

- 打印前真实预览。
- 支持 US Letter / A4。
- P0 默认 portrait；只有验证明确需求后再增加 landscape UI。
- 1–4 个孩子、长任务文本、手机进入打印预览均不截断关键内容。
- 浏览器 Print-to-PDF 结果可用。
- 免费品牌标记不能覆盖或干扰填写区域。
- 黑白打印仍有清楚边框和层级。

#### FR-05：本地草稿可靠性

- 自动保存当前计划到 localStorage。
- 刷新恢复模板、任务、纸张设置和家庭输入。
- 提供 `Start over`，执行前二次确认。
- localStorage 不可用时显示非阻断提示。
- 不在验证期建设账号和云同步。

#### FR-06：隐私安全边界

- 图表内容默认仅存浏览器本地。
- GA4/Clarity 不传昵称、年龄明细、任务文本或完整 chart。
- Analytics 只使用有限枚举：page_type、template_id、age_band、device_type。
- Privacy 页面明确区分本地 chart 数据与站点 Analytics。
- 年龄建议页面增加“家长按孩子能力与安全环境判断”的提示。

#### FR-07：最小漏斗埋点

只保留能回答产品验证问题的事件：

```text
cta_click
editor_start
starter_loaded
task_edited
plan_ready
print_preview
print_start
print_error
return_draft_loaded
paid_interest_click
```

公共参数：

```text
analytics_schema_version, page_type, source_page,
template_id, age_band, device_type
```

禁止参数：昵称、任务文本、儿童出生日期、完整计划内容。

### 6.2 P1：有打印行为后再做

触发条件见第 12 节验证 Gate。

- 多孩分配解释：按年龄带和任务类别给出起始分配。
- 任务锁定后重排其余项目。
- 复制上周计划、轻量轮换。
- 图片图标模式。
- 下载 PNG 或稳定 PDF 文件。
- 一次性 Printable Pack / Theme Pack 真实支付实验。

### 6.3 P2：有复访或付费证据后再做

- 账号体系。
- 云端计划库和跨设备同步。
- 双家长协作。
- 订阅、Customer Portal、取消和账单管理。
- 完整轮换历史与复杂公平评分。
- PWA 离线安装。

### 6.4 NOT-DO

验证期明确不做：

- 不做月订阅正式上线。
- 不做 `/account`、云端计划 CRUD 和双家长协作。
- 不做复杂公平算法、预计时长平衡和两周历史优化。
- 不做原生 App、Push、聊天、照片验收和儿童账户。
- 不接银行、借记卡和真实 Allowance 转账。
- 不做 AI 聊天助手或把静态规则包装成 AI。
- 不做重型 Canva 式画布、上百字体和公开模板社区。
- 不一次性生成 3–12 岁所有 SEO 页面。
- 不因已有测试支付代码就默认打开真实收费。

---

## 7. 首页 IA

```text
1. Utility-first Hero
   - H1 + 一句话价值
   - Age band / starter 入口
   - Primary CTA: Make my free chart
   - Secondary CTA: Start blank
   - No sign-up / Letter & A4 说明

2. Editor + Live Preview
   - 默认直接出现可编辑 starter
   - 手机先编辑，预览可折叠
   - Plan ready → Print preview

3. Three proof points
   - Age-aware starting chores
   - Edit anything
   - Print-ready, no child account

4. Printable examples
   - 真实 US Letter/A4 成品缩略图
   - 黑白与彩色各一个

5. Choose a starting point
   - Weekly chores
   - Morning routine
   - Multiple kids（标记 Beta，不承诺 perfect fairness）

6. Age guides and free tools
   - 3-year-olds / 5-year-olds / randomizer

7. Privacy boundary
   - Chart stays in this browser
   - Analytics does not receive chart content

8. FAQ
   - Is it free?
   - Do I need an account?
   - Which chores fit each age?
   - Can I print on Letter/A4?
   - Where is my chart saved?

9. Footer
   - Privacy / Terms / Refund（收费前 Refund 可说明尚无 live purchase）/ Support
```

首页删除或弱化：大段 SaaS 营销、过早 Pro 对比、云同步承诺、复杂公平算法承诺。

---

## 8. 页面矩阵

### 8.1 P0 页面：只优化已有路由

| URL | Index | 主词/意图 | 独立用户价值 | 主 CTA | Schema | 内链 |
|---|---|---|---|---|---|---|
| `/` | yes | chore chart maker / generator | 完整生成、编辑、打印工具 | Make my free chart | WebApplication + FAQPage | 指向 Printable、年龄页、Randomizer |
| `/printable-chore-chart` | yes | printable chore chart | 首屏载入可打印默认表，展示 Letter/A4 结果 | Edit this printable | WebApplication + FAQPage | 首页、年龄页、Morning |
| `/chores-for-3-year-olds` | yes | chores for 3 year olds | 人工审阅清单、安全边界、3–4 岁预设 | Make a chart for ages 3–4 | Article + FAQPage | 5 岁页、Printable、首页 |
| `/chores-for-5-year-olds` | yes | chores for 5 year olds | 人工审阅清单、可观察任务、5–6 岁预设 | Make a chart for ages 5–6 | Article + FAQPage | 3 岁页、Morning、首页 |
| `/morning-routine-chart-for-kids` | yes | morning routine chart for kids | Morning starter + 可编辑打印 | Edit this morning routine | WebApplication + FAQPage | Printable、年龄页、首页 |
| `/chore-randomizer` | yes | random chore generator | 轻量随机分配，结果可导入主编辑器 | Turn this into a chart | WebApplication | 首页、Multiple kids |
| `/chore-chart-for-multiple-kids` | yes | chore chart for multiple kids | 多孩起始分配 Beta，可调整 | Build a sibling chart | WebApplication + FAQPage | 首页、Printable、Randomizer |
| `/privacy` | yes | 合规导航 | 解释本地数据与 Analytics | Return to chart | WebPage | Footer |
| `/terms` | yes | 合规导航 | 服务边界和年龄建议免责声明 | Return to chart | WebPage | Footer |
| `/refund` | noindex（无 live 支付时） | 退款政策 | 明确当前是否存在付费商品 | Return to chart | WebPage | Footer |
| `/404` | noindex | 错误恢复 | 返回主工具和主要页面 | Make a chart | none | 首页 |

### 8.2 暂缓新页面

以下页面不立即建设，必须由 GSC 查询、用户行为或产品能力解锁：

- `/family-chore-chart`：现有 Multiple Kids 页产生曝光/使用后再决定是否拆词。
- `/chore-chart-for-kids`：泛词 KD 较高，先让首页和 Printable 建权重。
- `/chores-for-4-year-olds`、`/chores-for-6-year-olds` 至 `/chores-for-12-year-olds`：只有任务库完成审核且对应查询有证据时逐页发布。
- `/reward-chart-for-kids`、`/bedtime-routine-chart-for-kids`、`/allowance-chore-chart`：属于相邻意图，不在 P0 分散范围。
- `/pricing`、`/account`：当前线上 404；付费/账号能力未进入 P0，不创建空壳页。

### 8.3 SEO 页面发布硬门槛

每个新 indexable 页面必须至少包含一个不可替代价值：

- 可直接载入的独立预设；或
- 人工审阅的独立任务/安全说明；或
- 可交互工具；或
- 可下载/打印的独立结果。

仅替换年龄数字、标题和少量段落的页面禁止发布。

---

## 9. Route Contract

| Route | Method | 状态 | Index | 输入 | 输出/行为 | 失败行为 |
|---|---|---|---|---|---|---|
| `/` | GET | existing / modify | yes | `template`, `age_band`, `source` query 可选 | 主编辑器 | 载入默认 Weekly starter |
| `/printable-chore-chart` | GET | existing / modify | yes | 可选 starter 参数 | Printable landing + 内嵌/直达编辑器 | 回退到默认 printable |
| `/chores-for-3-year-olds` | GET | existing / modify | yes | none | 内容 + 3–4 岁 starter CTA | CTA 回首页并带 `age_band=3-4` |
| `/chores-for-5-year-olds` | GET | existing / modify | yes | none | 内容 + 5–6 岁 starter CTA | CTA 回首页并带 `age_band=5-6` |
| `/morning-routine-chart-for-kids` | GET | existing / modify | yes | none | Morning landing + starter CTA | 回退 Morning starter |
| `/chore-randomizer` | GET | existing | yes | 人数/任务输入 | 随机结果 + 导入主表 | 保留用户输入并显示可理解错误 |
| `/chore-chart-for-multiple-kids` | GET | existing / modify | yes | 年龄带、孩子标签 | Beta 多孩 starter | 不声称公平；允许手动编辑 |
| `/privacy` | GET | existing / modify | yes | none | Privacy | 静态可访问 |
| `/terms` | GET | existing / modify | yes | none | Terms | 静态可访问 |
| `/refund` | GET | existing / modify | noindex | none | 未收费/退款边界 | 静态可访问 |
| `/404` | GET | existing / modify | noindex | unknown path | 404 + 恢复导航 | HTTP 404，不返回伪 200 |

合同约束：

- 所有 canonical 使用无 `.html` URL。
- Sitemap 只列 indexable canonical。
- 所有 CTA 目标必须是合同内路由或首页合法参数；不允许指向当前不存在的 `/pricing`、`/account`。
- 未上线的付费能力不出现在主导航。

---

## 10. Data Contract

### 10.1 本地计划模型 v1

```json
{
  "schemaVersion": 1,
  "planId": "local-generated-id",
  "title": "Our Weekly Chore Chart",
  "starterId": "weekly|morning|blank|multi-kid",
  "ageBands": ["5-6"],
  "children": [
    {"localId": "child-1", "label": "optional nickname"}
  ],
  "tasks": [
    {
      "localId": "task-1",
      "sourceTaskId": "optional-library-id",
      "title": "Make the bed",
      "childLocalId": "child-1",
      "days": [true, true, true, true, true, false, false]
    }
  ],
  "print": {
    "paper": "letter|a4",
    "orientation": "portrait",
    "theme": "classic"
  },
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601"
}
```

### 10.2 数据边界

- `plan` 默认只进入 localStorage，不上传 Worker/D1。
- Analytics 可传 `age_band`，不可传精确生日、昵称、任务文本或 plan JSON。
- localStorage key 必须包含 schema version。
- 读取旧草稿失败时不能白屏；提示用户开始新表。
- 后续云同步必须另开 Data Contract 和隐私 Owner Review，不从本合同自动推导。

### 10.3 任务库数据质量

- 每条任务必须有 `review_status=human_reviewed` 才能进入默认 starter。
- `safety_note` 只做一般性提醒，不替代家长判断。
- 图标必须有来源和授权记录。
- 未审阅的 AI 生成任务不得直接上线。

---

## 11. 素材与视觉合同

### 11.1 必备素材 Inventory

| 素材 | 数量 | 用途 | 要求 |
|---|---:|---|---|
| Weekly chart 成品预览 | 2 | 首页、Printable 页 | 彩色 + 黑白；真实 Letter/A4 截图 |
| Morning routine 成品预览 | 1 | Morning 页 | 3–6 岁可读 |
| Multiple kids 成品预览 | 1 | 多孩页 | 不使用真实儿童全名 |
| 任务图标 | P0 约 24–40 | Starter/低龄模式准备 | 同一风格、授权可追溯 |
| Pinterest 竖图 | P1 | 分发 | 产品稳定后制作，P0 不阻塞 |

### 11.2 Visual Style Brief

- 关键词：warm、clear、calm、printable、parent-trustworthy。
- 避免：过度幼儿园化、糖果色堆叠、SaaS 渐变英雄区、复杂玻璃拟态。
- 移动优先：输入控件触摸区足够大，编辑和预览有明确层级。
- 打印优先：黑白可辨、低墨水、线条清楚、字体不依赖背景色。
- 免费品牌标记：可见但不干扰使用，不使用大面积背景水印。

---

## 12. 验证计划与产品 Gate

以下目标是首轮实验阈值，不是行业事实；数据出现后必须重估。

### Gate A：获客相关性

观察窗口：至少 8 周，或目标页面累计达到 500 GSC impressions，二者以较晚者为准。

通过条件：

- GSC 持续出现 maker/generator/printable/age chores 相关查询。
- 至少 3 个非品牌目标查询进入平均排名前 30，且趋势未持续恶化。

失败处理：调整页面意图和内链，不开发云功能。

### Gate B：核心价值

样本要求：至少 100 个有效编辑器 session。

假设目标：

- `editor_start → plan_ready` ≥ 50%。
- `plan_ready → print_preview` ≥ 20%。
- `print_preview → print_start` ≥ 50%。
- 移动端核心流程无阻断性 P0 错误。

通过后：允许进入图片图标、PDF/PNG 和多孩增强。

失败处理：优先修首屏、默认内容、编辑摩擦和打印质量；不增加页面矩阵。

### Gate C：持续价值

样本要求：至少 30 个保存过本地草稿的用户具备可观测回访窗口。

假设目标：7–14 天内 `return_draft_loaded` ≥ 15%。

通过后：可以验证复制上周、轮换和云同步兴趣。

失败处理：把产品视为低频 Printable，不建设订阅。

### Gate D：付费意愿

先展示明确的一次性产品概念，不伪装已上线能力：

- `Printable Family Pack`：去品牌、高级主题、图标包、PDF/PNG。
- 价格实验由定价 Skill 另行给出；本 PRD 不冻结价格。
- 先记录 `paid_interest_click`，达到样本后再接 Creem live。

解锁真实支付的最低证据：

- 至少 20 次合格 paid-interest 行为；并且
- 至少完成 5 次英语家庭可用性测试；并且
- 产品、支付、退款、合规和 QA Gate 全部 GO。

订阅只有在 Gate C 证明持续使用后才进入讨论。

### Kill / Iterate / Scale

- **Kill subscription hypothesis**：核心打印成立，但回访持续弱，则取消订阅路线，转一次性 Printable 商业模式。
- **Iterate product**：有相关曝光但打印漏斗弱，修产品，不扩内容。
- **Iterate distribution**：打印漏斗强但曝光弱，扩 SEO/Pinterest/外链。
- **Scale**：核心打印、回访或一次性付费中至少两项出现稳定证据后，再扩年龄和场景矩阵。
- **Kill project**：经过两个完整迭代周期，目标查询无增长、有效用户不打印、用户测试也不认可结果价值，停止继续投入。

---

## 13. 产品验收任务

后续 PM/QA 必须用真实用户任务验收：

### Task 1：第一次生成

一位使用 iPhone 的家长，为 5 岁孩子选择适龄 starter，修改一项任务并进入打印预览。

通过：无需注册；不迷路；计划可编辑；预览无截断。

### Task 2：空白 Printable

用户不需要推荐，只想创建 5 行空白周表。

通过：最多 3 个主要动作进入可打印状态。

### Task 3：多孩 Beta

用户为 5 岁和 9 岁孩子生成起始分工，交换其中两项任务再打印。

通过：年龄建议无明显不合理；手动调整清楚；页面不承诺绝对公平。

### Task 4：移动打印

用户在移动端选择 Letter/A4 并打开系统打印/PDF 流程。

通过：没有按钮消失、横向溢出、任务截断或大面积水印。

### Task 5：刷新恢复

用户编辑后刷新页面。

通过：计划可靠恢复；草稿损坏时有错误恢复，不白屏。

### Task 6：隐私检查

检查 GA4/Clarity 请求和控制台。

通过：昵称、任务文本、完整 chart 不出现在请求、URL、日志和事件参数中。

---

## 14. 风险与缓解

| 风险 | 概率 | 影响 | 缓解 |
|---|---|---|---|
| 单工具市场小 | 高 | 高 | Printable + 少量高质量年龄/场景页；不建设重 SaaS |
| 用户只用一次 | 高 | 高 | 优先一次性商业模式；用回访 Gate 决定订阅 |
| 打印结果不够好看 | 中高 | 高 | 真实 Letter/A4 预览、移动/桌面/黑白 QA |
| 年龄建议不安全 | 中 | 高 | 年龄带任务库、人工审阅、安全提示、家长可编辑 |
| “公平”承诺过度 | 高 | 中高 | 多孩功能标 Beta；只说 starting point，不说 perfectly fair |
| SEO 页面同质化 | 高 | 中 | 新页面必须有独立预设/工具/人工内容才能 index |
| 新站起量慢 | 高 | 中 | 设 8 周/曝光门槛，不用早期 7 次曝光做过度判断 |
| 儿童隐私争议 | 中 | 高 | 本地优先、昵称可选、Analytics 字段白名单 |
| 现有测试支付增加维护负担 | 中 | 中 | 验证期隐藏付费入口，不扩 account/cloud 功能 |

---

## 15. Owner Review 入口

以下不是开发阻塞，但进入下一阶段前由 Owner 明确：

1. 是否同意把主 ICP 从“多孩家庭”改为“现在就需要 Printable 的家长”，多孩降为差异化实验？
2. 是否同意验证期暂停月订阅、账号和云同步开发？
3. 是否同意 P0 只优化当前 7 个产品/内容路由，不立即新增 13 个 SEO 页面？
4. 是否同意北极星改为 `Weekly Qualified Prints`？
5. 是否同意低龄任务按年龄带而不是每个年龄单独建设任务库？

默认建议：五项全部同意。

---

## 16. 验收清单 / 质量门槛自检

- [x] PRD 是可开发产品，不只是关键词说明。
- [x] 至少拆分 3 类用户并选定主 ICP。
- [x] 有一句话定位、替代方案、差异化和 NOT-DO。
- [x] 已判断站点类型为 utility-first hybrid。
- [x] 有首页 IA。
- [x] 每个 indexable 页面有真实用户价值。
- [x] 有 SEO 页面矩阵。
- [x] 有 Route Contract。
- [x] 有 Data Contract 和素材 Inventory。
- [x] 有 P0 用户任务和 Competitive Minimum。
- [x] 有行为验证 Gate 和 Kill / Iterate / Scale。
- [x] 涉及真实支付时保留 Owner Review 和合规/QA Gate。
- [x] 有下游交接摘要。

---

# 产品定义与 PRD 交接摘要

## 当前结论

- 状态：`DONE`
- 一句话结论：ChoreChartEasy 先验证无注册的适龄 Printable 生成、编辑和打印闭环；订阅、云同步和复杂公平算法全部后置。

## 关键输入

- 项目：ChoreChartEasy
- 当前阶段：02-product
- 上游资料：关键词研究、竞品报告、旧 PRD、线上路由、GSC 冷启动数据。

## 本阶段交付物

- 文件：`docs/PRD-product-definition-v2-lean-validation-2026-07-26.md`
- 核心判断：主 ICP 改为“立即需要 Printable 的家长”；多孩家庭由主定位降为 P1 差异化实验。
- 已确认项：市场可做但规模有限；小站可进入 SERP；当前线上 `/pricing`、`/account` 不存在。
- 待确认项：趋势、打印转化、回访、付费方式、多孩公平的一手证据。

## 给下游的最小必要信息

- 下一阶段：`site-pricing-calibration`，然后是合规和 `site-copywriting-student`。
- 必须读取：本 PRD 第 5、6、7、8、9、10、12 节。
- 不能假设：月订阅成立、云同步是 P0、复杂公平是已验证痛点、所有年龄页都应立即建设。
- 下游不能改动：主 ICP、P0 闭环、NOT-DO 和付费解锁 Gate；如需修改必须返回 Owner Review。

[DONE]
