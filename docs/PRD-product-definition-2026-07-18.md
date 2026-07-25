# ChoreChartEasy 产品定义与 PRD

> 版本：v1.0  
> 日期：2026-07-18  
> 阶段：真实付费上线前产品定义  
> 方法：`product-definition-prd` v1.0.0-general  
> 数据口径：Similarweb 2026-04 至 2026-06 全球全设备估算；Semrush 2026-07 美国桌面自然搜索估算；SERP 实扫日期 2026-07-18。

---

## 0. 结论先行

### 0.1 要不要继续做

**结论：继续做，但保持细分，不扩成重型家庭管理 App；真实月付暂缓到 P0 付费闭环完成。**

四项快速过滤：

| 判断项 | 结论 | 证据 |
|---|---|---|
| 长期需求 | 强 | 家务、责任、晨间/睡前习惯属于常年需求；`printable chore chart`、年龄词、routine 词都有持续搜索。12 个月趋势曲线尚未导出，具体季节性待验证。 |
| 小站能否进入 SERP | 强 | ChoreChartAI 的 Authority Score 仅 8，仍在多个工具词前十；2026-07 SERP 还出现 Mary’s Printables、Between Us Parents、Family Checklist 等独立站。 |
| 是否存在付费场景 | 中强 | ChoreChartAI Pro 为 $5/月；TPT 单份视觉/可编辑资源常见约 $3–$5；Homey 等家庭 App 有月/年订阅。当前缺少 ChoreChartEasy 自己的付费转化数据。 |
| 首版能否低成本实现 | 强 | 当前 Cloudflare Pages + Worker + D1 已跑通，核心生成和打印在浏览器完成，边际推理成本接近 0。 |

**总评：4 项中 3 强 1 中强，值得继续。**

### 0.2 一句话定位

> **The age-aware, print-first chore system for families with kids ages 3–12.**

### 0.3 主力用户

美国英语市场中，有 1–4 个 3–12 岁孩子、希望减少重复提醒、又不想让孩子再装一个 App 的家长；其中**多孩家庭家长**是最强差异化切口。

### 0.4 产品战略

ChoreChartEasy 不做“又一个漂亮模板站”，也不做重型数字家务 App。它解决三件事：

1. **选对任务**：按年龄和能力推荐，而不是让家长从空白开始。
2. **分得公平**：多孩家庭按年龄和工作量分配，不是机械随机。
3. **每周能继续**：轮换、保存、打印，让系统持续而不是用一周就废弃。

### 0.5 真实付费上线前 P0

1. 扩充并结构化 3–12 岁任务库，修正静态规则过少和“公平”定义过弱。
2. 打印闭环：US Letter/A4、横竖版、分页预览、长文本和 4 孩子计划验收。
3. 草稿可靠性：恢复家庭表单、记录模板、覆盖确认、Undo、本地存储异常处理、导出备份。
4. Pro 云端计划库与跨设备同步；否则不能和 $5/月的 ChoreChartAI 同价。
5. 完成真实订阅闭环：Creem live、重复购买保护、Customer Portal/取消、退款/过期处理、支付 contract tests、告警。
6. 修复跨站 Cookie 和旧 `auth_token` 退出问题；优先将 API 放到同站子域。
7. 补完整漏斗埋点和 consent 管理。

### 0.6 明确不做

- 不做儿童社交、聊天或公开排行榜。
- 不接银行账户、儿童借记卡和真实资金转账。
- 不做复杂游戏化世界、宠物养成或重行为矫正。
- 不做原生 iOS/Android App；先用响应式 Web/PWA 验证。
- 不用生成式 AI 作为首页核心卖点；年龄规则和家庭约束更重要。
- 不扩到公司、室友、老人、医疗等泛场景。
- 不批量生成低质量年龄 SEO 页面。

---

## 1. 市场概述

### 1.1 目标关键词

| 关键词 | 美国月搜索量 | KD | 意图 | 页面 | 优先级 |
|---|---:|---:|---|---|---:|
| printable chore chart | 1,900 | 21 | 模板 + 工具 | `/printable-chore-chart` 已上线 | P0 |
| chores for 5 year olds | 1,600 | 20 | 信息 + 可执行清单 | 已上线 | P0 |
| chores for 3 year olds | 480 | 16 | 信息 + 视觉计划 | 已上线 | P0 |
| chore chart maker | 210 | 14 | 工具 | 首页 | P0 |
| chore chart generator | 170 | 19 | 工具 | 首页 | P0 |
| morning routine chart for kids | 140 | 16 | 模板 + 工具 | 已上线 | P0 |
| random chore generator | 140 | 0 | 轻工具 | `/chore-randomizer` 已上线 | P0 |
| family chore chart | 1,000 | 34 | 多孩/家庭模板 | 待建 | P1 |
| chore chart for kids | 1,900 | 34 | 泛品类 | 待建 | P1 |
| age appropriate chores | 2,400 | 50 | 信息 | 内容中心，后做 | P2 |

