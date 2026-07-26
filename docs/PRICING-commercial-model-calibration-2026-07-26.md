# ChoreChartEasy 定价与商业模型校准

## 1. 基本信息

- 项目：`ChoreChartEasy`
- 域名：`https://chorecharteasy.com`
- 当前阶段：`03-pricing`
- 目标市场：US / English
- 日期：2026-07-26
- 上游 PRD：`docs/PRD-product-definition-v2-lean-validation-2026-07-26.md`
- 状态：`NEEDS_REVIEW`
- 状态原因：商业模型已完成校准，但付费包内容、退款政策、固定基础设施账单和真实支付意愿尚未完成 Owner/合规验证，因此不能开放真实收费。

---

## 2. 上游输入与证据边界

### 2.1 已确认输入

- 产品核心闭环：无注册的“生成 → 编辑 → 打印”。
- 主 ICP：现在就需要 Printable chore chart 的美国英语家长。
- 当前核心生成、编辑和浏览器打印在客户端完成，不调用生成式 AI。
- Chart 数据默认保存在 localStorage。
- 当前首页展示 `$4.99/month`，但明确标记 `TEST MODE · NO REAL CHARGE`。
- 当前线上 `/pricing`、`/account` 返回 404。
- 当前仓库没有可检查的 Worker/D1 付费源码；首页只包含对外 checkout 调用代码。
- PRD 已明确：验证期不正式上线月订阅、账号和云同步。

### 2.2 当前可验证的价格证据

| 产品/替代方案 | Free | 付费价格 | 付费价值 | 证据日期 |
|---|---|---:|---|---|
| ChoreChartAI | 2 layouts、基础字体、PDF、最多 10 charts | `$5/month`；`$12/year` | 7 layouts、去 Logo、Magic Assistant、24 字体、最多 100 charts、优先支持 | 官网 pricing，2026-07-26 实扫 |
| TPT 可编辑 Printable | 因商品而异 | 常见约 `$3–$5`/份 | 可下载、可编辑视觉模板 | 项目竞品报告，2026-07-18 |
| Canva | 有免费入口 | `[待确认]` | 通用设计和模板能力 | 本轮未重新核价 |
| ChoreChartEasy 当前页 | 基础工具 | `$4.99/month` 测试展示 | 本机计划、轮换、主题、去品牌等测试权益 | 本地代码，2026-07-26 |

### 2.3 Creem 支付成本证据

Creem 官方 Pricing 页面 2026-07-26 显示：

- 交易费：`3.9% + $0.40 / transaction`
- No setup fees
- No monthly fees
- 包含全球税务处理等 Merchant of Record 能力

本报告只按公开交易费计算；退款、拒付、汇兑、提现、支持工时等如另有费用，均标为 `[待确认]`。

### 2.4 缺失信息

- `[待确认]` Cloudflare 当前实际月账单和免费额度占用。
- `[待确认]` 域名、邮箱、素材、支持工时等固定成本。
- `[待确认]` Creem 对退款、拒付、提现和特定国家/支付方式的完整费用。
- `[待确认]` Printable Pack 的最终设计数量和生产成本。
- `[待确认]` 用户对 `$4.99 / $7.99 / $9.99 / $12.99` 的真实支付意愿。
- `[待确认]` 数字下载的最终退款政策和适用地区合规表达。

---

## 3. 本阶段结论

### 3.1 一句话结论

**PRD 的“免费核心工具、一次性付费优先、订阅后置”方向正确；建议验证期取消 `$4.99/month` 主套餐，先用 `$9.99 one-time Printable Family Pack` 做付费假设，核心工具保持免费。**

### 3.2 商业模型优先级

```text
SEO / Pinterest 免费获客
→ 无注册完成一张可打印计划
→ 打印完成后展示一次性 Family Pack
→ 验证付费点击与真实购买
→ 只有出现稳定回访后才测试云同步年付
```

### 3.3 为什么不先做月订阅

1. 主用户任务是“现在打印一张表”，天然偏低频。
2. PRD 尚未证明 7–14 天回访和每周复用。
3. ChoreChartAI 已把年付降到 `$12/year`，价格锚点很低。
4. 当前没有 `/account`、云端计划库、Portal 和跨设备同步，月订阅缺少持续价值。
5. 低价月付会引入取消、退款、账单、支持和权益一致性成本，而收入很薄。

