# ChoreChartEasy 合规与基础法律页面评估

## 1. 基本信息

- 项目：`ChoreChartEasy`
- 域名：`https://chorecharteasy.com`
- 当前阶段：`04-compliance`
- 目标市场：US / English；网站公开可被其他地区访问
- 日期：2026-07-26
- 状态：`BLOCKED_PENDING_OWNER_REVIEW`
- 上游：
  - `docs/PRD-product-definition-v2-lean-validation-2026-07-26.md`
  - `docs/PRICING-commercial-model-calibration-2026-07-26.md`
  - 当前线上首页和本地源码
  - 当前 `privacy.html`、`terms.html`、`refund.html`

> 重要声明：本报告是产品合规风险分析和页面草案，不是律师意见。法律实体、适用法律、数字内容退款、跨境处理和儿童隐私边界必须由 Owner 确认；真实收费前建议由熟悉目标市场的专业人士复核。

## 1.1 2026-07-26 返修后增补

本报告第 2 节及后续风险清单保留的是**返修前基线证据**，不再代表本地候选的当前实现。返修结果见 `docs/QA-REPAIR-2026-07-26.md`。

本地候选已完成：

- GA4 默认关闭，仅明确同意后加载；Reject/Withdraw/GPC 已通过真实浏览器测试。
- Clarity、Google OAuth、Pro 月订阅、测试 checkout 和首页 `/api/me` 已从当前免费产品路径移除。
- `/cookies`、`/contact` 已存在；5 个法律/联系页已按当前免费 Maker 重写。
- 法律占位符、Draft/Do-not-publish 标记、未来 Creem/Early Access/Auth 数据流假设均为 0。
- 当前 Refund 页面只说明没有生产支付或订阅，不提前承诺未来数字产品退款规则。
- chart 内容保留在浏览器 active draft，不进入当前 Analytics 或应用后端。

仍未解除的生产 Gate：

1. Owner/适用法律专业人士复核 operator-neutral 法律文本，并决定是否需要公开 legal operator、地址或指定司法辖区。
2. `support@chorecharteasy.com` 已验证域名 MX/SPF，但尚未完成真实收信和回复测试。
3. 当前候选未 commit、未 push、未部署，也没有 Cloudflare Preview Re-QA。

因此本报告状态仍是 `BLOCKED_PENDING_OWNER_REVIEW`，但阻塞原因已从“候选代码与法律页不一致”收缩为“Owner/法律/邮箱/Preview Gate 未签字”。

---

## 2. 本阶段结论

### 2.1 一句话结论

**当前免费本地工具可以在完成最小安全修复后继续验证，但现有数据流、Privacy、Clarity、订阅文案和新版 PRD 不一致，不能标记为合规完成，也不能开放真实收费。**

### 2.2 当前最关键的事实

1. 线上首页和所有已检查 HTML 页面直接加载 Google Analytics 4 与 Microsoft Clarity。
2. 浏览器在未展示 consent 交互时已设置 `_ga` Cookie，并发送 GA4 `page_view`。
3. 页面没有 Cookie banner 或 Cookie Settings。
4. `/cookies` 当前返回 404。
5. Privacy 只披露 GA4，没有披露 Microsoft Clarity/session replay。
6. 编辑器中的儿童姓名、标题和 chore 输入没有发现 Clarity masking 属性。
7. 首页每次访问都会请求跨源 Worker `/api/me`；当前 free-first PRD 并不需要这个请求。
8. Privacy 声称 chart drafts “are not uploaded to our servers”，但在没有验证 Clarity 遮罩前，这个绝对承诺没有证据。
9. 首页仍展示 Google 登录、Pro、`$4.99/month`、订阅 checkout test，与新版 PRD 和一次性付费模型冲突。
10. Refund 页面仍是订阅取消政策，与计划中的 `$9.99 one-time Printable Family Pack` 冲突。
11. 当前 Terms 允许 classroom use，而定价报告将付费 Pack 许可限定为个人家庭使用，授权边界不一致。
12. `support@chorecharteasy.com` 使用域名邮箱，域名存在 MX/SPF；但本轮没有验证该邮箱是否能真实收信和回复。