> CPC：当前材料没有可靠数据，统一标注**待验证**，不能编造。

### 1.2 市场规模判断

- ChoreChartAI Similarweb 月访问约 3,067，说明单一“AI chore chart generator”不是大市场。
- RewardCharts4Kids 月访问约 21,620、自然搜索占比 81.09%，说明年龄页、奖励页和 Printable 内容矩阵可形成可观流量。
- World of Printables 月访问约 244,587、自然社交 12.56%，说明视觉资源 + Pinterest 是有效第二渠道。
- 结论：**单工具天花板低，SEO 页面矩阵 + 可复用家庭系统才有生意空间。**

### 1.3 趋势判断

- 家务与家庭习惯是长期需求，不依赖单次 AI 热点。
- 搜索场景存在季节性假设：开学、暑假、寒假、搬家和新年可能更强。
- **待验证**：从 Google Trends/Semrush 导出过去 12 个月 `chore chart`、`morning routine chart`、`chores for kids` 周期曲线。

---

## 2. SERP 与竞品分析

### 2.1 SERP 实扫

#### 查询 A：`chore chart maker free printable generator kids`

2026-07-18 搜索结果中出现：

- 工具/生成器：Mary’s Printables、Between Us Parents、Template.net。
- 模板/内容：Just Family Fun、Family Checklist、TPT 等。
- 独立小站：至少 Mary’s Printables、Between Us Parents、Family Checklist。

判断：**工具 + 模板混合意图**。首屏必须能直接开始制作，内容负责解释和承接长尾。

#### 查询 B：`printable chore chart for kids free editable`

Top 结果以 PDF、模板库、可编辑 Printable 和内容合集为主，常见卖点：

- Free / no sign-up
- PDF / PNG
- US Letter / A4
- 图片图标
- 不同年龄和不同主题

判断：**模板/下载意图强于复杂产品意图**。`/printable-chore-chart` 不能只是一篇文章，最终需要首屏内嵌可编辑预览或直接生成结果。

#### 查询 C：`chores for 5 year olds age appropriate chore chart`

结果以家长内容站、TPT、学前 Printable 为主，强调：

- 年龄适配
- 图形化任务
- 独立性与责任感
- 简单、少量、可观察的任务

判断：**信息意图为主、工具转化为辅**。年龄页应先回答“做什么、为什么、安全边界”，再一键生成该年龄计划。

### 2.2 三层竞品

| 层级 | 竞品/替代 | 用户为什么选它 | 我们的应对 |
|---|---|---|---|
| Tier 1 直接竞品 | ChoreChartAI | 10 秒 AI 生成、PDF、7 layouts、100 云端图表、$5/月 | 不拼字体和 AI，拼年龄适配、多孩公平和持续执行；补齐云端与打印质量。 |
| Tier 1 新兴工具 | Mary’s Printables、Between Us Parents、Family Checklist | 免费、无登录、无水印/可编辑、PDF/PNG、视觉主题 | 保持低摩擦；年龄生成必须比空白模板更省脑；Printable 页首屏工具化。 |
| Tier 1 SEO 竞品 | RewardCharts4Kids、World of Printables、WorksheetPrints | 大量年龄/奖励/Printable 页面、Pinterest 和免费资源矩阵 | 做高质量页面矩阵和免费工具，不拼海量低质模板。 |
| Tier 2 相邻方案 | Canva、Template.net、TPT、ChatGPT | 设计自由、资源多、能临时生成任务清单 | 提供更快、更家庭化、更安全的默认答案，减少设计和提示词成本。 |
| Tier 2 家庭 App | Chorsee、Homey、OurHome、S’moresUp | 提醒、跨设备、奖励、零花钱、进度 | 坚持 print-first 和低屏幕；只吸收轮换、跨设备计划与家长协作。 |
| Tier 3 现状 | Excel、纸笔、冰箱白板、手动轮换、反复口头提醒 | 免费、熟悉、随手 | 30–60 秒生成更合理的表，并且打印后和纸笔一样低摩擦。 |

### 2.3 用户痛点证据

以下为公开页面和搜索结果的**间接证据，不等同于一手用户访谈**：

