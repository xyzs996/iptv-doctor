# IPTV Star 项目方案 v2：Star 最大化版

日期：2026-06-19  
状态：审核后修订稿  
目标：让 GitHub star 最大化，而不是平均做 6 个小项目  

## 1. 核心结论

原方案方向正确，但发布策略错误。

原方案把 `match2epg`、`worldcup-tv-guide`、`iptv-doctor`、`spoiler-free-iptv`、`wc26-mcp-tv`、`public-sports-tv-index` 拆成 6 个可独立发布项目。这适合长期产品矩阵，不适合短期 GitHub star 最大化。

修订后的策略是：

```txt
只推一个旗舰仓库：iptv-doctor
其他 5 个项目全部变成 iptv-doctor 的子命令、示例、页面和增长入口。
```

旗舰定位：

```txt
iptv-doctor
The IPTV playlist doctor: check, clean, fix EPG, generate reports, and publish health badges.
```

中文定位：

```txt
IPTV 播放列表医生：检测 M3U/HLS、清洗可用源、修复 EPG、生成报告、发布健康徽章。
```

## 2. 为什么必须改

### 2.1 Star 是注意力聚合，不是功能数量

GitHub 用户通常不会给一组相关小仓库分别 star。他们会 star 那个最清楚、最实用、最像“主项目”的仓库。

所以 6 仓库并行的问题是：

- 每个仓库 README 都要单独打磨。
- 每个仓库都要单独积累 issue、release、topic、demo。
- 用户不知道应该 star 哪一个。
- 外部传播链接被稀释。
- 搜索权重被拆散。

Star 最大化的打法应该是：

- 一个主仓库承接所有关注。
- 一个 README 讲清楚全部价值。
- 一个 GitHub topic 组合覆盖所有关键词。
- 一个 release 页面提供全部产物。
- 一个 demo 站点展示所有能力。

### 2.2 World Cup 是流量事件，不是主产品

世界杯可以带来短期搜索，但它不是长期刚需。世界杯结束后，`worldcup-tv-guide` 的增长会快速衰减。

IPTV playlist checker、M3U cleaner、EPG fixer 才是长期需求。

因此主仓库不应该叫 `worldcup-tv-guide`，也不应该把世界杯电视指南作为产品中心。世界杯应该变成一个 campaign：

```txt
World Cup 2026 IPTV Pack
```

它服务于主仓库增长：

- 吸引世界杯搜索流量。
- 展示 EPG 和 M3U placeholder 能力。
- 让用户顺手发现 `iptv-doctor check/clean/report/badge`。

### 2.3 `iptv-doctor` 是最高上限项目

`iptv-doctor` 同时覆盖长期刚需和世界杯热点。

长期关键词：

- `iptv checker`
- `m3u checker`
- `m3u8 checker`
- `hls checker`
- `xmltv checker`
- `epg fixer`
- `iptv playlist cleaner`
- `iptv github action`

世界杯关键词：

- `world cup 2026 iptv`
- `world cup 2026 epg`
- `world cup 2026 xmltv`
- `world cup m3u`

这两个流量池可以放进一个仓库，而不是拆散。

## 3. 新产品结构

### 3.1 对外只讲一个项目

```txt
iptv-doctor
```

它包含 7 个能力：

```txt
iptv-doctor check      检测 M3U/HLS
iptv-doctor clean      输出可用 playlist
iptv-doctor report     生成 HTML/JSON/CSV 报告
iptv-doctor badge      生成 GitHub 健康徽章
iptv-doctor epg        生成和修复 XMLTV
iptv-doctor worldcup   生成 World Cup 2026 IPTV Pack
iptv-doctor mcp        启动 MCP server
```

### 3.2 原 6 个项目的新归属

| 原项目 | 新定位 | 是否独立发布 | 原因 |
|---|---|---:|---|
| `iptv-doctor` | 旗舰仓库和主 CLI | 是 | 最大 star 上限，长期刚需 |
| `match2epg` | `iptv-doctor epg/worldcup` 的内部包 | 否 | 作为能力更强，单独发布会稀释 |
| `worldcup-tv-guide` | GitHub Pages demo 和 campaign page | 否 | 用来拉流量，不承接 star |
| `wc26-mcp-tv` | `iptv-doctor mcp` 子命令 | 否 | MCP 是加分项，不是主线 |
| `public-sports-tv-index` | `data/public-sports-tv-index.json` 和 demo 表格 | 暂缓 | 审核成本高，先不做主入口 |
| `spoiler-free-iptv` | example/demo | 暂缓 | 有传播性，但不解决 IPTV 核心痛点 |

