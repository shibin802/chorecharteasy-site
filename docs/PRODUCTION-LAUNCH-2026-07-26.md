# ChoreChartEasy Production Launch — 2026-07-26

- 上线时间：2026-07-26 23:23 CST
- 正式域名：`https://chorecharteasy.com`
- 发布状态：`PRODUCTION_LAUNCHED / QA_PASS`
- Owner 授权：2026-07-26 明确授权 Production 上线，并选择创建独立 Production D1；Auth、Early Access、Payments 继续关闭。

## 发布事实

- PR：`https://github.com/shibin802/chorecharteasy-site/pull/1`，已 merge。
- PR merge commit：`62e7f1099195647a475d4a5d1cb8b50f091d3cb7`
- 最终 Production commit：`fb6ad171415b78bb640519863c42728c535122bc`
- GitHub Actions：`https://github.com/shibin802/chorecharteasy-site/actions/runs/30207465864`，`success`。
- Cloudflare deployment ID：`790990e5-f710-4c73-ab8a-d31f9a26a5f4`
- Cloudflare fixed deployment URL：`https://790990e5.chorecharteasy.pages.dev`
- Cloudflare branch/status：`main / success`

首次 merge 后 Cloudflare 已完成部署，但 CI 因多行 merge message 被 `wrangler-action` 误当成第二条命令而标红。已新增回归合同并修复：

- Wrangler pin：`4.80.0`
- 固定单行 deploy commit message
- `--commit-dirty=false`
- 最终 CI 和 Production redeploy 均成功

## Production 配置

- D1：`chorecharteasy-production`
- D1 UUID：`b4631eb9-dd66-4796-a5f2-66f5c3517456`
- Binding：`deployment_configs.production.DB`
- Migration：`backend/migrations/0001_initial.sql` 已成功应用
- 建库验收：7 张业务表、禁止字段 0、初始业务数据为空
- Compatibility date：`2026-04-08`
- `AUTH_ENABLED=false`
- `EARLY_ACCESS_ENABLED=false`
- `PAYMENTS_ENABLED=false`

旧 `chorecharteasy-db` 使用另一套 subscriptions schema，未复用、未修改。

## Cloudflare Edge 修复

Production QA 发现 Cloudflare 自动能力与站点 Consent/CSP 冲突：

- Web Analytics RUM 自动注入 `static.cloudflareinsights.com`
- Email Address Obfuscation 将支持邮箱改写为 `/cdn-cgi/l/email-protection`

已在 `chorecharteasy.com` 部署全站 Configuration Rule：

- Rule：`Disable unconsented analytics and email obfuscation`
- Match：所有传入请求
- Actions：禁用 RUM；关闭 Email Obfuscation
- Dashboard 状态：`Active`

修复后原生 `mailto:support@chorecharteasy.com` 恢复，浏览器默认不加载 Cloudflare RUM，未放宽 CSP。

## Production QA

### 浏览器 QA

- 9 viewports：320 / 360 / 390 / 430 / 768 / 1024 / 1280 / 1440 / 1920
- Maker 编辑、任务新增、A4 状态、localStorage、刷新恢复：PASS
- Randomizer、多孩子上限、storage unavailable、no-JS fallback：PASS
- Consent Reject / Accept / Withdraw / GPC：PASS
- Accept 后 GA cookies：2
- Withdraw 后 GA cookies：0
- 默认/拒绝/GPC 状态第三方 tracking：0

### 技术 smoke

```text
pages=12
localLinks=12
assets=7
sitemapUrls=7
failures=[]
warnings=[]
```

- 首页、法律页、404：CSP / nosniff / Referrer-Policy / HSTS 均存在
- `/api/health`：200，database=`ready`
- `/api/membership`：200，accounts/earlyAccess/payments 全为 false
- `/api/me`：200，unauthenticated/free
- `/api/early-access`：503 feature_unavailable
- `/api/auth/magic-link`：404
- `/api/logout`：204
- hostile-origin preflight：403，无 ACAO

后续 D1 数据计数复验命令被执行环境安全层拦截，未重试；建库时已验证初始为空，且 Production 所有公开写功能保持关闭。

### Lighthouse 例外

本轮不重复远端 Lighthouse。此前 Preview 远端 Lighthouse 两次被执行安全层阻断，Owner 已选择跳过；保留本地证据：

- Home mobile：98 / 100 / 100 / 100
- Home desktop：100 / 100 / 100 / 100
- Randomizer mobile：100 / 100 / 100 / 100
- CLS：0

## 仍待 Owner 闭环（不影响当前免费 Maker 运行）

- operator-neutral 法律文本、经营主体/地址/适用法律仍未做专业法律确认
- `support@chorecharteasy.com` 真实收信/回复闭环仍未验证
- starter chores 内容仍待 Owner 签字
- 视觉及真实 iPhone/Android 物理打印仍待 Owner 验收
- Auth / Early Access / Payments / Family Pack 仍是 dormant，不能对外宣传为已上线

本次 Production Launch 不代表上述事项已合规完成或已验收。
