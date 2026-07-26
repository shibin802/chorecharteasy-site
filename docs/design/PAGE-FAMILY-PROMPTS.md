# ChoreChartEasy 页面家族生成 Prompt Pack

日期：2026-07-26
设计真源：`docs/design/DESIGN.md`
文案真源：`docs/COPY-home-seo-freeze-2026-07-26.md`

> 这些 Prompt 用于继续生成内页设计真源。任何模型输出都必须回填冻结文案，不能自行改写事实、年龄建议、法律文本或价格。

---

## Global Prefix — 每个 Prompt 前都必须附加

```text
Use the ChoreChartEasy “Kitchen Table Utility” design system.

Brand: a warm, paper-first printable household utility for parents and caregivers. It is not a SaaS dashboard and not a children’s entertainment site.

Typography: Bricolage Grotesque for headings; Atkinson Hyperlegible for body and UI.
Colors: #F6F1E7 canvas, #FFFDF8 paper, #17313A ink, #1F6D62 primary teal, #C9432B primary CTA, #E9B949 highlight with dark ink, #C9D7D1 borders.

Use asymmetric editorial composition, thin paper rules, checkbox motifs, clipped-paper details, limited 8–16px radii, almost no shadows, and realistic product output.

Use inline SVG line icons only. No Material Symbols, emoji as UI icons, gradients, purple, stock photos, cartoon children, 3D blobs, fake testimonials, ratings, user counts, expert badges, centered SaaS hero, repetitive generic cards, Pricing, Sign in, Pro, subscription, cloud sync, or unsupported claims.

All copy must remain semantic HTML. Preserve the supplied Title, Meta, H1, H2, body, CTA, safety, privacy, FAQ, and footer text exactly. Do not rewrite legal or factual meaning.

Desktop: 1440px screen, 1180px content max. Mobile: 390px and valid at 320px. Body >=16px, touch targets >=44px, visible focus, WCAG AA, no page-level horizontal overflow.
```

---

## Prompt 1 — Printable Tool Landing (`/printable-chore-chart`)

```text
Create desktop and mobile screens for /printable-chore-chart using the Global Prefix.

Search intent: a parent wants an editable printable weekly chore chart now.

Metadata reference:
Title: “Free Printable Chore Chart for Kids | Edit & Print”
H1: “Free printable chore chart you can edit before printing”
Opening: “Start with a simple seven-day chart, replace any task, and preview the finished page before opening your browser’s print controls.”
Primary CTA: “Edit this printable”

Page structure:
1. Compact shared header.
2. Tool-first hero: H1 left; real Letter and A4 paper preview right; CTA opens/focuses editor.
3. Dominant editable weekly chart with title, task rows, Mon–Sun checkboxes, Add a task, Letter/A4 choice, Preview and print.
4. “What makes a chore chart easy to use?” as text-led editorial block.
5. “How to print on US Letter or A4” with real printer-setting diagram built from HTML/SVG, not a screenshot of a specific proprietary browser.
6. “Choose age-based chore ideas” links to age pages.
7. Four exact FAQ rows from Copy Freeze.
8. Final CTA and full legal footer.

States: blank chart, one edited row, local draft restored, storage unavailable, horizontal scroll, print overflow warning, print-ready.
Do not add subscription, account, watermark upsell, fake download count, or “unlimited”.
```

---

## Prompt 2 — Age Guide + Embedded Tool (`/chores-for-3-year-olds`, `/chores-for-5-year-olds`)

```text
Create a reusable desktop and mobile age-guide page pattern using the Global Prefix. Show two screen variants: age 3 and age 5. Keep each page’s copy and task data unique; do not make a programmatic number-swap template.

AGE 3 VARIANT
Title: “Chores for 3-Year-Olds: Simple Ideas + Printable Chart”
H1: “Chores for 3-year-olds: small jobs with adult help”
Opening: “At age 3, chores are short chances to participate—not tests of independence. Choose visible tasks, stay nearby, and expect to help.”
Primary CTA: “Make a chart for ages 3–4”
Safety box: “Adult supervision is required. Keep young children away from chemicals, sharp tools, hot surfaces, heavy objects, pet waste, and choking hazards. Adjust every idea to the child and home.”

AGE 5 VARIANT
Title: “Chores for 5-Year-Olds: Practical Ideas + Free Chart”
H1: “Chores for 5-year-olds: practical jobs to practice together”
Opening: “Many 5-year-olds can practice short household routines, but the right task depends on the child, tools, and home. Start small, demonstrate the steps, and edit the list as needed.”
Primary CTA: “Make a chart for ages 5–6”
Safety line: “An adult should review each task and provide the supervision the child needs.”

Shared page structure:
1. Text-first guide hero with a small real chore-chart paper preview, not a child illustration.
2. Sticky-on-desktop contents rail; inline contents on mobile.
3. Human-reviewed task groups as plain editorial lists with one “Add these to my chart” action per group.
4. Visible safety/adult-review callout near the first task list.
5. “What not to expect / how to keep the chart manageable” text section.
6. Embedded compact chart builder preloaded with that age band.
7. Four exact page-specific FAQ rows.
8. Related guide links, final CTA, legal footer.

Every task row must expose source/review metadata to the content pipeline even if that metadata is not shown to users. Do not invent more chore ideas in the design output.
```

---

## Prompt 3 — Morning Routine Tool (`/morning-routine-chart-for-kids`)