### 2.3 状态解释

`BLOCKED` 表示：

- 不能把当前站点声明为“合规完成”；
- 不能开放真实支付；
- 不能继续使用绝对的 `private` / `not uploaded` 对外承诺；
- 需要完成第 12 节 P0 修复并重新测试。

它不等于必须立刻关闭整个免费站。最低风险路径是暂时禁用非必要追踪、登录和 Pro 测试入口，只保留本地生成、编辑和打印。

---

## 3. 数据清单

### 3.1 用户主动输入

| 数据 | 当前位置 | 当前处理 | 是否必要 | 风险 |
|---|---|---|---|---|
| 儿童姓名/家庭成员名称 | `#child-name-*` | localStorage/页面 DOM | 非必要；昵称或首字母即可 | 可能识别儿童；共享设备暴露；session replay 风险 |
| 儿童精确年龄 3–12 | age selector | localStorage/页面 DOM | 生成建议需要，但可改年龄带 | 与姓名组合后风险上升 |
| Chart title | `.chart-title` | localStorage/页面 DOM | 可选 | 可能含姓名、学校或敏感内容 |
| Chore/task 文本 | `.chore-input` | localStorage/页面 DOM | 核心功能需要 | 可能含健康、行为、家庭隐私 |
| 每日完成状态 | checkboxes | localStorage/页面 DOM | 可选 | 行为/习惯信息，可能涉及儿童 |
| Early-access 邮箱 | 规划中，尚未实现 | `[待确认]` | 付费验证可选 | 营销同意、退订、保留期 |
| Google 账号资料 | 当前可选登录 | Worker/Google OAuth | 新 PRD P0 不需要 | email、name、avatar、Google ID |
| Support 邮件内容 | support email | 邮件服务商 | 支持需要 | 可能含订单和家庭信息 |
| 支付身份和订单 | Creem，当前 test | Creem + Worker | 真实购买后需要 | email、customer/order ID、状态 |

### 3.2 自动采集

| 数据 | 当前接收方 | 当前触发 | 备注 |
|---|---|---|---|
| IP、浏览器、设备、页面 URL、referrer、粗略位置 | Cloudflare/GA4/Clarity | 页面加载 | GA4/Clarity 当前无 consent gate |
| GA client/session identifiers | Google Analytics | 页面加载 | 已观察 `_ga` 与 `_ga_*` Cookie |
| 页面行为、滚动、点击、可能的 DOM 变化 | Microsoft Clarity | 页面加载 | 编辑器字段没有发现显式 mask |
| `/api/me` 请求元数据 | Cloudflare Worker | 首页加载 | 即使未登录也请求 |
| 网络错误/安全日志 | Cloudflare | 请求期间 | 具体保留期和区域 `[待确认]` |
| checkout/order/webhook 数据 | Creem/Worker | 当前 test；未来 live | 真实收费前必须冻结 Data Contract |

### 3.3 本地存储

当前/规划中的 key 包括 chart draft、saved plans、theme、rotation history 等。法律页必须区分：

- localStorage 不是服务器账户；
- 数据停留在当前浏览器/设备，除非第三方录屏或未来同步功能改变这一点；
- 用户可通过“Clear local data”按钮或浏览器站点数据清理；
- 清理浏览器、无痕窗口结束、换设备可能导致数据丢失；
- 不应把 localStorage 说成加密云备份或安全保险箱。

### 3.4 严禁进入 analytics/log 的字段

- child/family member name
- exact child age
- chart title
- chore/task strings
- completion details
- email
- Google user ID
- Creem order/customer ID
- OAuth token、session token、download token
- support message正文

允许事件只使用白名单字段：

