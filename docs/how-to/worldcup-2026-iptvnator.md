# How to add World Cup 2026 metadata to IPTVnator

Generate legal metadata files without stream URLs.

```bash
iptv-doctor worldcup --country US --format xmltv --out worldcup-2026-us.xmltv
iptv-doctor worldcup --country US --format m3u --out worldcup-2026-us-placeholder.m3u
iptv-doctor worldcup --country US --format html --out worldcup-2026-guide.html
```

The placeholder M3U uses `example.invalid` URLs. Add only legal streams from services you are allowed to use.
