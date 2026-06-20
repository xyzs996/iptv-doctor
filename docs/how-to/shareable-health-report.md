# How to generate a shareable IPTV health report

Generate HTML, JSON, CSV, and a Shields-compatible badge endpoint file from the same check.

```bash
iptv-doctor check playlist.m3u \
  --report report.html \
  --json report.json \
  --csv report.csv \
  --badge badge.json
```

Upload `report.html` as a workflow artifact or release asset. Host `badge.json` as a static file before using it with Shields.