```text
page_view: route_group
starter_selected: starter_id
plan_ready: starter_id, child_count_bucket, task_count_bucket
print_opened: paper_size, orientation
print_completed: paper_size, orientation
paid_interest_view: offer_id
paid_interest_click: offer_id
checkout_started: product_code
purchase_completed: product_code, currency, value
```

约束：

- `child_count_bucket` 使用 `1 / 2 / 3+`。
- 不向 GA4/Clarity 发送 `age_band`，除非后续完成专项隐私复核。
- URL query/hash 不携带 chart 内容、姓名、年龄、email 或订单 ID。
- `purchase_completed` 不带 customer/order ID。

---

## 4. 第三方服务映射

| 服务 | 用途 | 当前状态 | 处理的数据 | 页面披露 | 退出/控制 | 风险级别 |
|---|---|---|---|---|---|---|
| Cloudflare Pages | 静态托管、CDN、安全 | 已启用 | IP、请求、设备/网络日志 | Privacy 只笼统提 Cloudflare | 无法完全退出；为提供服务必要 | P1：补用途、保留和跨境说明 |
| Cloudflare Workers | `/api/me`、OAuth、checkout/entitlement | 已启用/测试 | 请求元数据、session、账户/订单数据 | Privacy 不够具体 | P0 阶段可移除首页自动请求 | P1；真实支付前 P0 |
| Google Analytics 4 | 流量和漏斗分析 | 已启用 | client ID、页面、设备、粗略位置、事件 | 已披露但不完整 | 当前只能浏览器阻止；没有站内控制 | P0：先 consent 后加载 |
| Microsoft Clarity | 热图/session replay | 已启用 | 行为、DOM、可能的编辑器内容 | 未披露 | 无站内控制 | P0：先移除；恢复需 consent + mask + QA |
| Google OAuth | 可选登录 | 首页仍展示 | email、display name、avatar、Google ID | 已披露 | 不登录即可避开 | 与新版 P0 冲突，建议隐藏/移除 |
| Creem | 未来 checkout、税、收据、退款、订单 | test mode | 付款身份、订单、税务和付款数据 | 当前按订阅描述 | checkout 前查看其条款/隐私 | 真实收费前 P0 |
| Email provider | support/early access | 未确认 | email、邮件正文、订单引用 | 未披露具体服务商 | unsubscribe/delete request | P1：确认服务商和保留期 |
| Google Search Console | SEO 搜索表现 | 已启用 | 聚合搜索/点击数据 | 通常无前端脚本 | 不适用 | P2 |

### 4.1 推荐的最小第三方架构

验证期：

```text
Cloudflare Pages
+ 必要的安全/网络日志
+ consent 后的 GA4
- Clarity（先移除）
- Google OAuth
- 首页 /api/me 自动请求
- Creem live checkout
```

行为数据真正有规模后，如需恢复 Clarity，必须先完成：

1. 非必要 analytics consent；
2. 全部用户输入和输出区域 mask；
3. 禁止记录 legal/checkout/account 页面；
4. 用测试姓名、任务和 chart title 查看实际录屏；
5. Privacy/Cookie 页面明确披露；
6. 可撤回 consent 后停止采集并清理相关 Cookie。

---

## 5. 儿童与家庭数据风险

### 5.1 产品受众边界

产品应明确：

> ChoreChartEasy is a tool for parents, caregivers, and other adults. It is not intended for children to use on their own.

SEO 文案可以描述 “chore charts for kids”，但 UI、Terms 和 Privacy 应保持成人操作者定位。不要通过儿童口吻要求孩子注册、填写姓名、上传照片或建立账户。

### 5.2 最小化策略

- `Child name` 改为 `Nickname or initials (optional)`。
- 提示：`Avoid full names, school names, addresses, health details, or other sensitive information.`
- 精确年龄选择可以保留在本地，但 analytics 只记录 starter ID，不记录精确年龄。
- P0 不建立儿童账户、不收生日、不收学校、不收照片、不收位置、不收行为画像。
- chart title 和 task 输入全部视作潜在家庭/儿童内容，禁止进入第三方 analytics。
- 提供明显的 `Clear local data`。