1. 许多家长描述需要反复提醒，chart 的价值是把提醒变成可见规则。
2. 多篇内容指出 chart 常在一周后失效，原因包括太复杂、任务不适龄、家长不复盘、图表不可见。
3. 竞品付费权益集中在保存、跨设备、轮换、提醒、奖励，说明持续使用比首次生成更有付费价值。
4. TPT 上 $3–$5 的可编辑视觉图表有购买和评价，说明“可打印、视觉化、直接可用”存在一次性付费意愿。

### 2.4 尚缺证据

- ChoreChartEasy 自己的访谈、用户录像和支付意愿测试。
- 免费用户从生成到打印的真实转化率。
- 4 周后是否继续使用纸质计划。
- 多孩“公平”最重要的是数量、时间、难度还是轮换偏好。

---

## 3. 目标用户

### 3.1 细分用户

| 用户 | Pain | 当前方案 | 触发事件 | 出现位置 | 付费判断 |
|---|---|---|---|---|---|
| A. 多孩家庭家长（主力） | 不同年龄难度不同；孩子争论“不公平”；每周重排费脑 | 白板、Excel、轮流口头安排、家庭 App | 新学期、周末重置、孩子开始承担家务 | Google、Pinterest、Parenting/Homeschool 社区 | 若能持续轮换、跨设备保存和减少争执，有年付可能；金额待验证 |
| B. 3–6 岁孩子家长 | 孩子不识字、步骤太抽象、需要建立晨间/睡前习惯 | 图片卡、TPT/Canva Printable、手写 | 入园、入学、晨间混乱、睡前拖延 | Google、Pinterest、TPT、学前教育社区 | 更偏一次性购买视觉包；订阅意愿弱于 A |
| C. 6–12 岁单孩家长 | 想培养独立性，但不知道什么年龄该做什么 | 文章清单、纸笔、奖励表 | 孩子要求零花钱、家长减少提醒 | Google、Parenting 内容站 | 对年龄包、奖励/Allowance 模板有付费可能 |
| D. Homeschool/课堂/照护者（次级） | 多人轮值、视觉任务、打印耗时 | TPT、Canva、教室 Job Chart | 新学期、班级轮值 | TPT、Pinterest、Google | 可能购买 Printable Pack；暂不做复杂学校账号 |

### 3.2 主力用户画像

> 32–45 岁美国英语家长，家里有 2 个及以上、年龄不同的孩子。周日或开学前重新安排家务，希望孩子承担责任，但不想把家庭生活变成另一套需要全家每天登录的 App。

### 3.3 Jobs to Be Done

- 当我准备新一周时，帮我快速给每个孩子分配适合其年龄的任务，让我不用从网上拼清单。
- 当孩子抱怨不公平时，让我能解释并自动轮换，而不是临时争论。
- 当计划开始失效时，提醒我做小幅调整并打印新版本，而不是重新设计一张表。

---

## 4. 产品定位

### 4.1 定位语句

```text
FOR parents of children ages 3–12, especially families with multiple kids,
WHO want less nagging and fair, realistic household responsibility,
ChoreChartEasy IS A print-first family chore system
THAT creates age-aware plans, rotates work fairly, and prints a clear weekly routine,
UNLIKE generic template makers and screen-heavy chore apps,
ChoreChartEasy keeps the planning smart, the child experience offline, and family data private.
```

### 4.2 消息层级

| 层级 | 建议内容 |
|---|---|
| Headline | **A fair weekly chore plan for every child.** |
| SEO/H1 兼容 | **Free printable chore chart maker for kids ages 3–12** |
| Subhead | Add each child’s age, generate realistic responsibilities, and print a plan the whole family can follow. |
| Benefit 1 | Stop guessing which chores fit each age. |
| Benefit 2 | Split work fairly across siblings. |
| Benefit 3 | Refresh the plan each week without starting over. |
| Benefit 4 | Print it for the fridge; kids need no account. |
| Proof | 即时可见的两孩示例、年龄标签、轮换前后对比、真实用户评价（当前缺，不能伪造） |
| Primary CTA | **Build our family plan** |
| Secondary CTA | **Start with a blank printable** |

### 4.3 差异化原则

1. 不宣传“AI-powered”除非确实有模型参与且有评测。
2. “Age-aware”必须落到可审计的任务库、安全标签和年龄规则。
3. “Fair”不能只等于数量相同，应包含预计耗时、难度、轮换历史和家长可调整。
4. “Private”明确区分：图表内容不上传；账号/订阅信息和 GA 仍会处理。
5. “Print-first”必须提供可靠纸张、分页和 PDF 结果，而不只是 `window.print()`。

