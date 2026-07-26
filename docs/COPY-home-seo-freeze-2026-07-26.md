# ChoreChartEasy 落地页文案与转化结构 — SEO-Copy Freeze

## 1. 基本信息

- 项目：`ChoreChartEasy`
- 域名：`https://chorecharteasy.com`
- 当前阶段：`05-copy`
- 目标市场：US / English
- 日期：2026-07-26
- 状态：`NEEDS_REVIEW`
- 交付范围：首页完整英文文案、CTA/状态文案、FAQ/schema、现有 P0 页面 SEO-Copy Freeze、设计/前端交接
- 不包含：HTML/CSS/JS 修改、公开发布、真实收费、法律页正式上线

状态原因：文案结构已完成，但合规阶段仍为 `BLOCKED`；GA4 consent、Clarity、法律页、运营主体和退款口径未修复前，本文件不能直接发布。

---

## 2. 上游输入

- `docs/PRD-product-definition-v2-lean-validation-2026-07-26.md`
- `docs/PRICING-commercial-model-calibration-2026-07-26.md`
- `docs/COMPLIANCE-legal-baseline-analysis-2026-07-26.md`
- 当前 `index.html`
- 当前 P0 页面矩阵与关键词证据

### 2.1 已冻结输入

- 主 ICP：现在就需要 printable chore chart 的英语家长。
- 核心任务：选择年龄/起点 → 编辑 → Print Preview → Print/PDF。
- 免费核心：无需账户、可编辑、US Letter/A4、1 个本地草稿。
- 多孩：Beta/起始方案，不承诺绝对公平。
- 付费：验证期不收费；Family Pack 是 planned one-time product，不是订阅。
- 成人操作者定位：parents、caregivers、teachers；不让儿童独立注册或提交资料。
- 禁止绝对承诺：private、safe、fair、COPPA compliant、guaranteed、free forever、unlimited。

### 2.2 待确认/阻塞

- GA4 consent 和 Clarity 遮罩未完成。
- `/cookies`、`/contact` 未上线。
- 实际 US Letter/A4 成品预览素材未冻结。
- Starter task 需要完成 `human_reviewed`。
- `$9.99` Family Pack 仍是定价假设，不能使用购买 CTA。
- “under a minute”没有真实任务计时数据，公开文案暂不使用；完成 5 次英语家庭测试后再决定。

---

## 3. 本阶段结论

### 3.1 一句话结论

**首页应从“多孩公平 + Pro 订阅 SaaS”改成“按年龄快速获得一张可编辑、可打印的表”，并让真实编辑器和打印预览承担 Proof。**

### 3.2 消息金字塔

1. **What**：free printable chore chart maker。
2. **Who**：parents/caregivers creating charts for kids ages 3–12。
3. **Why this tool**：不是从空白设计；先给 age-based starting chores，再由家长编辑。
4. **Output**：清楚的 weekly chart，US Letter/A4。
5. **Friction reducer**：no sign-up；一份草稿留在当前浏览器。
6. **Safety boundary**：建议只是起点，由成人按孩子能力和家庭环境判断。
7. **Monetization**：完成核心价值后，才展示 planned Family Pack early access。

### 3.3 不使用的 Proof

当前没有以下证据，不写：

- 用户数量
- 星级评分
- 家长 testimonial
- 专家/教师背书
- 行为改善百分比
- “less nagging”结果保证
- “under one minute”实际统计

当前使用 Product Proof：

- 可操作编辑器
- 真实 Letter/A4 成品预览
- 可见的年龄带 starter
- 可编辑 task rows
- 浏览器打印预览
- 黑白打印示例

---

## 4. 转化结构

```text
Header
→ Utility-first Hero + CTA
→ Age/starter selector + live editor
→ Finished-chart product proof
→ Why it is easier than starting blank
→ 3-step flow
→ Starting points/templates
→ Privacy & adult-use boundary
→ Age guides/free tools
→ Planned Family Pack interest card（只在 plan_ready/print 后强展示）
→ FAQ
→ Final CTA
→ Legal footer + Cookie settings
```

### 4.1 删除/隐藏

- 顶部 `Pricing`
- 顶部 `Sign in with Google`
- Pro Toolkit
- `$4.99/month`
- Test checkout
- Account/membership 文案
- `Smart weekly rotation` 付费承诺
- `Family plan library` 付费承诺
- 首页的大面积 watermark 升级话术
- Bedtime/Reward/Family locked Pro cards

若现有 P1 代码暂时保留，UI 仍必须隐藏，不进入 Copy Freeze。

---

# 5. 首页 Landing Copy — Final Draft

