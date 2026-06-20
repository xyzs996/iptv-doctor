# IPTV Doctor Acceptance Criteria

Status: active implementation checklist  
Source: `docs/project-proposal.md` v2  

## Phase 1 Release Gate

The project is not ready for public star-focused release until all required items below are true.

### Core CLI

- [x] `iptv-doctor check <playlist.m3u> --report report.html --json report.json` parses M3U, probes channels, writes HTML and JSON reports, and exits non-zero only for invalid command usage or unreadable input.
- [x] `iptv-doctor clean <playlist.m3u> --out clean.m3u` writes a clean M3U containing only channels with `ok` or `warn` diagnostics.
- [x] `iptv-doctor epg check <playlist.m3u> <guide.xml> --json epg.json` reports matched and missing XMLTV IDs with suggestions.
- [x] `iptv-doctor epg fix <playlist.m3u> <guide.xml> --out fixed.m3u` writes a fixed M3U using XMLTV display-name suggestions.
- [x] `iptv-doctor report <report.json> --html report.html --csv report.csv --badge badge.json` renders saved diagnostics into shareable assets.
- [x] `iptv-doctor badge <report.json> --out badge.json` renders Shields-compatible endpoint JSON from a diagnostics report.
- [x] `iptv-doctor mcp` starts the bundled stdio MCP server, and `iptv-doctor mcp --list-tools` lists bundled tools.
- [x] `iptv-doctor --help` prints usage and exits successfully, including as the Docker default command.
- [x] `iptv-doctor worldcup --country US --format xmltv --out worldcup.xml` writes World Cup XMLTV metadata.
- [x] `iptv-doctor worldcup --country US --format ics --out worldcup.ics` writes iCalendar metadata.
- [x] `iptv-doctor worldcup --country US --format m3u --out worldcup.m3u` writes placeholder M3U metadata and does not include real stream URLs.
- [x] `iptv-doctor worldcup --country US --format html --out worldcup-guide.html` writes a shareable World Cup guide page.
- [x] World Cup fixture metadata includes explicit status values from `scheduled`, `live`, `finished`, `postponed`, and `unknown`.

### Playlist Parsing

- [x] Parser exposes a structured `EmptyPlaylistError` issue for empty M3U input.
- [x] Parser exposes a structured `InvalidExtinfWarning` issue for malformed `#EXTINF` rows and continues parsing subsequent channels.

### Diagnostics

- [x] HLS/M3U probing reports status as `ok`, `warn`, or `fail`.
- [x] Diagnostics include `code`, `latencyMs`, `httpStatus`, `contentType`, `playlistItems`, `sampledSegments`, `checkedAt`, and `urlHost`.
- [x] HLS probing samples media segments using the documented `sampleSegments` setting.
- [x] DNS, TLS/network, HTTP, manifest, timeout, unsupported protocol, and slow response cases map to named diagnostic codes.
- [x] Default probe settings are timeout `8000ms`, concurrency `16`, slow threshold `2500ms`, and sample segments `1`.

### Reports

- [x] HTML report includes total health score, OK/WARN/FAIL counts, error distribution, slowest channels, group summary, detail rows, and compliance notice.
- [x] HTML report includes copyable follow-up commands for rendering assets, cleaning playlists, and badge generation.
- [x] HTML report detail rows include `checkedAt`.
- [x] JSON report includes summary and all diagnostics.
- [x] CSV report can be generated from the same diagnostics model, including sampled segment count.
- [x] Health badge JSON can be generated during `check` or from an existing JSON report.
- [x] Health badge JSON message includes online percentage, failed count, and relative last checked age.

### Compliance

- [x] `pnpm compliance:scan` scans repository text files and fails on obvious stream lists, Xtream credentials, Stalker portal markers, MAC portal markers, softcam keys, and secret-looking playlist URLs.
- [x] Test fixtures and docs examples can use redacted or `example.*` placeholders without failing compliance.
- [x] Issue template warns contributors not to paste private playlist URLs, credentials, paid channel links, or tokens.

### Release Packaging

- [x] README presents `iptv-doctor` as the flagship project.
- [x] README includes a report preview block, quick-start commands, and compliance statement in the first screen.
- [x] GitHub Actions template exists for playlist health checking.
- [x] GitHub Pages workflow builds and deploys the browser-local demo.
- [x] Composite `action.yml` exists for repository-local playlist checks.
- [x] Dockerfile exists for local image builds.
- [x] Publish workflow exists for npm and GHCR when repository secrets/tags are configured.
- [x] Release artifact generator creates World Cup XMLTV/iCal/placeholder M3U/HTML guide plus sample report and clean M3U files.
- [x] Release artifact generator creates Linux, macOS, and Windows launcher artifacts for quick CLI entry points.
- [x] Publish workflow uploads generated release artifacts and attaches them to GitHub releases.
- [x] `.gitignore` excludes `node_modules`, `dist`, and TypeScript build info.
- [x] `LICENSE` exists.
- [x] `pnpm test`, `pnpm typecheck`, and `pnpm build` pass.
- [x] `pnpm --filter iptv-doctor pack` creates an npm tarball.
- [x] npm tarball includes a Node executable bin wrapper and excludes CLI test files.
- [x] Published workspace package tarballs exclude test files and can be installed together in a clean npm project.
- [x] `@bjia666/match2epg` tarball exposes a working `match2epg` Node bin wrapper in a clean npm project.
- [x] Published package tarballs contain compiled `dist` JavaScript and declaration files, and can be imported by plain Node ESM without `tsx`.
- [x] GitHub Pages demo supports browser-local M3U parsing.
- [x] Five launch how-to documents exist for Actions health checks, cleaning M3U, fixing EPG IDs, World Cup metadata, and shareable reports.
- [x] External publish runbook and verifier exist for GitHub Action tag, npm registry package, GHCR image manifest, release assets, and static badge endpoint.

## Deferred Acceptance

These require external repository, registry, or hosting state. They are not claimed as complete by local implementation alone.

- [x] GitHub Action is published as `xyzs996/iptv-doctor@v1`.
- [x] Docker image is published.
- [x] npm package is published.
- [x] Health badge endpoint JSON is published as a static artifact.