### 5.3 COPPA 边界

当前建议不是宣称 “COPPA compliant”，而是主动降低是否构成儿童数据收集的风险：

- 服务面向成人；
- 不允许儿童建立账户；
- 不要求儿童个人资料；
- chart 内容设计为本地处理；
- 不把儿童相关输入发送给第三方分析；
- 收到疑似儿童直接提交的数据时提供联系和删除流程。

是否满足特定法律要求取决于实际实现、受众、营销和数据流，必须避免未经律师复核的绝对合规声明。

---

## 6. Cookie 与 consent 合同

### 6.1 默认状态

- Essential：允许。
- Analytics：默认关闭。
- Advertising：当前不使用，保持关闭。
- GA4 和 Clarity 不得在用户选择前加载。
- 更安全的实现是 lazy-load analytics scripts，而不只是先加载脚本再依赖 provider 状态。

### 6.2 Banner

第一层必须有同等可见的：

- `Accept analytics`
- `Reject non-essential`
- `Cookie settings`

说明：

> We use essential storage to run the chart maker. With your permission, we use analytics to understand site usage. Analytics is off until you choose.

### 6.3 设置页

- Essential：always on，说明原因。
- Analytics：toggle off by default。
- Advertising：not used。
- `Save choices`。
- footer 永久提供 `Cookie settings`。
- 用户撤回后停止后续采集并删除能由本站删除的相关 Cookie/local identifiers。
- 识别 `Sec-GPC` / `navigator.globalPrivacyControl` 时保持非必要处理关闭。
- consent 记录只保存必要字段：version、categories、timestamp；建议 180 天后重新确认，具体期限由 Owner/合规复核。

### 6.4 Legal 页面

- `/privacy`、`/terms`、`/cookies`、`/refund` 不加载 Clarity。
- legal 页面上的 GA4 也必须服从 consent。
- 不以拒绝 analytics 阻断免费工具。

---

## 7. 支付、数字产品与退款

### 7.1 当前阶段

- 当前不得真实收费。
- 首页 CTA 只能是 early-access/interest，不得暗示可购买。
- 当前 Refund 页面应改为“当前无 live purchases”，移除订阅续费段落。

### 7.2 Family Pack Pilot 前必须冻结

- 法律运营主体名称和地址。
- 售价、币种、税务显示和 Merchant of Record 关系。
- 交付物数量、格式、版本和个人使用许可。
- 下载限制和恢复方式。
- 退款条件、法定权利、处理方和处理时限。
- 数字内容立即交付与适用地区撤回权处理；Creem checkout 是否提供相应同意流程 `[待确认]`。
- Support 邮箱真实收发。
- 订单、webhook、退款、争议、下载日志的数据保留。

### 7.3 推荐的退款口径

不要写 blanket “no refunds”。建议：

- 明确数字产品通常在付款后立即提供；
- 在法律允许范围内，文件已成功下载后的改变主意通常不退款；
- 重复扣款、无法访问、文件损坏或内容与页面实质不符可申请处理；
- 不限制消费者依法享有的权利；
- 由 Creem 作为 Merchant of Record 处理付款/退款时，页面表达必须与 Creem checkout 和条款一致；
- 订阅尚未上线，不出现 cancellation/renewal 文案。

最终退款文本在核对 Creem 生产产品设置和目标市场后由 Owner 确认。

---

## 8. 素材与知识产权

### 8.1 当前素材盘点

- 仓库仅发现 `favicon.svg` 作为独立图片资产。
- 首页主要使用系统字体、CSS 图形和 Unicode emoji。
- 没有发现第三方图片包或字体文件。
- 没有发现完整的素材来源/许可证台账。
- 年龄任务文案和 Printable Pack 仍需要原创与审阅记录。

### 8.2 上线合同

每个未来图标、插画、模板和字体记录：