### 3.4 为什么推荐 `$9.99 one-time`

- 高于 TPT 单张 `$3–$5`，要求交付物必须是“家庭包”，不能只是单模板。
- 低于复杂家庭 App 的年付心理门槛。
- Creem 固定 `$0.40` 对 `$4.99` 订单影响较大：支付费占约 11.9%；`$9.99` 时约 7.9%。
- `$9.99` 每单扣除公开支付费后约净 `$9.20`，有空间覆盖退款、支持和素材生产。
- 一次性价格与低频 Printable 用户任务匹配，不需要虚构长期 SaaS 价值。

`$9.99` 是验证假设，不是已被市场证明的最优价格。

---

## 4. 交付物

### 4.1 商业模型阶段

#### Phase 0：需求验证期（当前）

- 核心工具全部免费。
- 不开放真实支付。
- 打印完成后展示付费概念卡，CTA 必须是 `Join early access` 或 `Notify me`，不能写 `Buy now`。
- 记录 `paid_interest_view` 和 `paid_interest_click`。
- 首页移除或隐藏当前 `$4.99/month` Pro 主定价，避免和新版 PRD 冲突。

#### Phase 1：一次性数字产品

当 Gate D 解锁后上线：

> **Printable Family Pack — $9.99 one-time**

它是数字资源包的一次性授权，不叫 Lifetime SaaS，不承诺未来所有版本、云存储或持续服务。

#### Phase 2：持续价值实验

只有 PRD Gate C 达标，才允许验证：

> **Family Cloud — annual plan，价格待验证**

年付必须有真实持续能力：云端保存、跨设备、复制上周、轮换历史、Portal 和数据导出/删除。没有这些能力，不展示订阅价格。

### 4.2 推荐套餐矩阵

| 能力 | Free Chart Maker | Printable Family Pack |
|---|---|---|
| 建议价格 | `$0` | `$9.99 one-time` |
| 适用人群 | 现在需要一张基础 chore chart 的家长 | 想要更完整视觉包、多个场景和无品牌成品的家庭 |
| 登录 | 不需要 | 首版数字下载不要求站内账号；支付身份由 Creem 处理 |
| Weekly starter | 1 套 | 4 套年龄带版本 |
| Morning starter | 1 套 | 4 套年龄带版本 |
| Blank chart | 1 套 | 6 个版式 |
| Multiple-kids | Beta 起始表 | 2/3/4 孩子各 2 个版式 |
| 主题 | Classic | 6 个打印主题 |
| 纸张 | US Letter、A4 | US Letter、A4 |
| 方向 | Portrait | Portrait + 2 个精选 Landscape 版式 |
| 导出 | 浏览器打印 / Print-to-PDF | 可下载 PDF + PNG 资源包 |
| 品牌标记 | 小型页脚品牌，不影响填写 | 无品牌成品 |
| 本地草稿 | 1 个 active draft | 仍为 1 个 active draft；不借数字包暗示云端保存 |
| 云端计划 | 0 | 0 |
| 更新权益 | 当前免费工具更新 | 仅购买时标注的 Pack Version 1.x；未来大版本不自动包含 |
| 支持 | 自助 FAQ + 邮件问题反馈 | 购买后 30 天邮件支持 |
| 下载额度 | 不适用 | 默认 10 次下载；异常情况人工核验后恢复 |

### 4.3 Family Pack 必须交付的具体内容

`$9.99` 只有在下列内容全部完成后才成立：

- 4 个年龄带：3–4、5–6、7–9、10–12。
- Weekly、Morning、Blank、Multiple-kids 四类资源。
- 至少 16 个可独立使用的核心 Printable 版式。
- 每个核心版式同时提供 US Letter 和 A4。
- PDF 和 PNG 两种格式。
- 彩色和黑白友好版本。
- 无品牌覆盖层。
- 所有任务和图标通过人工审阅与授权检查。
- 下载说明、打印说明、文件清单和版本号。

如果交付物达不到这个范围，首测价格应降为 `$4.99` 的单一主题包，而不是仍卖 `$9.99`。

### 4.4 不推荐的套餐

#### 不推荐 `$4.99/month`

- 当前持续价值不足。
- 与 ChoreChartAI `$5/month` 正面比较时，功能明显更弱。
- 用户低频，月付取消意愿高。

#### 不推荐验证期 Lifetime Pass