### 4.4 禁词/禁承诺

- `expert-approved`、`child-development approved`：没有专家背书。
- `guaranteed to stop nagging`：不可保证行为结果。
- `AI-generated`：当前家庭生成器是静态规则。
- `secure cloud backup`：当前没有图表云同步。
- `one free plan`：当前实际没有次数限制，应改为 `one active local draft` 或实现限制。
- `fresh every week`：当前小任务池会重复，扩容前不能强承诺不重复。

---

## 5. 功能规划

### 5.1 当前已完成

- 无登录本地周计划编辑器。
- 3–12 岁、最多 4 个孩子的家庭生成器。
- 4 个免费模板、3 个 Pro 模板、空白模板。
- 本地草稿、每日勾选、浏览器打印、免费水印。
- Pro 周轮换、本机 20 份计划库、打印主题、去水印。
- 独立 Chore Randomizer。
- Google OAuth、D1 entitlement、Creem test checkout 和签名 webhook。
- 10 个可索引页面、GA4、GSC 和 sitemap。

### 5.2 P0：真实付费前必须完成

#### FR-01 结构化适龄任务库

每条任务至少包含：

```text
id, title, min_age, max_age, category,
estimated_minutes, difficulty, supervision,
safety_note, indoor/outdoor, frequency,
prerequisites, icon_key
```

验收标准：

- 每个年龄至少 20 条可选任务，覆盖 personal care、bedroom、kitchen、laundry、shared spaces、pet care。
- 不同年龄的目标建议不同；3 岁不会得到明显超龄任务。
- 家长可排除宠物、化学清洁剂、刀具、户外等类别。
- 所有任务来源和安全说明经过人工审阅；不得用未经验证的 AI 输出直接上线。

#### FR-02 公平分配引擎 v2

公平评分至少考虑：

- 年龄适配
- 预计总时长
- 难度
- 上周任务历史
- 家长固定/排除任务

验收标准：

- 多孩计划默认每个孩子预计总时长差不超过设定阈值；初始阈值建议 20%，上线后验证。
- 轮换时优先避免最近 2 周重复同一任务；候选不足时明确提示。
- 家长可锁定某项分配后重新生成其他任务。
- 轮换前提供预览，不直接覆盖当前计划。

#### FR-03 打印与导出闭环

验收标准：

- 支持 US Letter 与 A4。
- 支持 portrait / landscape。
- 1–4 个孩子的默认计划在预览中没有截断或重叠。
- 长文本自动换行；超过单页时给出明确分页提示。
- 支持下载 PDF 或提供稳定的浏览器 Print-to-PDF 结果。
- 免费版品牌标记小且不影响填写；Pro 无水印。
- 打印前可看到真实预览，不用盲打。

#### FR-04 草稿可靠性

验收标准：

- 刷新后恢复 chart、模板 key、family setup、week 和 theme。
- 切模板、轮换、载入计划前有确认或 Undo。
- localStorage 写失败不会中断页面；显示可理解提示。
- 支持导出/导入一个不含账号凭证的 JSON 备份。
- 本地数据有 schema version 和迁移策略。

#### FR-05 Pro 云端计划库

验收标准：

- 通过 Google 账号保存和读取最多 100 份计划。
- 用户可重命名、复制、归档、删除和恢复最近删除计划。
- 计划在第二台设备登录后可见。
- 图表数据加密传输，D1 最小化保存；隐私政策明确儿童姓名/年龄处理方式。
- 用户可以导出和删除全部云端数据。
- Free 取消后保留数据但限制新建/编辑数量，具体策略在支付页说明。

#### FR-06 真实订阅闭环

验收标准：

- Creem live product 与页面展示价格、周期完全一致。
- 已有 Pro 用户无法重复购买相同订阅。
- 提供 Customer Portal：取消、恢复、付款方式、发票。
- 取消后权益持续到 period end；退款、争议、past_due 处理符合页面说明。
- Webhook 有固定 fixture、签名、重复、乱序、取消先到、临时失败重试测试。
- 有 webhook 失败告警和可重放机制。
- 支付成功只由服务器 entitlement 判定，继续保持当前安全边界。

#### FR-07 Auth 和隐私

验收标准：

- 解决第三方 Cookie 导致的登录态不稳定；优先 Worker 自定义同站子域。
- logout 同时清除新旧 Cookie。
- 提供账号删除和数据导出。
- GA4 使用 consent mode；未同意分析前不写分析 Cookie。
- GA 事件永不传儿童姓名、任务文本或 chart 内容。

#### FR-08 全漏斗埋点

必须覆盖：