以下英文 block 是设计和前端的文案真源。除标记 `[CONDITIONAL]` 的内容外，不允许现场改写。

## 5.1 Header

### Brand

```text
ChoreChartEasy
```

### Navigation

```text
How it works
Print examples
Age guides
FAQ
```

### Header CTA

```text
Make a chart
```

行为：滚动到 `#maker` 并聚焦第一个 age/starter 控件。

移动端导航只保留 Brand + `Make a chart`；其余进入菜单。

---

## 5.2 Hero

### Eyebrow

```text
Free printable tool · No sign-up · Ages 3–12
```

### H1

```text
Make a printable chore chart that fits your child’s age
```

### Subhead

```text
Choose an age group, start with practical chore ideas, edit every task,
and print a clear weekly chart on US Letter or A4.
```

### Primary CTA

```text
Make my free chart
```

行为：聚焦 `Choose an age group`；若默认 starter 已可编辑，则滚动到 maker 并突出该 starter。

### Secondary CTA

```text
Start with a blank chart
```

行为：直接载入 5-row Blank starter，并滚动到 editor。

### Microcopy

```text
For parents and caregivers. No child account required.
```

### Proof chips

```text
Age-based starters
Edit every task
US Letter & A4
One draft saved in this browser
```

第四项只能在 localStorage/analytics 合规修复完成后公开。

### Hero design note

- 首屏右侧/下方必须是真实 chart preview，不是插画或 stock family photo。
- 移动端在一次滚动内看见 age/starter selector。
- 不在 Hero 展示价格、登录、Pro、testimonial 或大段说明。

---

## 5.3 Maker 起始区

### Section H2

```text
Start with a useful first draft
```

### Intro

```text
Choose an age group or a ready-made routine. You can change every suggestion before you print.
```

### Label

```text
Choose an age group
```

### Age options

```text
Ages 3–4
Ages 5–6
Ages 7–9
Ages 10–12
```

### Optional name field

Label：

```text
Nickname or initials (optional)
```

Placeholder：

```text
For example, Sam or S.
```

Privacy helper：

```text
Avoid full names, school names, addresses, health details, or other sensitive information.
```

### Starter label

```text
What do you want to make?
```

### Starter options

```text
Weekly chores
Morning routine
Blank chart
Multiple kids (Beta)
```

### Primary maker CTA

```text
Create my starting chart
```

### Safety helper

```text
Chore ideas are starting points. An adult should adjust each task to the child’s abilities and home environment.
```

### Multiple-kids helper

```text
Multiple-kids mode creates an age-based starting plan. Review and adjust the assignments for your family.
```

禁止写 `fair plan`、`safe plan` 或 `perfect balance`。

---

## 5.4 Editor

### Editor H2 / accessible label

```text
Edit your chart
```

### Chart title default

```text
Our Weekly Chore Chart
```

### Task input placeholder

```text
Enter a chore or routine step
```

### Add CTA

```text
Add a task
```

### Reorder CTA

```text
Move task
```

### Delete CTA/aria

```text
Delete task
```

### Print settings

```text
Paper size
US Letter
A4
Orientation
Portrait
```

### Main output CTA

```text
Preview and print
```

不要只写 `Print chart`，因为 PRD 要求先预览再进入系统打印。

### Draft helper

```text
This browser keeps one active draft so you can come back on this device.
```

前提：实现必须真的是一个 active draft，并提供 Clear local data。

### Clear CTA

```text
Clear local data
```

Confirmation：

```text
Clear this chart and its local draft from this browser? This cannot be undone.
```

Buttons：

```text
Keep my chart
Clear chart
```

---

## 5.5 Product Proof：Print examples

### H2

```text
See what you’ll print
```

### Intro

```text
Check the layout before opening your browser’s print or PDF controls.
```

### Example 1

```text
Weekly chore chart
A simple seven-day chart with editable tasks and clear checkboxes.
```

Caption：

```text
US Letter · Color
```

### Example 2

```text
Ink-friendly weekly chart
The same structure with clear borders and no color-dependent instructions.
```

Caption：

```text
A4 · Ink-friendly
```

### Example 3

```text
Morning routine
A shorter sequence for before-school routines.
```

Caption：

```text
US Letter · Color
```

### CTA

```text
Make a chart like this
```

规则：必须使用真实产品截图/渲染，不使用概念 mockup 冒充实际输出。

---

## 5.6 Problem → Solution

### H2

```text
Skip the blank design canvas
```

### Body

```text
A blank template still leaves you deciding what to write. A fixed PDF may not fit your child or your week.

ChoreChartEasy gives you an age-based starting list, then lets you replace, remove, or add any task before you print.
```