- “Lifetime”容易被理解为未来所有产品更新和在线服务。
- 后续若增加云存储，会形成长期负债。
- 应写成 `one-time Printable Pack`，并明确只覆盖 Pack Version 1.x。

#### 不推荐广告优先

- 当前流量太小，广告收入有限。
- 家庭教育场景需要可信和清爽的打印体验。
- 广告可能损害移动编辑与打印转化。

#### 不推荐学校/Business 套餐

- 当前没有教师管理、课堂账号、组织授权和采购流程证据。
- 如后续收到明确需求，只展示 `Contact`/waitlist，不伪装成可立即购买。

---

## 5. 成本假设表

### 5.1 单位成本

| 单位 | 当前架构的直接变量成本 | 说明 |
|---|---:|---|
| 1 次本地生成 | `$0.00` 应用侧 API/模型成本 | 客户端静态规则，无生成式 AI 调用 |
| 1 次本地编辑/保存 | `$0.00` 应用侧存储成本 | localStorage，不写 D1 |
| 1 次浏览器打印 | `$0.00` 应用侧导出成本 | 浏览器 Print-to-PDF，不生成服务器文件 |
| 1 个免费用户 | 接近静态页面流量成本 | Cloudflare 实际超额成本 `[待确认]`，不能宣称长期绝对为零 |
| 1 个 `$9.99` 订单 | `$0.79` 公开支付费 | `9.99 × 3.9% + 0.40 = 0.78961` |
| 1 个 `$9.99` 订单净额 | 约 `$9.20` | 未扣退款、拒付、支持和固定成本 |

### 5.2 各价格的支付费影响

| 售价 | Creem 公开费率估算 | 费后净额 | 支付费占售价 |
|---:|---:|---:|---:|
| `$4.99` | `$0.59` | `$4.40` | 11.9% |
| `$7.99` | `$0.71` | `$7.28` | 8.9% |
| `$9.99` | `$0.79` | `$9.20` | 7.9% |
| `$12.99` | `$0.91` | `$12.08` | 7.0% |
| `$19.00` | `$1.14` | `$17.86` | 6.0% |

### 5.3 每 1,000 个合格访问的收入情景

假设售价 `$9.99`，只扣公开支付费：

| 购买转化 | 订单 | Gross | 费后净额 |
|---:|---:|---:|---:|
| 0.5% | 5 | `$49.95` | 约 `$46.00` |
| 1.0% | 10 | `$99.90` | 约 `$92.00` |
| 2.0% | 20 | `$199.80` | 约 `$184.01` |
| 3.0% | 30 | `$299.70` | 约 `$276.01` |

这些是场景计算，不是转化预测。它说明：该项目必须依赖稳定 SEO/Pinterest 流量或更高价值产品包，不能期待少量工具流量支撑明显收入。

### 5.4 成本安全线

真实上线前需要补录：

```text
monthly_fixed_cost = domain + email + cloudflare + monitoring + design amortization
per_order_support_cost = average_support_minutes × owner_hourly_cost / 60
refund_loss = refund_rate × non_recovered_cost
net_contribution = price - payment_fee - support_cost - refund_loss - delivery_cost
```

Owner 需要给出可接受的工时成本。未补齐前，不能把 `$9.20` 费后净额等同于利润。

---

## 6. 免费与付费边界

### 6.1 Free 必须完整交付核心价值

免费用户必须能：

1. 载入适龄 starter。
2. 编辑任务。
3. 选择 Letter/A4。
4. 打印或 Print-to-PDF。
5. 刷新后恢复 1 个 active draft。

不能把打印、适龄 starter 或基本可编辑性锁在付费墙后，否则会破坏 SEO 工具意图和 PRD Gate B。

### 6.2 付费卖“成品宽度”，不卖“基本可用”

Family Pack 的付费理由：

- 更多经过设计的场景和版式。
- 多个年龄带的完整资源。
- PDF/PNG 文件包。
- 无品牌成品。
- 彩色与黑白版本。
- 多孩精选版式。

不应把以下内容当主要付费点：

- 去除遮挡性大水印。
- 用户自己的基础编辑能力。
- US Letter/A4 基础打印。
- 儿童安全建议。
- 已经存在于免费工具的基础 starter。

### 6.3 防滥用与交付限制