```text
asset_id
file_path
source_url_or_creator
license
commercial_use_allowed
modification_allowed
attribution_required
proof_path
reviewed_at
reviewed_by
```

禁止：

- 从 Canva、TPT、竞品站直接下载后改色销售；
- 使用不明确允许商业再分发的图标/模板；
- 用 Disney、Marvel、Bluey 等角色吸引儿童；
- 使用 “Montessori certified/official” 等未获授权表达；
- 把 competitor screenshots 放进商业产品。

### 8.3 产品内容

- 每条 age-based task 保留 `source_note`、`review_status` 和 `safety_note`。
- `human_reviewed` 不等于专业医疗/儿童发展认证。
- 建议内容必须注明成人判断和监督。

---

## 9. 禁用表达与替代表达

| 禁用/高风险表达 | 原因 | 推荐替代 |
|---|---|---|
| `100% private` / `completely private` | 存在 hosting/analytics 数据流 | `Chart content is designed to stay in your browser; see Privacy`（仅在完成遮罩后） |
| `Your data is never uploaded` | 当前 Clarity 无遮罩证据 | `We do not intentionally send chart content to our servers`，并确保实现一致 |
| `kid-safe` / `guaranteed safe chores` | 每个孩子能力和家庭环境不同 | `Age-based starting suggestions; adult review and supervision required` |
| `perfectly age-appropriate` | 无法对每个儿童保证 | `Grouped by age as a starting point` |
| `fair for every sibling` | 公平是主观且结果相关 | `Helps organize and rotate shared responsibilities` |
| `COPPA compliant` | 未经专项法律审查 | 描述实际最小化措施，不做认证式结论 |
| `secure` / `anonymous` | 无法绝对证明 | 描述具体控制，如 local storage、masked fields、consent |
| `official` / `certified` | 无授权或认证 | 删除，除非有书面证据 |
| `guaranteed results` | 家庭行为结果不可保证 | `Designed to help families build routines` |
| `free forever` | 未来商业模式可能改变 | `Free chart maker`，并按当前能力准确描述 |
| `unlimited` | 与额度和成本不符 | 写具体数量和期限 |
| `no refund under any circumstances` | 可能冲突法定权利 | 使用第 7.3 节条件式退款口径 |
| `AI-powered` | 当前核心是规则任务库 | `Age-aware` 或 `rule-based suggestions` |

当前首页应优先修订：

- `Private and print-first`
- `safe, realistic responsibilities`
- `Sibling-safe weekly rotation`
- `Fair for siblings`
- `print without our watermark` 与新版 Free/Pack 边界

---

## 10. 法律页 Route Contract

| Route | 页面 | 当前 | 目标 | canonical/index |
|---|---|---|---|---|
| `/privacy` | Privacy Policy | 200，但内容不完整 | 重写 | canonical self；建议 index |
| `/terms` | Terms of Use | 200，但商业模型过期 | 重写 | canonical self；建议 index |
| `/cookies` | Cookie Policy & Settings | 404 | 新建 | canonical self；可 index |
| `/refund` | Refund Policy | 200，但仍是订阅 | 当前阶段改为无 live purchase；Pilot 前再冻结 | canonical self；可 index |
| `/contact` | Contact | 404/未建立 | 新建 | canonical self；可 index |

Footer 全站固定顺序：

```text
Privacy · Terms · Cookies · Refunds · Contact · Cookie settings
```

规则：

- Route 不带 `.html`。
- 如果保留 `/privacy.html` 等旧 URL，308 到 canonical route。
- Legal 页面不得因 JS 失败而空白。
- legal 页面必须有 last updated、联系方式和清晰标题。
- production 不出现 `[PLACEHOLDER]`、`[待确认]` 或虚构实体信息。

---

## 11. 法律页草稿文件

本阶段生成以下 draft；它们不能直接发布，必须填完占位符并完成 P0 数据流修复：