### Three benefits

#### H3

```text
Start with age-based ideas
```

Body：

```text
Choose one of four age groups to load a practical starting list. Every suggestion remains editable.
```

#### H3

```text
Change the plan to fit your home
```

Body：

```text
Rename the chart, edit tasks, add your own routines, and remove anything that does not belong.
```

#### H3

```text
Print for Letter or A4
```

Body：

```text
Preview the chart, choose a supported paper size, and use your browser to print or save as PDF.
```

---

## 5.7 How it works

### H2

```text
From age group to printable chart in three steps
```

### Step 1

H3：

```text
Choose a starting point
```

Body：

```text
Pick an age group, a morning routine, a blank chart, or the multiple-kids Beta.
```

### Step 2

H3：

```text
Edit every row
```

Body：

```text
Keep the useful suggestions and change anything that does not fit your child or home.
```

### Step 3

H3：

```text
Preview, then print
```

Body：

```text
Check the finished chart on screen, choose US Letter or A4, and open your browser’s print or PDF controls.
```

---

## 5.8 Starting points

### H2

```text
Choose the way you want to start
```

### Card 1

```text
Weekly chores
Start with a seven-day chart and age-based household tasks.
CTA: Start weekly chores
```

### Card 2

```text
Morning routine
Build a short before-school sequence and edit each step.
CTA: Start a morning routine
```

### Card 3

```text
Blank chart
Load an empty weekly structure when you already know what to add.
CTA: Start blank
```

### Card 4

```text
Multiple kids — Beta
Create one editable starting plan for up to four children in different age groups.
CTA: Build a multiple-kids chart
```

Beta helper：

```text
Assignments are starting suggestions, not a guarantee of equal effort or suitability.
```

---

## 5.9 Privacy and adult-use boundary

### H2

```text
Designed for adults, built around a paper routine
```

### Body

```text
ChoreChartEasy is for parents, caregivers, teachers, and other adults creating charts for children. Children do not need an account.

The chart maker is designed to keep chart content in this browser. Use a nickname or initials instead of a full name, and avoid sensitive information.
```

第二段只有在合规 P0 修复、Network QA 和 Clarity 处理完成后才能公开。

### Links

```text
Read the Privacy Policy
Clear local data
Cookie settings
```

---

## 5.10 Age guides and free tools

### H2

```text
Chore ideas and printable tools
```

### Intro

```text
Use an age guide when you need ideas, or open a focused tool when you already know the job.
```

### Cards

```text
Printable chore chart
Start with a clean weekly chart for US Letter or A4.
CTA: Open the printable chart
```

```text
Chores for ages 3–4
Small, visible tasks with adult help and supervision.
CTA: See chores for ages 3–4
```

```text
Chores for ages 5–6
Simple household routines children can practice with adult guidance.
CTA: See chores for ages 5–6
```

```text
Morning routine chart
Build and print a short before-school sequence.
CTA: Make a morning routine
```

```text
Chore randomizer
Randomly assign a list of jobs, then move the result into a chart.
CTA: Randomize chores
```

```text
Multiple-kids chart
Create an editable age-based starting plan for siblings.
CTA: Build a multiple-kids chart
```

注意：现有 URL 仍为 `/chores-for-3-year-olds` 和 `/chores-for-5-year-olds`，卡片文案使用年龄带，但 URL 不改。

---

## 5.11 Planned Family Pack interest card

默认不在 Hero、导航或编辑前展示。只在 `plan_ready`、`print_opened` 或页面下半部展示。

### Label

```text
PLANNED · NO CHARGE TODAY
```

### H2

```text
Want more ready-to-print layouts?
```

### Body

```text
We’re planning a Printable Family Pack with age-group charts, multiple-kids layouts, PDF and PNG files, and ink-friendly versions.
```

### Planned-price line

```text
Planned pilot price: $9.99 one-time
```

该行是价格意愿实验。必须与 Analytics consent、Privacy 和 early-access email 处理同时实现。

### CTA

```text
Join early access
```

### Microcopy

```text
No charge today. Joining the list does not purchase or reserve the pack. You can unsubscribe at any time.
```

### Email label

```text
Email address
```

### Submit success

```text
You’re on the early-access list. Check your inbox for confirmation.
```

仅在真实发送 confirmation 时使用后半句；否则写：

```text
You’re on the early-access list.
```

### Email error

```text
We couldn’t save your email. Please try again.
```

禁止使用：`Buy now`、`Get lifetime access`、`Only X left`、虚假倒计时。

---

## 5.12 FAQ — Visible Copy + FAQPage Schema Source