- 单次购买最多 10 次自动下载。
- 下载链接使用短时有效 token，不暴露永久公开资源 URL。
- Pack 标记版本，例如 `family-pack-v1`。
- 购买只覆盖家庭个人使用授权；课堂/商业再分发权限需另行定义。
- 退款、拒付后关闭后续下载权限；已下载文件无法技术回收，需要在条款中如实说明。
- 不承诺未来所有主题、云服务和大版本更新。

---

## 7. 转化路径与 CTA 合同

### 7.1 当前验证期

触发位置：用户成功进入打印预览或打印后，不在首屏阻断。

推荐文案：

```text
Want more ready-to-print options?
We're preparing a Family Pack with age-based charts, sibling layouts,
and PDF/PNG downloads.

CTA: Join early access
Microcopy: No charge today. We'll only email you about this pack.
```

行为：

- 触发 `paid_interest_view`。
- 点击触发 `paid_interest_click`。
- 若收邮箱，必须有明确用途和 Privacy/退订路径。
- 当前不得跳转真实 checkout。

### 7.2 一次性产品上线后

```text
Printable Family Pack
16+ ready-to-print family charts for ages 3–12
US Letter + A4 · PDF + PNG · Color + ink-friendly
$9.99 one-time

CTA: Get the Family Pack
Microcopy: One-time purchase for Pack Version 1.x. No subscription.
```

CTA 行为：Creem checkout；必须在页面清楚展示数字交付内容、退款边界和支持方式。

### 7.3 订阅解锁后

只有云端能力和 Gate C 通过后，才允许使用 `Start annual plan`。在那之前只能使用 `Join cloud waitlist`。

---

## 8. Gate D 修订建议

PRD 当前以“至少 20 次 paid-interest 行为”作为支付解锁条件，缺少分母，容易被流量规模误导。建议改为：

### Interest Gate

同时满足：

- 至少 200 个 `plan_ready` 用户；
- `paid_interest_click / paid_interest_view ≥ 8%`；
- 至少 20 次去重后的 `paid_interest_click`；
- 至少 5 次英语家庭可用性测试，其中至少 3 人明确认为 Pack 内容值得付费。

### Real Payment Pilot

- 首批只开放 20 个真实订单上限。
- Pilot 价格 `$9.99 one-time`。
- 检查 checkout success、下载、重复 webhook、退款、支持和发票。
- Pilot 结束后按购买率、退款率、支持工时和访谈反馈重新定价。

### Subscription Gate

除 PRD Gate C 外，再满足：

- 至少 50 个具备 4 周观察窗口的 active-draft 用户；
- 其中至少 20% 在不同周完成 2 次或以上 qualified print；
- 至少 10 名用户明确选择“跨设备/保存历史”而非只要更多模板；
- 云端、Portal、导出、删除、取消、退款和数据保留规则全部通过 QA/合规。

没有满足时，取消订阅假设，不继续建设 SaaS 账单系统。

---

## 9. 后端 Entitlement 建议

Phase 1 只需要一次性数字包权益：

```text
entitlement_id
user_or_customer_id
product_code = family_pack_v1
purchase_type = one_time
status = active | refunded | disputed | revoked
pack_major_version = 1
max_downloads = 10
download_count
support_until
creem_order_id
created_at
updated_at
```

约束：

- 支付成功只能由服务端验证后的 Creem webhook 授权。
- webhook 必须处理签名失败、重复、乱序和重试。
- 前端 success URL 不能直接授予权益。
- 日志不记录儿童姓名、任务文本或完整 chart。
- 下载 token 短时有效且单次使用。
- 同一 order 重放不能重复创建权益。
- 退款/争议事件更新 status，并停止新下载。

当前 PRD 不要求建立完整站内 `/account`。如果用户需要恢复下载，可先使用 Creem 订单身份 + 支持流程；正式实现方式必须在后端设计阶段冻结，不能由前端猜测。

---

## 10. QA 与合规验证点

### 10.1 价格与权益一致性

- 页面、schema、checkout、Creem product 和收据价格一致。
- 页面明确 `one-time`，不出现月付暗示。
- Pack Version、文件数量、格式、纸张和主题与实际交付一致。
- Free 核心打印能力未被意外锁住。

### 10.2 支付状态

- checkout 成功。
- checkout 取消。
- checkout 超时。
- webhook 签名错误。
- webhook 重复和乱序。
- 支付成功但下载生成失败。
- 退款、争议和权益撤销。
- 达到下载次数后的可理解提示。