```text
page_view
cta_click
tool_start
tool_success
tool_error
family_plan_generate
print_preview
print_start
pdf_download
pro_gate_view
upgrade_click
login_start
login_success
checkout_start
checkout_redirect
checkout_error
payment_pending
payment_success
pro_activated
rotation_generate
cloud_plan_save
cloud_plan_load
subscription_cancel
```

公共参数：`page_type`、`source_page`、`device_type`、`is_logged_in`、`is_pro`；不得含 PII。

### 5.3 P1：付费后提升留存

- 3–12 岁完整年龄页面和一键预设。
- Morning / bedtime / after-school / weekend / summer routine packs。
- 图片图标模式，重点服务 3–6 岁和非熟练读者。
- Household profile：孩子昵称、年龄、能力偏好、禁用类别。
- 周历史和“上周做过什么”。
- 双家长查看/编辑；暂不让孩子登录。
- Allowance 仅做虚拟金额/points，不接银行。
- 计划分享链接或打印包，不公开儿童信息。
- PWA 安装与离线编辑。

### 5.4 P2：增长扩展

- Chore Wheel 可视化工具。
- Reward Chart、Allowance Chart、Behavior/Routine Chart 内容与工具页。
- Pinterest 自动生成竖图素材。
- Embeddable free tool，保留品牌链接获取外链。
- 西班牙语等多语言；先验证英语 SEO 和转化。

### 5.5 NOT-DO

见 0.6；另外首个真实付费版本不做：

- 照片验收、聊天、Push 通知。
- 复杂报表和孩子行为评分。
- AI 聊天助手修改计划。
- 100 种字体、重型设计画布。
- Marketplace 或用户公开模板社区。

---

## 6. 页面信息架构

### 6.1 首页 IA

```text
1. Hero
   - H1：Free printable chore chart maker for kids ages 3–12
   - 核心承诺：A fair weekly chore plan for every child
   - 直接展示孩子姓名 + 年龄输入
   - Primary CTA：Build our family plan
   - Secondary CTA：Start blank
2. Live result preview
   - 两孩、不同年龄、预计时长、共享任务
   - 切换 Week 1 / Week 2 看轮换差异
3. Why it works
   - Age-aware / Fair for siblings / Print-first / Private
4. How it works
   - Add ages → Review assignments → Print for the week
5. Use cases
   - One child / Multiple kids / Morning routine / Weekly reset
6. Printable preview
   - US Letter/A4，手机端可阅读
7. Free tools & age guides
8. Free vs Pro
   - 先解释持续价值，再出现价格
9. Privacy boundary
10. FAQ
11. Footer CTA
```

首页必须减少当前“营销内容在前、工具在后”的摩擦：移动端用户进入后应在首屏或一次滚动内开始生成。

### 6.2 关键页面

| 页面 | 角色 | 核心动作 |
|---|---|---|
| `/` | 主工具 + 转化 | 生成家庭计划、打印、升级 |
| `/printable-chore-chart` | Printable 主词 | 首屏编辑/预览，不只是跳回首页 |
| `/chore-randomizer` | 轻工具获客 | 随机分配 → 导入完整计划 |
| `/family-chore-chart` | 多孩差异化 | 输入多个年龄 → 生成公平计划 |
| `/chore-chart-for-kids` | 品类中心 | 选择年龄/场景 → 工具或内容页 |
| `/chores-for-{age}-year-olds` | 年龄长尾 | 可信清单 → 载入该年龄预设 |
| `/morning-routine-chart-for-kids` | Routine 场景 | 载入 Morning Pack |
| `/pricing` | 商业转化 | 权益、周期、取消、数据保留 |
| `/account` | 会员管理 | 计划库、订阅 Portal、导出/删除 |

### 6.3 SEO 页面矩阵

