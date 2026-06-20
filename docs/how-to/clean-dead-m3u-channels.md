# How to clean dead channels from an M3U playlist

Run a check first so you can inspect what will be removed.

```bash
iptv-doctor check playlist.m3u --report report.html --json report.json
iptv-doctor clean playlist.m3u --out clean.m3u
```

`clean.m3u` keeps channels with `ok` or `warn` diagnostics and removes channels marked `fail`.
