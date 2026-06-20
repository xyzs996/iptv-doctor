# Release Runbook

This runbook covers the external publishing steps that cannot be proven by local tests alone.

## 1. Preflight

```bash
pnpm compliance:scan
pnpm test
pnpm typecheck
pnpm build
node --import tsx scripts/generate-release-artifacts.ts dist/release
pnpm --filter iptv-doctor pack --pack-destination dist/release
```

## 2. GitHub Action

Publish the repository with `action.yml` at the root and create a release tag.

```bash
git tag v0.1.0
git push origin v0.1.0
```

Consumers should use:

```yaml
- uses: xyzs996/iptv-doctor@v1
  with:
    playlist: playlist.m3u
    report: report.html
    json: report.json
    csv: report.csv
    badge: badge.json
```

## 3. npm publish

Set `NPM_TOKEN` in repository secrets. The publish workflow runs `npm publish` through pnpm for `iptv-doctor` and `@iptv-star/*` packages.

## 4. Docker / GHCR

The publish workflow pushes:

```txt
ghcr.io/<owner>/iptv-doctor:latest
ghcr.io/<owner>/iptv-doctor:<release-tag>
```

## 5. Release artifacts

Attach every file in `dist/release` to the GitHub Release:

```txt
iptv-doctor-linux-x64
iptv-doctor-macos-arm64
iptv-doctor-windows-x64.cmd
worldcup-2026-us.xmltv
worldcup-2026-us.ics
worldcup-2026-us-placeholder.m3u
worldcup-2026-guide.html
sample-report.html
sample-report.json
sample-clean.m3u
iptv-doctor-0.1.0.tgz
```

The platform launcher artifacts call `npx iptv-doctor` and are intended as low-friction release entry points. They are not native compiled binaries.

## 6. Static health badge endpoint

Publish `badge.json` from `iptv-doctor check --badge badge.json` to GitHub Pages or another static host, then use:

```md
![IPTV health](https://img.shields.io/endpoint?url=https://example.com/badge.json)
```

Do not publish private playlist URLs, credentials, or token-bearing report files.

## 7. Verify external publication

After the release is public, run:

```bash
GITHUB_REPOSITORY=xyzs996/iptv-doctor \
NPM_TOKEN=present \
NPM_PACKAGE=iptv-doctor \
GHCR_IMAGE=ghcr.io/xyzs996/iptv-doctor \
BADGE_ENDPOINT_URL=https://example.com/badge.json \
node --import tsx scripts/verify-external-publish.ts
```

The verifier checks the npm registry package, GitHub Action `v1` tag, GHCR `latest` manifest, and Shields-compatible `badge.json` endpoint.