| 页面 | 目标词 | 当前 | 优先级 |
|---|---|---|---:|
| `/` | chore chart maker / generator | 已上线，继续优化 | P0 |
| `/printable-chore-chart` | printable chore chart | 已上线，需首屏工具化 | P0 |
| `/chores-for-3-year-olds` | chores for 3 year olds | 已上线，需任务证据/图标预设 | P0 |
| `/chores-for-5-year-olds` | chores for 5 year olds | 已上线，需扩充内容 | P0 |
| `/morning-routine-chart-for-kids` | morning routine chart for kids | 已上线 | P0 |
| `/chore-randomizer` | random chore generator | 已上线 | P0 |
| `/family-chore-chart` | family chore chart | 待建 | P1 |
| `/chore-chart-for-kids` | chore chart for kids | 待建 | P1 |
| `/chores-for-4-year-olds` | chores for 4 year olds | 待建 | P1 |
| `/chores-for-6-year-olds` 至 `/chores-for-12-year-olds` | 年龄词 | 待建 | P1，逐页人工审阅 |
| `/bedtime-routine-chart-for-kids` | bedtime routine chart | 待建 | P1 |
| `/after-school-routine-chart` | after school routine chart | 待建 | P1 |
| `/reward-chart-for-kids` | reward chart for kids | 待建 | P1/P2 |
| `/allowance-chore-chart` | allowance chore chart | 待建 | P2 |
| `/chore-wheel` | chore wheel template | 待建 | P2 |
| `/blog/chore-chart-vs-chore-app` | 对比意图 | 待建 | P2 |
| `/alternative/chorechartai` | alternative | 有真实差异后再做 | P2 |

每个 SEO 页必须有独立价值：任务清单、预设、可交互工具或可下载结果；禁止仅换年龄数字。

---

## 7. 定价设计

### 7.1 竞品价格锚点

| 产品 | 价格/模式 | 主要价值 |
|---|---|---|
| ChoreChartAI | $5/月；有年付 | AI、PDF、7 layouts、100 份跨设备图表、去 Logo |
| TPT Printable | 常见约 $3–$5 一次性 | 可编辑视觉 PDF/模板 |
| Homey | App Store 显示 $6.99/月、$59.99/年等项目 | 家务 + 零花钱 + 家庭同步 |
| Chorsee | Free + IAP，具体当前价格待商店验证 | 跨设备、轮换、奖励/Allowance |

### 7.2 当前问题

当前 `$4.99/month` 与 ChoreChartAI 接近，但只有本机 20 份计划、静态任务池和客户端主题，**价值不对等**。真实收费前必须二选一：

1. 补齐云端同步、可靠轮换、PDF 和 Portal，再做订阅；或
2. 暂时做低价一次性/Lifetime 验证，不宣称持续 SaaS 价值。

### 7.3 推荐正式方案

#### Free

- 1 个本地 active plan
- 最多 4 个孩子
- 年龄生成器
- 4 个 starter packs + blank
- Classic print
- US Letter/A4 基础打印
- Chore Randomizer
- 轻品牌标记
- 无需登录

#### Pro Family

- 100 份云端计划
- 跨设备同步
- 公平周轮换 + 最近任务历史
- Premium routine packs
- 图片图标模式
- 所有打印主题
- 无品牌 PDF
- 导出/导入与版本恢复
- 双家长协作（P1）

#### 价格实验

- Monthly：`$4.99/month`
- Annual：建议首测 `$29/year`
- 不在验证前承诺 Lifetime；若云同步延期，可用 `$19 one-time Founder Pack` 测试一次性付费。

> 价格属于**实验方案**，不是已验证事实。至少做两档 checkout/interest 测试，按支付转化和退款反馈决定。

### 7.4 成本意识

- 当前生成逻辑无模型调用，成本主要是 Cloudflare、D1、支付费率和支持。
- 云端计划体积小，但需考虑备份、删除、日志和支持成本。
- 如后续引入 AI，必须设置用量限制和成本监控，不把无限生成默认放进低价方案。

---

## 8. 域名与技术栈

### 8.1 域名

已使用 `chorecharteasy.com`，短期不更换：

- 包含 `chore chart` 品类词，易理解。
- `.com` 适合长期品牌。
- 品牌语义“easy”与低摩擦匹配。

不再浪费时间生成和购买备选域名。应保护常见社交用户名并持续建设主域权重。

### 8.2 技术栈

保持：

- Frontend：Cloudflare Pages，当前静态 HTML/JS。
- API：Cloudflare Worker。
- Database：D1。
- Auth：Google OAuth。
- Payment：Creem。
- Analytics：GA4 + GSC。

结构改造建议：

1. 将首页单文件拆成模块化 JS/CSS，至少分 editor、generator、billing、analytics。
2. Worker 拆 auth、billing、webhook、plans 模块。
3. 增加完整自动化测试和 fresh-D1 migration 测试。
4. API 采用同站自定义域，降低第三方 Cookie 风险。
5. 云端 chart schema 与儿童信息最小化；不要把任务文本写入日志和 Analytics。

---

## 9. GTM 策略

### 9.1 核心渠道

1. **Google SEO**：主渠道。RewardCharts4Kids 自然搜索占 81.09%。
2. **Pinterest**：第二渠道。World of Printables 自然社交占 12.56%。
3. **免费工具与 Embed**：借鉴 WorksheetPrints 的 Direct/Referral 结构。
4. **Parenting/Homeschool 垂直外链**：优先于泛 Product Hunt 流量。

