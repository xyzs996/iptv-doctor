# How to check an IPTV playlist with GitHub Actions

Use the composite action when you want scheduled health reports for a playlist repository.

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
      - uses: xyzs996/iptv-doctor@v1
        with:
          playlist: playlist.m3u
          report: report.html
          json: report.json
          csv: report.csv
          badge: badge.json
```

Do not commit private playlist URLs or credentials. Use redacted examples in issues and pull requests.