## 4. 对外 README 叙事

README 首屏必须在 10 秒内让用户知道三件事：

1. 它能解决我的 IPTV playlist 问题。
2. 它不会给我盗版源，不容易消失。
3. 我马上能复制命令跑起来。

建议首屏：

```md
# IPTV Doctor

Check, clean, and repair IPTV playlists.

- Detect broken M3U/HLS channels
- Generate visual HTML reports
- Clean dead streams into a fresh M3U
- Fix XMLTV/EPG mismatches
- Publish GitHub Actions health badges
- Generate a legal World Cup 2026 IPTV pack

No pirated streams. No paid channel lists. Bring your own legal playlist.
```

首屏命令：

```bash
npx iptv-doctor check playlist.m3u --report report.html
npx iptv-doctor clean playlist.m3u --out clean.m3u
npx iptv-doctor worldcup --country US --format xmltv --out worldcup.xml
```

首屏截图：

```txt
┌─────────────────────────────────────────────────────────┐
│ IPTV Doctor Report                                      │
├──────────┬────────┬──────────┬─────────────┬───────────┤
│ Channel  │ Status │ First KB │ Resolution  │ Error     │
├──────────┼────────┼──────────┼─────────────┼───────────┤
│ FOX      │ OK     │ 430ms    │ 1080p       │           │
│ FS1      │ WARN   │ 2.8s     │ 720p        │ Slow HLS  │
│ Demo 3   │ FAIL   │          │             │ DNS       │
└──────────┴────────┴──────────┴─────────────┴───────────┘
```

## 5. Star 最大化功能优先级

### P0：必须先做

这些功能直接决定用户是否 star。

1. **真实 HLS/M3U 检测**

   不能只做 inventory。必须能检测：

   - HTTP status。
   - DNS/TLS 错误。
   - HLS manifest 是否可读。
   - segment 是否可读。
   - 首字节时间。
   - content type。
   - playlist item 数量。

2. **HTML 可视化报告**

   用户 star 的很多时候是被截图打动。报告必须可截图、可分享、可放 README。

   报告字段：

   - channel name。
   - tvg-id。
   - group-title。
   - status：OK/WARN/FAIL。
   - latency。
   - error class。
   - URL host。
   - checkedAt。

3. **清洗输出**

   命令：

   ```bash
   iptv-doctor clean playlist.m3u --out clean.m3u
   ```

   这是从“报告工具”变成“解决问题工具”的关键。

4. **GitHub Actions 模板**

   仓库维护者需要直接复制。

   ```yaml
   name: IPTV Health
   on:
     schedule:
       - cron: "0 */6 * * *"
     workflow_dispatch:
   jobs:
     check:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: iptv-doctor/action@v1
           with:
             playlist: playlist.m3u
             report: report.html
   ```

5. **World Cup 2026 IPTV Pack**

   作为 release artifact：

   ```txt
   worldcup-2026-us.xmltv
   worldcup-2026-us.ics
   worldcup-2026-us-placeholder.m3u
   worldcup-2026-guide.html
   ```

   注意：M3U 仍然只放 placeholder URL。

### P1：强增长功能

这些功能能显著提高传播和复用。

1. **Health badge**

   ```md
   ![IPTV health](https://img.shields.io/endpoint?url=...)
   ```

   状态：

   - `98% online`
   - `12 failed`
   - `last checked 14m ago`

2. **EPG mismatch fixer**

   检查 M3U 的 `tvg-id` 是否匹配 XMLTV channel id。

   命令：

   ```bash
   iptv-doctor epg check playlist.m3u guide.xml
   iptv-doctor epg fix playlist.m3u guide.xml --out fixed.m3u
   ```

3. **JSON/CSV 输出**

   方便用户接到其他系统。