### 9.2 首四周动作

#### Week 1：产品证据

- 找 5–8 个有 3–12 岁孩子的英语家庭做可用性测试。
- 记录从输入到打印的屏幕与阻塞点。
- 访谈“公平”的定义和一周后为什么停用。
- 不先推付费。

#### Week 2：P0 页面

- 把 `/printable-chore-chart` 做成首屏可编辑结果。
- 强化 3 岁、5 岁页面任务证据和年龄预设。
- 发布 `/family-chore-chart`。

#### Week 3：分发

- 每个页面做 2 张 Pinterest 竖图：清单型、成品预览型。
- 向 Parenting/Homeschool/Printable 站点提交免费资源。
- 为 Randomizer 提供 embed code，换保留品牌链接。

#### Week 4：付费意愿

- 在真实付款前先测 `Upgrade` 点击、价格页停留和 checkout start。
- 用 Creem test 全链路跑取消、退款、过期和重复事件。
- 只有 P0 通过后切 live。

### 9.3 内容原则

- 每个页面必须有工具、预设或真实可打印结果。
- 内容围绕家长语言：less nagging、fair between siblings、age-appropriate、works on paper。
- 不复制泛化育儿文章，不伪造医学/儿童发展权威背书。
- 年龄页必须人工审阅安全性和可执行性。

---

## 10. 转化漏斗与成功指标

### 10.1 漏斗

```text
SEO/Pinterest landing
→ CTA click
→ tool start
→ family plan generated
→ print preview / PDF
→ second-week return
→ Pro gate
→ login
→ checkout
→ webhook verified
→ Pro activated
→ weekly rotation / cloud save
```

### 10.2 北极星指标

**Weekly Plans Printed or Exported**：每周成功打印或导出的独立家庭计划数。

它比 page view、注册数或生成次数更接近真实家庭价值。

### 10.3 初始目标

以下为**首轮假设目标，需用真实基线修正**：

| 指标 | 初始目标 |
|---|---:|
| Landing → tool_start | ≥ 35% |
| tool_start → tool_success | ≥ 70% |
| tool_success → print_preview/PDF | ≥ 25% |
| 第 2 周返回并轮换（已保存家庭） | ≥ 20% |
| Pro gate → upgrade_click | ≥ 10% |
| checkout_start → payment_success | ≥ 50% |
| 支付失败后可恢复率 | ≥ 90% |
| Webhook entitlement 一致性测试 | 100% fixture 通过 |
| 移动端核心流程 JS error | < 0.5% sessions |
| P0 页面 Lighthouse Accessibility | ≥ 95 |

### 10.4 事件规范

事件清单见 FR-08。另需：

- 所有事件有版本号 `analytics_schema_version`。
- 生成失败使用有限枚举 `error_code`，不上传原始输入。
- 以 GA4/GSC 看获客，以 D1/服务端事件看支付，不用客户端 `payment_success` 作为账务事实。

---

## 11. 风险评估

| 风险 | 概率 | 影响 | 缓解 |
|---|---|---|---|
| 单生成器市场太小 | 高 | 高 | 建 SEO/免费工具矩阵；不依赖首页单词流量 |
| 月订阅价值不足 | 高 | 高 | 云端同步、历史轮换、PDF、Portal 完成前不开 live；测试年付/一次性 |
| 内容页同质化 | 高 | 中 | 每页绑定独立预设、工具或下载结果 |
| 年龄建议不安全/不合理 | 中 | 高 | 结构化任务库、人工审核、安全标签、家长确认 |
| “公平”承诺过度 | 中 | 高 | 显示时长/难度，允许锁定和调整，明确算法边界 |
| 第三方 Cookie 登录失败 | 中高 | 高 | API 同站子域、跨浏览器测试、错误恢复 |
| 支付 webhook 乱序/丢失 | 中 | 高 | 原子 claim、fixture、重试、告警、重放工具 |
| 本地数据丢失 | 高 | 中 | 导出/导入、schema migration、Pro 云同步 |
| 儿童隐私争议 | 中 | 高 | 数据最小化、昵称建议、同意管理、导出删除、日志脱敏 |
| 打印在不同设备异常 | 中 | 高 | Letter/A4、分页预览、Browser/OS 打印矩阵 |
| SEO 新站起量慢 | 高 | 中 | 低 KD 页、Pinterest、Embed 外链、持续 GSC 复盘 |
| 代码维护困难 | 高 | 中 | 拆分 minified 单页、模块化 Worker、自动化测试 |