- `docs/legal-drafts/PRIVACY-draft-en-2026-07-26.md`
- `docs/legal-drafts/TERMS-draft-en-2026-07-26.md`
- `docs/legal-drafts/COOKIES-draft-en-2026-07-26.md`
- `docs/legal-drafts/REFUND-draft-en-2026-07-26.md`
- `docs/legal-drafts/CONTACT-draft-en-2026-07-26.md`

---

## 12. 风险分级与解锁动作

### P0 — 必须先修

1. **Analytics consent**：GA4/Clarity 不能在选择前加载；当前已观察到未 consent 设置 GA Cookie。
2. **Clarity 风险**：先移除 Clarity。只有完成 consent、mask 和实际录屏 QA 后才能恢复。
3. **Privacy 一致性**：披露 GA4、Clarity、Cloudflare、Workers、Google OAuth、Creem 和 Email；不得继续绝对承诺“不上传”。
4. **儿童输入最小化**：姓名改为可选昵称/首字母，禁止 analytics/log 获取姓名、年龄、title、task、完成状态。
5. **验证期 UI 对齐**：隐藏 Google 登录、`/api/me` 自动调用、Pro 与 `$4.99/month` test checkout。
6. **Refund 对齐**：当前改为无 live purchase；删除订阅续费描述。
7. **真实支付阻断**：运营主体、地址、司法辖区、Creem 生产设置、数字内容退款和许可未冻结前不得 live。

### P1 — 文案/实现阶段完成

1. 新建 `/cookies`、`/contact` 和 Cookie Settings。
2. Privacy 加入保留期、数据权利、跨境处理和退出方式。
3. Terms 对齐 Free 与 Family Pack 的许可。
4. 验证 support 邮箱真实收发。
5. 增加 Clear local data。
6. 建立素材/IP 台账。
7. 补充 Cloudflare/analytics 的实际配置和保留期。

### P2 — 上线后持续

1. 记录并响应数据请求、删除请求和投诉。
2. 每次新增第三方、上传、AI API、云同步或儿童账户时重新做合规 Gate。
3. 每 6–12 个月复核政策；发生实质数据流变化时立即更新。
4. 监测异常下载、订单争议和素材侵权通知。

### 12.1 解锁条件

合规阶段从 `BLOCKED` 变为 `NEEDS_REVIEW`：完成全部 P0 技术/文案修复并提供浏览器证据。

从 `NEEDS_REVIEW` 变为 `DONE`：

- Owner 填完实体、地址、司法辖区和保留期；
- Cookie consent 和 Clarity mask 通过 QA；
- support 邮箱实测；
- 所有 legal routes 200 且 footer 不 404；
- 真实收费前由 Owner/专业人士复核数字产品与退款文本；
- production 没有占位符和测试订阅文案。

---

## 13. QA 合规验收点

### 13.1 无 consent 新访客

- 清空 Cookie 和 storage 后打开首页。
- 没有 `_ga`、`_clck`、`_clsk` 等 analytics identifiers。
- Network 没有 GA collect 和 Clarity recording 请求。
- 免费生成、编辑、打印正常。
- Reject 与 Accept 同等容易使用。

### 13.2 Accept analytics

- 同意后才加载 GA4。
- 只发送白名单事件/参数。
- 不发送姓名、年龄、title、tasks、email、订单 ID。
- 撤回后不再发送新 analytics 请求。

### 13.3 Clarity（如恢复）

- 使用测试姓名、chart title、敏感 chore 文本完成一整次操作。
- 实际录屏中所有输入和输出区域完全遮罩。
- legal、checkout、account 页面不录制。
- 未同意时没有 Clarity 请求或 Cookie。

### 13.4 本地数据

- Clear local data 清理所有 chart 相关 keys。
- 清理后页面显示明确结果。
- 无服务器 endpoint 收到 chart payload。
- browser console/network 无意外 chart 内容。

### 13.5 法律页

- 五个 legal/contact route 全部 200。
- canonical 正确。
- footer 链接全站可访问。
- 无占位符。
- Privacy 与实际脚本一致。
- Refund 与 checkout 商品类型一致。
- Cookie Settings 可以从 footer 重新打开。