4. **Docker 镜像**

   ```bash
   docker run --rm -v "$PWD:/work" ghcr.io/iptv-doctor/iptv-doctor check /work/playlist.m3u
   ```

5. **在线 demo**

   GitHub Pages 页面需要支持：

   - 上传本地 M3U。
   - 只在浏览器解析，不上传服务器。
   - 展示 report preview。
   - 提供 World Cup pack 下载。

### P2：暂缓

这些不是第一波 star 的关键。

- 登录系统。
- SaaS 后台。
- 支付系统。
- 完整公开体育频道数据库。
- 防剧透独立应用。
- GPU 视频处理。
- 多租户云监控。

## 6. 修订后的架构

### 6.1 当前 monorepo 保留

当前代码结构可以保留，但对外叙事改变。

```txt
apps/
  worldcup-tv-guide/          demo page
  iptv-doctor/                flagship CLI
  spoiler-free-iptv/          example
  wc26-mcp-tv/                future subcommand
  public-sports-tv-index/     future demo

packages/
  sports-data/                shared data
  match2epg/                  EPG generation engine
  iptv-core/                  parser and report core
```

### 6.2 目标架构

```txt
                        ┌──────────────────────┐
                        │      README/demo      │
                        │  screenshots, badges  │
                        └──────────┬───────────┘
                                   │
┌──────────────────────────────────▼──────────────────────────────────┐
│                           iptv-doctor CLI                           │
│ check | clean | report | badge | epg | worldcup | mcp               │
└───────────────┬───────────────────────┬────────────────────────────┘
                │                       │
┌───────────────▼──────────────┐ ┌──────▼─────────────────────────────┐
│ iptv-core                     │ │ match2epg + sports-data            │
│ M3U parser                    │ │ fixture data                       │
│ HLS probe                     │ │ XMLTV/iCal/M3U generation          │
│ diagnostics model             │ │ World Cup pack                     │
│ HTML/JSON/CSV reports         │ │ legal viewing metadata             │
└───────────────────────────────┘ └────────────────────────────────────┘
```

### 6.3 数据流

#### Playlist 检测

```txt
playlist.m3u
  │
  ▼
parseM3U
  │
  ├─ empty file       -> named error: EmptyPlaylistError
  ├─ invalid EXTINF   -> warning row, continue
  └─ channels[]
       │
       ▼
probeHLS / probeHTTP
       │
       ├─ DNS error       -> FAIL_DNS
       ├─ TLS error       -> FAIL_TLS
       ├─ HTTP 4xx/5xx    -> FAIL_HTTP
       ├─ manifest error  -> FAIL_MANIFEST
       ├─ slow response   -> WARN_SLOW
       └─ OK              -> OK
       │
       ▼
diagnostics[]
       │
       ├─ report.html
       ├─ report.json
       ├─ report.csv
       └─ clean.m3u
```

#### World Cup pack

```txt
worldcup fixtures + broadcaster metadata
  │
  ├─ generateXMLTV      -> worldcup-2026-us.xmltv
  ├─ generateICalendar  -> worldcup-2026.ics
  ├─ generateM3U        -> worldcup-placeholder.m3u
  └─ renderGuide        -> worldcup-guide.html
```

## 7. 仓库发布策略

### 7.1 不拆 6 个仓库

第一阶段只发布一个仓库：

```txt
iptv-doctor/iptv-doctor
```

或者如果你想保留当前名字：

```txt
iptv-star/iptv-doctor
```

不建议第一阶段发布：

```txt
match2epg
worldcup-tv-guide
spoiler-free-iptv
wc26-mcp-tv
public-sports-tv-index
```

这些会稀释关注。

### 7.2 Release artifacts

每次 release 自动生成：

```txt
iptv-doctor-linux-x64
iptv-doctor-macos-arm64
iptv-doctor-windows-x64.cmd
worldcup-2026-us.xmltv
worldcup-2026-us.ics
worldcup-2026-us-placeholder.m3u
sample-report.html
sample-report.json
sample-clean.m3u
```

第一版平台入口是调用 `npx iptv-doctor` 的轻量 launcher，不冒充 native binary。后续如果 release 下载量证明有必要，再引入原生单文件打包。

### 7.3 GitHub topics

主仓库 topics：