页面可见 FAQ 和 JSON-LD 必须使用同一份问答。

### FAQ 1

**Question**

```text
Is ChoreChartEasy free?
```

**Answer**

```text
Yes. You can choose a starter, edit the tasks, preview the chart, and print or save it as a PDF without creating an account. A separate Printable Family Pack is planned but is not currently available for purchase.
```

### FAQ 2

**Question**

```text
Do I need an account?
```

**Answer**

```text
No. The free chart maker does not require an account, and children should not create one. One active draft is stored in this browser so you can return on the same device.
```

### FAQ 3

**Question**

```text
What ages does the chart maker support?
```

**Answer**

```text
The starting library covers ages 3–12 in four groups: 3–4, 5–6, 7–9, and 10–12. The suggestions are starting points, so an adult should adjust every task to the child’s abilities and home environment.
```

### FAQ 4

**Question**

```text
Can I make one chart for multiple children?
```

**Answer**

```text
Yes. The multiple-kids Beta can create an editable starting plan for up to four children. Review and adjust the assignments; the tool does not guarantee equal effort or suitability for every family.
```

### FAQ 5

**Question**

```text
Can I print on US Letter and A4 paper?
```

**Answer**

```text
Yes. Preview the chart, choose US Letter or A4, and use your browser’s print controls to print or save as PDF. Check your printer’s scale and margin settings before printing.
```

### FAQ 6

**Question**

```text
Where is my chart saved?
```

**Answer**

```text
The chart maker is designed to keep one active draft in this browser. It is not cloud backup and will not automatically appear on another device. Clearing this site’s browser data removes the draft.
```

FAQ 6 只有在合规 P0 Network/Clarity 验收后发布。

### FAQ 7

**Question**

```text
Are the chore suggestions right for every child?
```

**Answer**

```text
No. They are general age-based starting ideas, not professional child-development or safety advice. An adult should consider the child’s abilities, supervision needs, tools, products, pets, allergies, and home environment.
```

---

## 5.13 Final CTA

### H2

```text
Make this week’s chore chart
```

### Body

```text
Choose a starting point, edit the tasks, and preview the finished chart before you print.
```

### Primary CTA

```text
Make my free chart
```

### Secondary CTA

```text
Start with a blank chart
```

### Microcopy

```text
No sign-up required for the free chart maker.
```

---

## 5.14 Footer

```text
© 2026 ChoreChartEasy. A chart-making tool for parents and caregivers.
```

Links：

```text
Privacy
Terms
Cookies
Refunds
Contact
Cookie settings
```

Footer 不能写 `Made for kids`。Refund 在无 live payment 时仍保留，但页面明确当前没有 live purchases。

---

# 6. 状态与失败文案

## 6.1 localStorage unavailable

```text
This browser couldn’t save your draft. You can keep editing and printing, but the chart may not return after you close or refresh this page.
```

CTA：

```text
Continue without saving
```

## 6.2 Corrupted draft

```text
We couldn’t restore the previous local draft. Start a new chart to keep going.
```

CTA：

```text
Start a new chart
```

## 6.3 Maximum children

```text
This version supports up to four children in one chart.
```

## 6.4 Empty task

```text
Enter a task before adding it to the chart.
```

## 6.5 Print preview failure

```text
We couldn’t open the print preview. Your chart is still here. Check your browser’s pop-up and print settings, then try again.
```

CTA：

```text
Try print preview again
```

## 6.6 Unsupported paper/layout

```text
This chart is too wide for the selected paper size. Shorten the longest tasks or switch the layout, then preview again.
```

## 6.7 Clear data success

```text
The local chart data was cleared from this browser.
```

## 6.8 Analytics consent banner

```text
We use essential storage to run the chart maker. With your permission, we use analytics to understand site usage. Analytics is off until you choose.
```

Buttons：

```text
Accept analytics
Reject non-essential
Cookie settings
```

## 6.9 Early-access duplicate

```text
This email is already on the early-access list.
```

## 6.10 Live payment

当前无文案，不展示 purchase CTA。真实支付解锁后必须返回 Pricing + Compliance 阶段重新 Freeze。

---

# 7. CTA Contract

