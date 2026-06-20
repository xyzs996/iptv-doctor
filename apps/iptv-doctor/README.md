# IPTV Doctor CLI - IPTV Playlist Checker and M3U Cleaner

Flagship CLI for checking, cleaning, and reporting IPTV M3U, M3U8, HLS, and XMLTV playlist health. The published `iptv-doctor` package is designed for local playlist diagnostics, GitHub Actions health checks, XMLTV EPG repair, and World Cup 2026 metadata exports.

## Run

Published package:

```bash
npx iptv-doctor check playlist.m3u --report report.html --json report.json --csv report.csv
npx iptv-doctor report report.json --html report.html --csv report.csv --badge badge.json
npx iptv-doctor clean playlist.m3u --out clean.m3u
npx iptv-doctor epg check playlist.m3u guide.xml --json epg.json
npx iptv-doctor epg fix playlist.m3u guide.xml --out fixed.m3u
npx iptv-doctor badge report.json --out badge.json
npx iptv-doctor mcp --list-tools
npx iptv-doctor worldcup --country US --format xmltv --out worldcup.xml
npx iptv-doctor worldcup --country US --format html --out worldcup-guide.html
```

Source checkout:

```bash
pnpm --filter iptv-doctor doctor check playlist.m3u --report report.html --json report.json --csv report.csv
```

`check` can also write `--badge badge.json` directly for Shields endpoint usage.
`mcp` starts a stdio MCP server; `--list-tools` prints the bundled tool names for verification.

IPTV Doctor does not provide streams, paid channel lists, Xtream credentials, Stalker portals, MAC lists, or DRM bypass tools.
