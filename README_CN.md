<!--
  SEO: iptv 播放列表检查, m3u 清理, m3u8 检查, hls 检查, xmltv epg 修复,
  2026 世界杯电视指南, 世界杯转播, iptv doctor, kodi, jellyfin
-->

<div align="center">

# 🏆 IPTV Doctor — 2026 世界杯电视指南 & IPTV 播放列表检查工具

**开源 IPTV 播放列表检查器、M3U/M3U8 清理器、XMLTV EPG 修复器和 2026 FIFA 世界杯官方转播商指南。**

[![Live IPTV status](https://img.shields.io/endpoint?url=https%3A%2F%2Fxyzs996.github.io%2Fiptv-doctor%2Fstatus-badge.json)](https://xyzs996.github.io/iptv-doctor/status-index.json)
[![npm](https://img.shields.io/npm/v/iptv-doctor)](https://www.npmjs.com/package/iptv-doctor)
[![世界杯国家数](https://img.shields.io/badge/2026%20%E4%B8%96%E7%95%8C%E6%9D%AF-61%20%E4%B8%AA%E5%9B%BD%E5%AE%B6-brightgreen)](https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide.html)

[在线演示](https://xyzs996.github.io/iptv-doctor/) · [世界杯电视指南](https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide.html) · [IPTV 状态索引](https://xyzs996.github.io/iptv-doctor/status-index.html)

</div>

---

## 🌍 2026 FIFA 世界杯各国电视指南

查找每个参赛国的**官方、合法转播商和流媒体选项**的最简单方式。不存储任何流媒体 URL。

| 📊 指标 | 数值 |
|---|---:|
| 覆盖国家 | **61** |
| 官方频道 | **103** |
| 免费选项 | **67** |

快速入口：
- [🌐 所有国家](https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide.html)
- [🇺🇸 美国](https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide-us.html) · [🇨🇦 加拿大](https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide-ca.html) · [🇲🇽 墨西哥](https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide-mx.html)
- [🇬🇧 英国](https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide-gb.html) · [🇩🇪 德国](https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide-de.html) · [🇫🇷 法国](https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide-fr.html)
- [🇧🇷 巴西](https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide-br.html) · [🇦🇷 阿根廷](https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide-ar.html) · [🇯🇵 日本](https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide-jp.html)
- [🇦🇺 澳大利亚](https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide-au.html) · [🇮🇳 印度](https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide-in.html) · [🇿🇦 南非](https://xyzs996.github.io/iptv-doctor/world-cup-2026-tv-guide-za.html)

每个国家可下载：XMLTV、iCalendar、占位 M3U。

---

## 📺 IPTV 播放列表检查 & M3U 清理

IPTV Doctor 可以检查你自己的合法 M3U/M3U8 播放列表，找出失效频道，清理死链，修复 XMLTV `tvg-id` 不匹配，并生成 HTML、JSON、CSV 和 Shields 徽章报告。

```bash
npx iptv-doctor check playlist.m3u --report report.html --json report.json --csv report.csv
```

| 需求 | 命令 | 输出 |
|---|---|---|
| 检查播放列表 | `iptv-doctor check` | HTML/JSON/CSV 诊断和可选徽章 |
| 清理死链 | `iptv-doctor clean` | 新的 M3U |
| 修复 EPG ID | `iptv-doctor epg check/fix` | JSON 审计或修复后的 M3U |
| 世界杯元数据 | `iptv-doctor worldcup` | XMLTV/iCal/占位 M3U/HTML 指南 |

---

## 🚀 快速开始

```bash
pnpm install
pnpm --filter iptv-doctor doctor check playlist.m3u --report report.html --json report.json --csv report.csv
pnpm test
pnpm typecheck
pnpm build
```

---

## 📄 许可证

[MIT](LICENSE)