```txt
iptv
m3u
m3u8
hls
xmltv
epg
playlist
checker
world-cup-2026
jellyfin
kodi
plex
vlc
self-hosted
github-actions
```

## 8. README 信息架构

### 8.1 首屏

首屏必须包含：

- 一句话价值主张。
- 报告截图。
- 三条命令。
- 合规声明。
- World Cup 2026 pack 下载入口。

### 8.2 第二屏

第二屏展示功能矩阵：

| Need | Command | Output |
|---|---|---|
| Check playlist | `iptv-doctor check` | HTML/JSON report |
| Remove dead streams | `iptv-doctor clean` | clean M3U |
| Fix EPG | `iptv-doctor epg fix` | fixed M3U |
| Publish health badge | GitHub Action | badge JSON |
| World Cup pack | `iptv-doctor worldcup` | XMLTV/iCal/M3U |

### 8.3 第三屏

展示真实报告截图和样例输出。

不要只写功能点。GitHub star 很依赖视觉证据。

### 8.4 合规声明

合规声明不要放得太靠后。首屏就要写：

```txt
IPTV Doctor does not provide streams, paid channel lists, Xtream credentials,
Stalker portals, MAC lists, or DRM bypass tools. It checks playlists you own or
are legally allowed to use.
```

## 9. 合规工程化

原方案只有声明，不够。现在必须加工程约束。

### 9.1 仓库级拒收规则

贡献中禁止：

- 直播源 URL 列表。
- Xtream credentials。
- Stalker portal。
- MAC portal。
- Softcam keys。
- DRM bypass。
- 付费频道非授权播放地址。
- 含 token 的 m3u8 URL。

### 9.2 CI 合规扫描

新增脚本：

```bash
pnpm compliance:scan
```

扫描：

- `.m3u8` URL。
- `get.php?username=...&password=...`。
- `stalker_portal`。
- `mac=`。
- `softcam`。
- 疑似密钥。
- `#EXTINF` 后跟真实 HTTP stream URL 的大批量列表。

命中后 CI 失败。

### 9.3 Issue 模板

Issue 模板必须写：

```txt
Do not paste private playlist URLs, credentials, paid channel links, or tokens.
Use redacted examples.
```

## 10. Star 增长打法

### 10.1 第一波发布

发布标题：

```txt
IPTV Doctor: check, clean, and repair M3U/HLS playlists
```

发布副标题：

```txt
Includes a legal World Cup 2026 XMLTV/iCal/M3U metadata pack.
```

首发渠道：

- GitHub topics。
- Hacker News Show HN。
- Reddit：`r/selfhosted`、`r/IPTV`、`r/jellyfin`、`r/kodi`。
- V2EX。
- X/Twitter。
- 掘金。

### 10.2 内容顺序

先写和主仓库最强相关的文章：

1. How to check an IPTV M3U playlist with GitHub Actions
2. How to clean dead channels from an M3U playlist
3. How to fix XMLTV EPG IDs in an IPTV playlist
4. How to add World Cup 2026 fixtures to IPTVnator
5. How to generate a shareable IPTV health report

原方案的防剧透和公开频道索引文章暂缓。

### 10.3 量化目标

首周目标：

- GitHub stars：300。
- Release downloads：500。
- Demo visits：2,000。
- README star conversion：2% 以上。

首月目标：

- GitHub stars：1,500。
- Release downloads：5,000。
- 外部链接：20。
- 至少 5 个其他仓库引用 GitHub Action 或 badge。

触发调整：

- Show HN 后 24 小时低于 100 stars：重写 README 首屏和截图。
- Demo 访问高但 star 少：把 star CTA 放到 demo 顶部。
- 下载高但 issue 少：补贡献入口和 roadmap。
- Star 多但 release 下载少：说明定位吸引人但工具不够易用，优先修安装体验。

## 11. MVP 到可发布版本的差距

2026-06-20 实施审计：

已补齐的 Phase 1/P1 本地能力：

