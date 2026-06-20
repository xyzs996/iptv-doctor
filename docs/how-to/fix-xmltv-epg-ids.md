# How to fix XMLTV EPG IDs in an IPTV playlist

Use `epg check` to find missing or mismatched `tvg-id` values.

```bash
iptv-doctor epg check playlist.m3u guide.xml --json epg.json
iptv-doctor epg fix playlist.m3u guide.xml --out fixed.m3u
```

The fixer uses XMLTV `display-name` values to suggest IDs. Review the output before publishing it.