---

## 12. 交接摘要

### 12.1 给文案

```text
产品名：ChoreChartEasy
主力用户：有 1–4 个 3–12 岁孩子，尤其是多孩家庭的英语家长
定位：The age-aware, print-first chore system for families with kids ages 3–12.
Headline：A fair weekly chore plan for every child.
SEO H1：Free printable chore chart maker for kids ages 3–12
Subhead：Add each child’s age, generate realistic responsibilities, and print a plan the whole family can follow.
Benefits：适龄 / 多孩公平 / 每周轮换 / 低屏幕与本地隐私
主 CTA：Build our family plan
次 CTA：Start with a blank printable
FAQ 必须覆盖：免费限制、年龄安全、多个孩子、公平定义、打印尺寸、数据保存、取消订阅、取消后数据
禁词：expert-approved、guaranteed、AI-generated、secure cloud backup（未完成前）
```

### 12.2 给设计

```text
首页首屏：输入孩子昵称与年龄，不能先展示大段营销文案
核心 Demo：两孩不同年龄 + 预计时长 + Week 1/Week 2 轮换对比
视觉方向：温暖、清晰、家长可信，不做幼儿园式过度卡通
打印：US Letter/A4、横竖版、黑白墨水友好、4 孩子分页
移动端：84.3% 的 ChoreChartAI 流量来自移动 Web，输入与预览必须移动优先
3–6 岁模式：大图标、大字号、少任务
不需要设计：复杂画布、100 字体、公开社区、孩子社交
```

### 12.3 给开发

```text
保持技术栈：Cloudflare Pages + Workers + D1 + Google OAuth + Creem
P0：结构化任务库、公平引擎 v2、打印预览、草稿恢复/Undo、云计划库、Creem live/Portal、Auth cookie 修复、完整埋点
P1：图标模式、routine packs、家庭 profile、周历史、双家长协作、PWA
API：新增 /api/plans CRUD、/api/account/export、/api/account delete、/api/billing/portal；保留 webhook entitlement 权威
数据：chart schema version；儿童信息最小化；Analytics 不接收姓名和任务文本
测试：生成算法、4 孩子打印、localStorage 异常、auth/logout、checkout、webhook 签名/重复/乱序/取消、fresh D1 migration
NOT-DO：原生 App、银行、聊天、照片验收、AI 助手、重型游戏化
```

---

## 13. 开放问题

1. 家长认为“公平”的首要指标是什么：数量、时间、难度、轮换还是孩子偏好？
2. 家长更愿意买一次性 Printable Pack，还是为跨设备和每周轮换订阅？
3. 3–6 岁图标模式是否应作为 Free 获客能力，而不是 Pro？
4. Free 应保留多少云端计划：0、3 还是 10？
5. 取消 Pro 后云端计划如何只读保留、保留多久？
6. 是否需要双家长协作作为真实付费 P0？
7. 年龄任务库由谁审核，采用什么来源和版本机制？
8. 首页是“一张家庭总表”还是“每个孩子一张表”更符合打印场景？

---

## 14. 发布 Gate

### 产品 Gate

- [ ] 5–8 个英语家庭完成可用性测试
- [ ] 生成到打印核心任务成功率达到初始目标
- [ ] 多孩公平规则经过至少 5 个家庭确认
- [ ] 4 孩子计划打印无截断
- [ ] 云端计划在第二设备可恢复

### 支付 Gate

- [ ] Creem live 配置与展示价格一致
- [ ] Customer Portal/取消可用
- [ ] 重复购买保护通过
- [ ] Webhook fixture、签名、重复、乱序、取消/退款测试通过
- [ ] 告警和重放路径通过演练
- [ ] 登录/权益在 Safari、Chrome 隐私模式验证

### 合规 Gate

- [ ] Privacy/Terms/Refund/Cancellation 更新
- [ ] Consent mode 生效
- [ ] 账号导出/删除可用
- [ ] GA 和服务端日志不含儿童姓名、任务文本

---

## 15. 证据与假设标记

### 已有证据

- Similarweb/Semrush 竞品与关键词数据。
- 2026-07-18 SERP 实扫。
- 当前前端、Worker、D1、Creem test 代码审计。
- 竞品公开价格与功能页面。

### 假设/待验证

- 12 个月趋势和季节性。
- 用户细分规模与真实付费意愿。
- 建议价格和漏斗目标。
- 公平算法阈值。
- 订阅相对一次性付费的优劣。
- 双家长协作的重要性。

原则：在完成访谈、行为数据和真实支付实验前，不把以上假设写成营销事实。