### 10.3 合规

- 数字产品退款政策由合规 Skill 审核。
- 明确个人家庭使用许可和禁止再分发范围。
- Creem 税务处理能力与页面表达一致，不做超出官方说明的承诺。
- 收集 early-access 邮箱前明确用途、隐私和退订。
- 真实支付前必须 Owner Review。

---

## 11. 对 PRD v2 的修订建议

### P0 必须改

1. Gate D 增加分母和 Pilot 上限，使用本报告第 8 节。
2. 明确 Phase 1 产品为 `$9.99 one-time Printable Family Pack`，不是订阅。
3. 当前首页 `$4.99/month` 测试卡在新版实现时移除或隐藏。
4. `paid_interest_click` 前增加 `paid_interest_view`，才能计算兴趣转化率。
5. Free 明确保留基础 Letter/A4、Print-to-PDF 和 1 个 active draft。

### P1 建议改

1. 将“图片图标模式”拆分：基础低龄可读性进入 Free；完整图标主题包进入 Family Pack。
2. 将“无水印”改成“免费版小型页脚品牌 / 付费版无品牌”，禁止遮挡性背景水印。
3. 增加 Pack Version、更新边界和个人使用授权。
4. 订阅不预设月价；通过持续价值 Gate 后另开一次定价校准。

### 不需要改

- 主 ICP 选择正确。
- 免费核心打印闭环正确。
- 订阅、账号和云同步后置正确。
- Weekly Qualified Prints 北极星正确。
- 不批量扩 SEO 页面正确。

---

## 12. 验收清单

- [x] 有当前竞品定价锚点。
- [x] 有 Creem 官方支付费依据。
- [x] 有免费用户和付费订单单位成本。
- [x] 有按 1,000 合格访问计算的收入情景。
- [x] Free 能完整体验核心价值。
- [x] 付费包有明确内容和额度上限。
- [x] 下载次数、支持期限和版本更新范围明确。
- [x] CTA 与当前真实开通状态一致。
- [x] 未把 waitlist 写成在线购买。
- [x] 未将一次性资源包包装成长期 SaaS 权益。
- [x] 真实支付保留 Owner、合规、支付和 QA Gate。
- [ ] 固定成本和支持工时待 Owner 补录。
- [ ] 退款政策待合规阶段冻结。
- [ ] `$9.99` 待真实兴趣与支付 Pilot 验证。

---

# 下游交接：定价与商业模型校准摘要

## 当前结论

- 状态：`NEEDS_REVIEW`
- 一句话结论：保留免费核心工具，先验证 `$9.99 one-time Printable Family Pack`；月订阅和云同步继续后置。

## 关键输入

- 项目：ChoreChartEasy
- 当前阶段：03-pricing
- 上游资料：PRD v2、竞品报告、ChoreChartAI 当前定价、Creem 当前公开费率、本地测试定价代码。

## 本阶段交付物

- 文件：`docs/PRICING-commercial-model-calibration-2026-07-26.md`
- 核心判断：当前 `$4.99/month` 与产品成熟度不匹配；`$9.99 one-time` 更符合低频 Printable 场景。
- 已确认项：核心变量成本低；Creem 公开费率为 3.9% + $0.40；ChoreChartAI 当前为 $5/月或 $12/年。
- 待确认项：固定成本、支持工时、退款规则、Pack 最终内容、真实支付意愿。

## 质量门槛自检

- 通过项：竞品、单位经济、套餐矩阵、额度、CTA、entitlement、QA 合同均已给出。
- 未通过项：真实支付上线所需的成本补录、合规和 Owner Review。

## 风险

- P0：在无持续价值时上线月订阅；Pack 内容不足却定价 `$9.99`；真实 checkout 与测试文案不一致。
- P1：数字下载被分享；支持工时侵蚀低客单利润；退款政策不清。
- P2：竞品继续降价；用户只使用免费工具。

## 给下游的最小必要信息

- 下一阶段：`student-site-compliance-pipeline`，然后 `site-copywriting-student`。
- 必须读取：本报告第 4、5、6、7、8、9、10 节。
- 不能假设：真实支付已解锁、`$9.99` 已验证、订阅成立、未来大版本包含在一次性购买中。
- 下游不能改动：Free 核心闭环、one-time 表达、Pack 上限和 Owner Review Gate；修改需退回定价阶段。

[NEEDS_REVIEW]