```text
Create desktop and mobile screens for /morning-routine-chart-for-kids using the Global Prefix.

Title: “Morning Routine Chart for Kids | Free Editable Printable”
H1: “Make an editable morning routine chart for kids”
Opening: “Start with a short before-school sequence, remove anything that does not fit, and print the finished routine where your family uses it.”
Primary CTA: “Edit this morning routine”

Design the tool around sequence rather than a generic weekly table:
- vertical numbered routine steps on the left
- compact weekday selection on the right or below
- drag/reorder handle with keyboard alternative
- editable step text
- US Letter/A4 preview
- “Preview and print” action

Page sections:
1. Tool-first hero and real routine-paper preview.
2. Editable routine sequence.
3. “Keep the sequence short and visible”.
4. “Choose steps that fit your child”.
5. “How to print the routine chart”.
6. Four exact FAQ rows.
7. Related tools, final CTA, legal footer.

Do not promise calmer mornings, less reminding, independence, behavior change, or expert approval.
```

---

## Prompt 4 — Chore Randomizer (`/chore-randomizer`)

```text
Create desktop and mobile screens for /chore-randomizer using the Global Prefix.

Title: “Free Chore Randomizer | Assign Household Jobs”
H1: “Randomly assign chores, then adjust the result”
Primary CTA: “Randomize chores”
Result CTA: “Turn this into a chart”
Boundary copy: “Random assignment does not measure difficulty, time, age, ability, or fairness. Review every result before using it.”

Page structure:
1. Compact hero with two editable lists: People and Chores.
2. Primary randomize action between/input below lists.
3. Result state as assignment rows with Swap/Edit/Remove actions.
4. Boundary callout immediately adjacent to result.
5. “Turn this into a weekly chart” preview and CTA.
6. “When random assignment needs adjustment” editorial section.
7. Three exact FAQ rows.
8. Related tools, final CTA, legal footer.

Required states: empty people, empty chores, unequal list sizes, duplicate name, randomized, edited result, reset confirmation.
Never show a “fairness score” or use “fair assignment”.
```

---

## Prompt 5 — Multiple Kids Beta (`/chore-chart-for-multiple-kids`)

```text
Create desktop and mobile screens for /chore-chart-for-multiple-kids using the Global Prefix.

Title: “Chore Chart for Multiple Kids | Editable Sibling Plan”
H1: “Build one editable chore chart for multiple kids”
Opening: “Add up to four children and create one age-based starting plan. Then review, swap, remove, or rewrite tasks to fit your family.”
Beta label: “BETA · STARTING SUGGESTIONS”
Primary CTA: “Build a multiple-kids chart”
Boundary copy: “The tool does not know each child’s abilities, schedule, or idea of fairness. An adult should review every assignment.”

Input design:
- maximum four rows
- each row has “Nickname or initials (optional)” and age-band selector, not exact birthday
- helper against full names and sensitive data
- Add another child / Remove actions

Output design:
- one shared printable plan with clear child/initial grouping
- task rows remain editable and movable
- no algorithm score, equal-effort meter, or fairness badge
- Letter/A4 preview and “Preview and print”

Page sections: start with age groups; review starting assignments; keep shared jobs visible; adjust before printing; four exact FAQ rows; related links; final CTA; footer.
```

---

## Prompt 6 — Legal / Contact Page Family

```text
Create a shared desktop and mobile legal-page template using the Global Prefix for Privacy, Terms, Cookie Policy, Refund Policy, and Contact.

This is a reading interface, not a marketing landing page.

Layout:
- compact shared header with “Return to chart maker”
- H1, Effective date, Draft/Current status if applicable
- desktop 240px in-page contents rail and 720px reading column
- mobile inline jump menu
- 16–18px body, generous 1.65 line height, visible focus and anchor offsets
- tables scroll inside their own containers on mobile
- quiet alert component for legal draft or current-no-purchase status
- bottom contact block and shared legal footer
- Cookie page includes functional “Open cookie settings” control

Do not rewrite any legal text. Use the compliance legal draft as the only copy source. Preserve placeholders visibly during design review. Refund page is noindex while there is no live paid product.
No decorative stock imagery, fake seals, legal badges, shield icons, or claims of compliance.
```

---

## Prompt 7 — 404

```text
Create desktop and mobile 404 screens using the Global Prefix.

Title: “Page not found | ChoreChartEasy”
H1: “We couldn’t find that page”
Body: “The page may have moved, or the address may be incomplete. Start a new chart or open one of the free tools below.”
Primary CTA: “Make a chore chart”
Secondary CTA: “Open the printable chart”

Use one simple misaligned-paper/checklist SVG motif. Keep the real HTTP status 404. Include links to Printable chore chart, Morning routine, Chores for ages 3–4, and Chore randomizer, plus the full legal footer.
Do not use a sad child illustration or jokey error copy.
```

---

## 通用生成后 QA Prompt

```text
Audit this generated screen against the supplied Copy Freeze and DESIGN.md.

Return a table with:
- missing exact copy
- rewritten copy
- invented claims or labels
- missing sections
- wrong price or billing language
- privacy/safety/fairness overclaims
- external fonts/icons/images
- inaccessible controls
- desktop/mobile overflow risks
- nonsemantic image text
- unsupported interaction states

Do not redesign yet. First report exact evidence and affected elements. Then provide one repair prompt that changes only the failed items.
```

[NEEDS_REVIEW]