| Location | CTA | Action | Success event | Failure |
|---|---|---|---|---|
| Header | `Make a chart` | scroll/focus maker | `cta_click` source=header | maker still visible; no route change |
| Hero primary | `Make my free chart` | focus age/starter or load default | `editor_start` source=hero | show inline starter error |
| Hero secondary | `Start with a blank chart` | load Blank | `starter_loaded` blank | retain current chart if load fails |
| Maker | `Create my starting chart` | load selected starter | `plan_ready` | show inline error; keep selections |
| Editor | `Add a task` | append row | no PII analytics | inline validation |
| Editor | `Preview and print` | open print preview | `print_opened` | print failure state |
| Product proof | `Make a chart like this` | load matching starter | `starter_loaded` source=example | fallback to Weekly |
| Guide card | specific verb+result | canonical route | page_view only after consent | 404 must not occur |
| Family Pack | `Join early access` | submit email consent | `paid_interest_click` + list status | inline retry, no checkout |
| Final | `Make my free chart` | maker | `cta_click` source=final | no route change |
| Footer | `Cookie settings` | reopen consent controls | no marketing event | settings must work without analytics |

所有事件遵守 Compliance allowlist；不传 nickname、age、title、tasks、email 或 order ID。

---

# 8. SEO-Copy Freeze — Homepage

## 8.1 Metadata

### Title

```text
Free Printable Chore Chart Maker for Kids | ChoreChartEasy
```

### Meta description

```text
Make a free printable chore chart for kids ages 3–12. Start with age-based ideas, edit every task, and print on US Letter or A4—no sign-up.
```

### Canonical

```text
https://chorecharteasy.com/
```

### H1

```text
Make a printable chore chart that fits your child’s age
```

## 8.2 Heading order

```text
H1 Make a printable chore chart that fits your child’s age
  H2 Start with a useful first draft
  H2 Edit your chart
  H2 See what you’ll print
  H2 Skip the blank design canvas
    H3 Start with age-based ideas
    H3 Change the plan to fit your home
    H3 Print for Letter or A4
  H2 From age group to printable chart in three steps
    H3 Choose a starting point
    H3 Edit every row
    H3 Preview, then print
  H2 Choose the way you want to start
  H2 Designed for adults, built around a paper routine
  H2 Chore ideas and printable tools
  H2 Want more ready-to-print layouts?
  H2 Frequently asked questions
  H2 Make this week’s chore chart
```

## 8.3 Semantic coverage

自然覆盖，不堆词：

- printable chore chart
- chore chart maker
- chore chart for kids
- weekly chore chart
- editable chore chart
- age-based chores
- US Letter
- A4
- print to PDF
- morning routine chart
- multiple kids

目标正文：约 700–1,000 个可见英文词，编辑器 labels 不计。设计不能隐藏 FAQ、How it works 和关键解释在不可抓取的 canvas/image 中。

## 8.4 Schema

- `WebApplication`
- `FAQPage`
- 不使用 AggregateRating、Review、假用户数。
- `offers.price=0` 只描述免费 chart maker。
- Planned Family Pack 未 live 前不添加 Product/Offer schema。

---

# 9. SEO-Copy Freeze — P0 Existing Pages

## 9.1 `/printable-chore-chart`

### Search intent

立即获得可编辑、可打印的 weekly chore chart。

### Title

```text
Free Printable Chore Chart for Kids | Edit & Print
```

### Meta

```text
Create a free printable chore chart for kids. Edit the weekly tasks, preview the layout, and print on US Letter or A4 without an account.
```

### H1

```text
Free printable chore chart you can edit before printing
```

### H2 structure

```text
Edit this weekly chore chart
What makes a chore chart easy to use?
How to print on US Letter or A4
Choose age-based chore ideas
Frequently asked questions
```

### Primary CTA

```text
Edit this printable
```

### Supporting copy

```text
Start with a simple seven-day chart, replace any task, and preview the finished page before opening your browser’s print controls.
```

### FAQ

- Is this printable free? → `Yes. The editable weekly chart and browser printing are free and do not require an account.`
- Can I save it as PDF? → `Yes. Choose Print, then select your browser or device’s Save as PDF option when available.`
- Does it fit A4? → `Yes. Choose A4 before previewing and check the final print scale and margins.`
- Can I change every chore? → `Yes. Every task row is editable before printing.`

### Word target

500–800 visible words excluding editor.

---

## 9.2 `/chores-for-3-year-olds`

### Search intent

家长寻找 3 岁孩子可参与的简单 chores，并希望直接变成表。

### Title

```text
Chores for 3-Year-Olds: Simple Ideas + Printable Chart
```

### Meta

```text
Find simple chores for 3-year-olds with adult help, then load the ideas into a free editable and printable weekly chore chart.
```

### H1

```text
Chores for 3-year-olds: small jobs with adult help
```

### H2 structure

```text
What can a 3-year-old help with?
Simple self-care and tidy-up jobs
Kitchen and family jobs with supervision
What not to expect at age 3
Turn these ideas into a printable chart
Frequently asked questions
```