### 13.6 支付 Pilot

- 页面与 checkout 都是 `$9.99 one-time`。
- 不出现 renewal/cancel subscription。
- 交付物、版本、下载次数、退款口径一致。
- webhook 签名、幂等、退款/争议、下载 token 通过 QA。
- 收据和支持路径真实可用。

---

## 14. 验收清单

- [x] 必须声明非法律意见：报告和法律页 draft 已声明。
- [x] 必须列第三方服务：Cloudflare、GA4、Clarity、Google OAuth、Creem、Email 均已映射。
- [x] 必须有联系方式占位：`support@chorecharteasy.com`、运营主体和地址字段已保留。
- [x] 不得承诺未实现能力：云同步、订阅、Clarity 遮罩、live payment 均未写成已上线。
- [x] 盘点主动输入、自动采集、localStorage、日志和订单数据。
- [x] 列出当前第三方服务和用途。
- [x] 识别儿童/家庭数据风险。
- [x] 给出 Cookie consent 合同。
- [x] 给出 Privacy/Terms/Cookie/Refund/Contact route contract。
- [x] 给出禁用表达和替代文案。
- [x] 给出素材/IP 合同。
- [x] 给出前端、后端和 QA 的合规验收点。
- [ ] 当前法律页与实际数据流一致。
- [ ] 第三方 analytics 已 consent-gated。
- [ ] Clarity 已移除或通过遮罩 QA。
- [ ] `/cookies` 和 `/contact` 已上线。
- [ ] 运营主体、地址、司法辖区、保留期已确认。
- [ ] 退款文本与 Creem 生产设置已确认。
- [ ] support 邮箱已实测收发。

---

# 下游交接：合规与基础法律页面摘要

## 当前结论

- 状态：`BLOCKED`
- 一句话结论：免费本地工具可走最小安全降级继续验证，但 analytics、Clarity、法律页和订阅测试 UI 必须先修，真实支付继续阻断。

## 关键输入

- 项目：ChoreChartEasy
- 当前阶段：04-compliance
- 上游资料：PRD v2、定价报告、线上 URL、本地 HTML、浏览器 Cookie/Network 证据。

## 本阶段交付物

- 合规评估：本文件。
- 法律草稿：`docs/legal-drafts/` 下 Privacy、Terms、Cookies、Refund、Contact。
- 核心判断：数据流与当前 Privacy 不一致；Clarity 是首要风险；订阅法律页与一次性产品不一致。
- 已确认：GA Cookie 在无 consent 时设置；Clarity 全站加载；输入无显式 mask；`/cookies` 404；法律页仍描述订阅。
- 待确认：运营主体、地址、司法辖区、保留期、邮箱服务商、Creem 生产退款处理、support 邮箱收发。

## 质量门槛自检

- 通过项：数据清单、第三方映射、风险分级、Route Contract、禁词、法律草稿合同、QA 合同。
- 未通过项：当前生产实现和页面尚未修复，不能进入下一阶段正式发布。

## 风险

- P0：无 consent analytics；Clarity 可能采集家庭输入；Privacy 不完整；收费/退款模型冲突。
- P1：实体信息、保留期、support 邮箱、素材台账未冻结。
- P2：后续云同步、AI、上传和儿童账户会改变风险级别。

## 给下游的最小必要信息

- 下一阶段：先建立合规修复 DAG；随后才能进入 `site-copywriting-student` 和前端实现。
- 必须读取：本报告第 3–13 节和 `docs/legal-drafts/`。
- 不能假设：当前 Privacy 准确、Clarity 已遮罩、Cookie consent 已存在、真实支付可上线、Family Pack 退款政策已确认。
- 下游不能改动：成人操作者定位、儿童数据最小化、analytics 白名单、Free 不因拒绝 analytics 受限、真实支付 Owner Review Gate。

[BLOCKED]