- pnpm workspace。
- `parseM3U`。
- 真实 HLS/M3U 网络检测。
- HLS media segment 抽检。
- HTML/JSON/CSV diagnostics report。
- 清洗输出 `clean.m3u`。
- EPG `tvg-id` check/fix。
- Health badge JSON。
- XMLTV/iCal/M3U placeholder/HTML guide 生成器。
- World Cup 样例数据，包含 `scheduled`/`unknown` 状态字段，并保留 `live`/`finished`/`postponed` 类型扩展。
- GitHub Pages demo 的浏览器本地 M3U 解析。
- GitHub Pages demo 部署 workflow。
- `iptv-doctor mcp` stdio MCP server。
- release artifact 自动生成脚本和 release 上传 workflow。
- 5 篇首发 how-to 文档。
- `iptv-doctor report` 可从已保存 JSON diagnostics 重新生成 HTML/CSV/badge。
- 外部发布 runbook 和环境预检脚本。
- `.gitignore`、license、CI、release workflow、Dockerfile、composite GitHub Action、issue template。
- 合规扫描。
- 测试、类型检查、构建、npm pack 本地验证。

仍未声明完成的外部发布项：

1. GitHub Action 还没有在公开仓库以 `iptv-doctor/action@v1` 发布。
2. Docker image 还没有推送到 GHCR/Docker Hub。
3. npm package 还没有发布到 npm registry。
4. Health badge JSON 还没有托管为公开静态 endpoint。
5. World Cup 数据仍是本地样例数据，不是实时官方赛程/比分数据源。

## 12. Phase 1：旗舰仓库发布，建议 2-4 天

目标：把当前 MVP 变成可以公开传播的 `iptv-doctor`。

### 12.1 工程清理

- 初始化 git 仓库。
- 增加 `.gitignore`。
- 清理 `*.tsbuildinfo`。
- 增加 `LICENSE`。
- 增加 GitHub Actions：test/typecheck/build。
- 增加 release workflow。

### 12.2 CLI 重构

把 CLI 改成：

```bash
iptv-doctor check <playlist.m3u> --report report.html --json report.json
iptv-doctor clean <playlist.m3u> --out clean.m3u
iptv-doctor epg check <playlist.m3u> <guide.xml>
iptv-doctor worldcup --country US --format xmltv --out worldcup.xml
```

### 12.3 Probe engine

新增核心类型：

```ts
type DiagnosticStatus = "ok" | "warn" | "fail";

type DiagnosticCode =
  | "OK"
  | "WARN_SLOW"
  | "FAIL_DNS"
  | "FAIL_TLS"
  | "FAIL_HTTP"
  | "FAIL_MANIFEST"
  | "FAIL_TIMEOUT"
  | "FAIL_UNSUPPORTED";
```

默认配置：

```txt
timeout: 8000ms
concurrency: 16
slowThreshold: 2500ms
sampleSegments: 1
```

### 12.4 Report UI

报告必须有：

- 总体健康分。
- OK/WARN/FAIL 数量。
- 最慢 10 个频道。
- 错误类型分布。
- 分组统计。
- 明细表。
- 可复制命令。
- 合规声明。

### 12.5 World Cup pack

需要输出：

- `worldcup-2026-us.xmltv`
- `worldcup-2026-us.ics`
- `worldcup-2026-us-placeholder.m3u`
- `worldcup-2026-guide.html`

数据状态必须包含：

- `scheduled`
- `live`
- `finished`
- `postponed`
- `unknown`

不要只做静态赛程。

## 13. Phase 2：增长增强，建议 3-5 天

目标：让仓库更容易被其他仓库引用。

任务：

- 发布 GitHub Action。
- 发布 Docker 镜像。
- 发布 npm package。
- 将 health badge JSON 发布为静态 endpoint。
- 接入权威 World Cup 数据更新源。
- 增加 5 篇 how-to。

验收：

- 别人可以复制 workflow 直接用。
- README 有 3 个动图或截图。
- demo 能在浏览器本地解析 M3U。
- release artifacts 自动生成。

## 14. Phase 3：拆分生态，世界杯后再考虑

只有当主仓库达到以下条件，才拆独立项目：

- 主仓库超过 1,500 stars。
- `worldcup` 子命令下载量稳定。
- `epg` 子命令有独立 issue 需求。
- 有用户明确要求单独使用库。

可拆顺序：

1. `match2epg`，作为 npm library。
2. `public-sports-tv-index`，作为数据仓库。
3. `wc26-mcp-tv`，作为 MCP package。