### Opening copy

```text
At age 3, chores are short chances to participate—not tests of independence. Choose visible tasks, stay nearby, and expect to help.
```

### Safety box

```text
Adult supervision is required. Keep young children away from chemicals, sharp tools, hot surfaces, heavy objects, pet waste, and choking hazards. Adjust every idea to the child and home.
```

### Primary CTA

```text
Make a chart for ages 3–4
```

### Data rule

任务列表必须来自 `human_reviewed` task library；文案 Skill 不现场发明更多任务。

### FAQ

- How many chores should a 3-year-old have? → `Start with one or two short, visible jobs. Add more only when the routine feels manageable for the child and adult.`
- Should a 3-year-old do chores alone? → `No. Most tasks at this age need an adult nearby, and many work best when done together.`
- What if my child cannot do a suggested chore? → `Remove it or make it smaller. The list is a starting point, not a developmental requirement.`
- Can I print the list as a chart? → `Yes. Load the ages 3–4 starter, edit the tasks, and print on US Letter or A4.`

### Word target

800–1,200 visible words including reviewed task groups.

---

## 9.3 `/chores-for-5-year-olds`

### Title

```text
Chores for 5-Year-Olds: Practical Ideas + Free Chart
```

### Meta

```text
Explore practical chores for 5-year-olds, choose what fits your child, and make a free editable weekly chart for US Letter or A4.
```

### H1

```text
Chores for 5-year-olds: practical jobs to practice together
```

### H2 structure

```text
What chores can a 5-year-old try?
Bedroom and toy clean-up
Mealtime and family helper jobs
Morning and school-prep routines
How to keep the chart manageable
Make a printable chart for ages 5–6
Frequently asked questions
```

### Opening copy

```text
Many 5-year-olds can practice short household routines, but the right task depends on the child, tools, and home. Start small, demonstrate the steps, and edit the list as needed.
```

### Primary CTA

```text
Make a chart for ages 5–6
```

### Safety line

```text
An adult should review each task and provide the supervision the child needs.
```

### FAQ

- How many chores should a 5-year-old have? → `Begin with two or three short routines and adjust based on the child’s interest, ability, and schedule.`
- Should chores be tied to rewards? → `That is a family choice. The free chart can track routines without requiring points, money, or rewards.`
- Can I change the suggested chores? → `Yes. Replace, remove, or add any task before printing.`
- Can I make a morning routine instead? → `Yes. Open the Morning Routine starter and edit the steps.`

### Word target

800–1,200 visible words including reviewed task groups.

---

## 9.4 `/morning-routine-chart-for-kids`

### Title

```text
Morning Routine Chart for Kids | Free Editable Printable
```

### Meta

```text
Make a free morning routine chart for kids. Edit the steps, preview the sequence, and print on US Letter or A4 without creating an account.
```

### H1

```text
Make an editable morning routine chart for kids
```

### H2 structure

```text
Edit this morning routine
Keep the sequence short and visible
Choose steps that fit your child
How to print the routine chart
Frequently asked questions
```

### Opening copy

```text
Start with a short before-school sequence, remove anything that does not fit, and print the finished routine where your family uses it.
```

### Primary CTA

```text
Edit this morning routine
```

### FAQ

- Is the routine chart free? → `Yes. Editing and browser printing are free and do not require an account.`
- How many steps should I add? → `Use the fewest steps that make the routine clear. Younger children may need a shorter sequence and more adult help.`
- Can I change the order? → `Yes. Reorder or rewrite the steps before printing.`
- Can I save it as a PDF? → `Yes, when your browser or device offers Save as PDF in its print controls.`

### Word target

600–900 visible words excluding editor.

---

## 9.5 `/chore-randomizer`

### Title

```text
Free Chore Randomizer | Assign Household Jobs
```

### Meta

```text
Randomly assign household chores to family members, roommates, or a team. Review the result and turn it into an editable printable chart.
```

### H1

```text
Randomly assign chores, then adjust the result
```

### H2 structure

```text
Add people and chores
Review the assignments
Turn the result into a weekly chart
When random assignment needs adjustment
Frequently asked questions
```

### Primary CTA

```text
Randomize chores
```

### Result CTA

```text
Turn this into a chart
```

### Boundary copy

```text
Random assignment does not measure difficulty, time, age, ability, or fairness. Review every result before using it.
```

### FAQ

- Does the randomizer guarantee fair assignments? → `No. It distributes entries randomly and does not compare effort, safety, age, or ability.`
- Can I edit the result? → `Yes. Move the result into the chart maker and change any assignment.`
- Is the randomizer only for children? → `No. It can be used for a household, roommates, caregivers, or other small groups.`

### Word target

400–700 visible words excluding tool.

---

## 9.6 `/chore-chart-for-multiple-kids`

### Title

```text
Chore Chart for Multiple Kids | Editable Sibling Plan
```

### Meta

```text
Create one editable chore chart for multiple kids in different age groups. Review the starting assignments and print on US Letter or A4.
```

### H1

```text
Build one editable chore chart for multiple kids
```

### H2 structure

```text
Start with each child’s age group
Review the starting assignments
Keep shared jobs visible
Adjust the chart before printing
Frequently asked questions
```

### Opening copy

```text
Add up to four children and create one age-based starting plan. Then review, swap, remove, or rewrite tasks to fit your family.
```

### Beta label

```text
BETA · STARTING SUGGESTIONS
```

### Primary CTA

```text
Build a multiple-kids chart
```

### Boundary copy

```text
The tool does not know each child’s abilities, schedule, or idea of fairness. An adult should review every assignment.
```

### FAQ

- How many children can I add? → `The current version supports up to four children in one chart.`
- Does it make the chores equal? → `No. It creates age-based starting suggestions, not a guarantee of equal time, effort, or suitability.`
- Can I swap chores? → `Yes. Edit or replace any task before printing.`
- Are names required? → `No. Use optional nicknames or initials and avoid sensitive information.`

### Word target

600–900 visible words excluding tool.

---

## 9.7 Legal and utility pages

### `/privacy`

- Title: `Privacy Policy | ChoreChartEasy`
- H1: `Privacy Policy`
- CTA: `Return to the chart maker`
- Copy source: compliance draft only; Copy stage cannot rewrite legal meaning.

### `/terms`

- Title: `Terms of Use | ChoreChartEasy`
- H1: `Terms of Use`
- CTA: `Return to the chart maker`
- Copy source: compliance draft only.

### `/cookies`

- Title: `Cookie Policy & Settings | ChoreChartEasy`
- H1: `Cookie Policy`
- CTA: `Open cookie settings`
- Copy source: compliance draft only.

### `/refund`

- Title: `Refund Policy | ChoreChartEasy`
- H1: `Refund Policy`
- Current lead: `ChoreChartEasy does not currently offer a live paid product.`
- Meta robots: `noindex` until live purchase is available and policy is frozen.

### `/contact`

- Title: `Contact | ChoreChartEasy`
- H1: `Contact ChoreChartEasy`
- CTA: `Email support`
- Copy source: compliance draft only.

### `/404`

- Title: `Page not found | ChoreChartEasy`
- H1: `We couldn’t find that page`
- Body: `The page may have moved, or the address may be incomplete. Start a new chart or open one of the free tools below.`
- Primary CTA: `Make a chore chart`
- Secondary CTA: `Open the printable chart`
- HTTP status must remain 404.

---

# 10. 合规与禁词扫描

## 10.1 已删除/替换

| Current copy | Replacement |
|---|---|
| `Sibling-safe weekly rotation` | 删除；多孩只说 starting suggestions |
| `Private and print-first` | 条件式 `designed to keep chart content in this browser` |
| `safe, realistic responsibilities` | `practical starting ideas` + adult review |
| `Fair for siblings` | `Review the starting assignments` |
| `Our Fair Family Plan` | `Our Family Chore Chart` |
| `Age-Appropriate Plan` | `Age-Based Starting Chart` |
| `Unlimited editing and printing` | `Edit and print your chart` |
| `$4.99/month` | 删除 |
| `Pro Family` | 删除 |
| `Try Pro in test checkout` | 删除 |
| `Google sign-in required` | 删除 |
| `not uploaded to our server` | 条件式、待 Network QA |
| `less reminding` | 删除结果暗示 |

## 10.2 禁止新增

```text
AI-powered
expert-approved
teacher-approved
pediatrician-approved
Montessori certified
official
COPPA compliant
100% private
completely secure
anonymous
guaranteed safe
perfectly fair
guaranteed to reduce nagging
free forever
unlimited
lifetime access
best chore chart maker
#1 chore chart
```

## 10.3 可使用但必须有事实支持

- `Free`：只用于当前确实免费的 maker/edit/print。
- `No sign-up`：只用于免费核心，不代表 future purchase 不需要 email。
- `Ages 3–12`：任务库和 UI 必须覆盖。
- `US Letter & A4`：打印 QA 必须通过。
- `saved in this browser`：localStorage 和 Clear data 必须通过。
- `one active draft`：不得暗示 plan library/cloud。
- `$9.99 one-time`：只能标 planned/pilot/no charge today，直到 live Gate。