不建议拆：

- `spoiler-free-iptv`，除非它出现独立传播。

## 15. 每个原项目的 Star 最大化结论

### `iptv-doctor`

结论：主项目，押注最大。

必须做到：

- 真检测。
- 可视化报告。
- clean 输出。
- GitHub Action。
- World Cup pack。

### `match2epg`

结论：不独立冲 star，先做子能力。

原因：

- 单独项目关键词窄。
- 作为 `iptv-doctor worldcup/epg` 更容易被用户发现。
- 后续可拆 npm library。

### `worldcup-tv-guide`

结论：做 landing page，不做主仓库。

原因：

- 世界杯流量短。
- 页面适合转化到 `iptv-doctor`。
- 赛后增长衰减。

### `wc26-mcp-tv`

结论：降级为 `iptv-doctor mcp`。

原因：

- MCP 单独项目竞争已经存在。
- 3 个工具不足以独立吸 star。
- 放进主仓库可以增加技术新鲜感。

### `public-sports-tv-index`

结论：暂缓独立发布。

原因：

- 审核成本高。
- 容易吸引低质量源贡献。
- 当前不直接提升主仓库 star。

### `spoiler-free-iptv`

结论：保留为 demo。

原因：

- 有创意，但不解决 IPTV 核心刚需。
- 可以作为 README 的“fun example”，不应占发布主线。

## 16. 风险与修正

| 风险 | 当前方案问题 | 修正 |
|---|---|---|
| Star 被稀释 | 6 仓库拆散传播 | 只推 `iptv-doctor` 一个旗舰仓库 |
| 世界杯过期 | 静态赛程不够 | 增加状态、结果、更新时间 |
| 工具不够硬 | 只有解析和报告 | 增加真实 HLS probe 和 clean 输出 |
| 合规只靠声明 | 开放贡献后容易变脏 | 增加 CI 合规扫描 |
| README 不够抓人 | 功能矩阵太平均 | 首屏放截图、命令、badge、World Cup pack |
| MCP 吸力不足 | 只有 3 个工具 | 并入主项目作为子命令 |
| 数据维护压力 | 公开频道索引审核重 | 暂缓独立发布 |

## 17. 审核决策点

现在需要确认的不是“要不要做 6 个项目”，而是下面 5 个决策：

1. **是否接受 `iptv-doctor` 做唯一旗舰仓库。**
2. **是否暂缓拆分 6 个独立仓库。**
3. **是否把 World Cup 改成 campaign，而不是主产品。**
4. **是否 Phase 1 优先做真实检测、清洗输出、报告截图和 GitHub Action。**
5. **是否把 MCP、公开体育频道索引、防剧透功能降级为附属能力。**

我的建议：

- 1：接受。
- 2：接受。
- 3：接受。
- 4：接受。
- 5：接受。

这是 star 最大化的正确取舍。

## 18. 新验收标准

Phase 1 结束时必须满足：

- `pnpm test` 通过。
- `pnpm typecheck` 通过。
- `pnpm build` 通过。
- `iptv-doctor check` 能检测真实 M3U。
- `iptv-doctor clean` 能输出 clean M3U。
- `iptv-doctor report` 能生成可截图 HTML。
- `iptv-doctor worldcup` 能生成 XMLTV/iCal/M3U placeholder。
- README 首屏有截图、命令、合规声明。
- GitHub Action 示例可复制。
- CI 能拒绝明显违规源提交。

## 19. 最终建议

执行顺序改为：

```txt
1. 把当前项目包装成 iptv-doctor 旗舰仓库
2. 做真实 HLS/M3U 检测
3. 做 clean 输出和 HTML 报告
4. 做 GitHub Action 和 badge
5. 做 World Cup 2026 campaign pack
6. 发布 GitHub Pages demo
7. 根据 star 和 issue 决定是否拆分子项目
```

不要第一波就追求“每个项目都完整”。这会让每个项目都不够尖。

要让 star 最大化，必须让用户看到一个明确、强力、可马上使用的项目：

```txt
IPTV Doctor: check, clean, repair, and report IPTV playlists.
```

其他所有东西都应该服务这个主叙事。