---

# 11. 设计与前端不可改动合同

1. Hero H1、Subhead 和 Primary CTA 不可改成抽象品牌口号。
2. Maker 必须在首屏或移动端一次滚动内可见。
3. 真实 editor/preview 是核心 Product Proof，不用 stock photo 替代。
4. FAQ 可折叠，但内容必须存在 DOM，schema 与可见文本一致。
5. 不把核心 SEO copy 做成图片、canvas 或纯客户端异步不可抓取内容。
6. 不恢复 Pricing/Login/Pro 导航。
7. Family Pack 必须写 planned/no charge today，不能出现 Buy CTA。
8. Safety helper 必须靠近年龄 starter，不只放 footer。
9. Nickname helper 不能删除。
10. Privacy block 只有合规 P0 修复后才能发布。
11. Cookie banner 的 Reject 不能视觉降级成隐蔽文字链。
12. Footer 六个 legal/contact/settings 项不可删。
13. Print examples 必须来自真实输出并标明 Letter/A4、Color/Ink-friendly。
14. 不因版式空间不足删除 FAQ、Safety、Privacy 和输出规格；应调整布局。

---

## 12. 验收清单

- [x] Headline 结果导向，包含具体产品和用户上下文。
- [x] CTA 是动词+结果：所有主 CTA 均指向明确生成、编辑、预览或加入名单动作。
- [x] FAQ 首句直答：每个答案首句先给 Yes/No 或直接结论。
- [x] 禁用空泛 AI 味词：已完成；命中项只保留在禁止清单和审计说明中。
- [x] 5 秒内能知道 What / Who / Why / CTA。
- [x] Hero 没有价格、登录和 Pro 干扰。
- [x] Product Proof 不依赖虚假 testimonial。
- [x] 首页所有主要 section 有可直接排版的英文 copy。
- [x] P0 indexable 页面有 Title/Meta/H1/H2/CTA/FAQ/词数合同。
- [x] FAQ/schema 真源一致。
- [x] CTA 有动作、事件和失败态合同。
- [x] 免费/付费边界与定价报告一致。
- [x] 成人操作者、儿童数据最小化和安全边界已进入文案。
- [x] 已扫描 AI 味、绝对隐私、安全、公平、认证和结果保证。
- [ ] 合规 P0 技术修复未完成。
- [ ] Starter task 人工审核未完成。
- [ ] 真实 Letter/A4 成品素材未冻结。
- [ ] Family Pack 价格和 early-access 数据处理未 Owner Review。

---

# 下游交接：落地页文案与转化结构摘要

## 当前结论

- 状态：`NEEDS_REVIEW`
- 一句话结论：首页文案已完成 utility-first 重构，重点从多孩订阅 SaaS 改为无注册的 age-based 生成、编辑和打印；合规修复完成前不可发布。

## 关键输入

- 项目：ChoreChartEasy
- 当前阶段：05-copy
- 上游资料：PRD v2、定价报告、合规报告、当前首页源码。

## 本阶段交付物

- 文件：`docs/COPY-home-seo-freeze-2026-07-26.md`
- 核心判断：Hero + editor + print examples 是主转化链；Family Pack 只做后置 interest test。
- 已确认：ICP、免费核心、一次性商业模型方向、页面矩阵、禁词和成人操作者边界。
- 待确认：合规 P0、任务审核、真实打印素材、early-access 数据处理和 `$9.99` 价格实验。

## 质量门槛自检

- 通过项：消息层级、首页全文、CTA、FAQ/schema、状态文案、SEO-Copy Freeze、禁词扫描、设计合同。
- 未通过项：当前生产实现与 Copy Freeze 尚未对齐，合规仍为 BLOCKED。

## 风险

- P0：前端继续保留 GA/Clarity、登录/Pro、旧订阅定价和绝对隐私承诺。
- P1：没有真实打印素材；年龄任务未审核；首页过长导致 editor 下沉。
- P2：Paid-interest 样本不足；SEO 子页内容同质化。

## 给下游的最小必要信息

- 下一阶段：`site-design-student`；随后 `frontend-site-automation`。
- 必须读取：本文件第 4–12 节，以及 Compliance 报告第 3–13 节。
- 不能假设：旧首页文案可保留、Pro 可上线、Clarity 已合规、Family Pack 可购买、用户评价/速度数据存在。
- 下游不能改动：Hero message、CTA intent、成人定位、Safety/Privacy block、planned/no-charge 文案、FAQ/schema 同源和 legal footer。

[NEEDS_REVIEW]
