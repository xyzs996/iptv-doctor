import { createDiagnosticsSummary, type ChannelDiagnostic } from "./diagnostics.js";

export interface ShieldsBadgeJson {
  schemaVersion: 1;
  label: string;
  message: string;
  color: "brightgreen" | "yellow" | "orange" | "red";
}

export interface BadgeRenderOptions {
  now?: () => Date;
}

export function renderShieldsBadgeJson(diagnostics: ChannelDiagnostic[], options: BadgeRenderOptions = {}): string {
  const summary = createDiagnosticsSummary(diagnostics);
  const badge: ShieldsBadgeJson = {
    schemaVersion: 1,
    label: "IPTV health",
    message: renderBadgeMessage(diagnostics, options.now ?? (() => new Date())),
    color: colorForHealth(summary.healthScore)
  };

  return `${JSON.stringify(badge, null, 2)}\n`;
}

function renderBadgeMessage(diagnostics: ChannelDiagnostic[], now: () => Date): string {
  const summary = createDiagnosticsSummary(diagnostics);
  const failed = `${summary.fail} ${summary.fail === 1 ? "failed" : "failed"}`;
  const checked = newestCheckedAt(diagnostics);
  const suffix = checked ? `, last checked ${relativeAge(checked, now())} ago` : "";
  return `${summary.healthScore}% online, ${failed}${suffix}`;
}

function newestCheckedAt(diagnostics: ChannelDiagnostic[]): Date | undefined {
  const timestamps = diagnostics
    .map((item) => Date.parse(item.checkedAt))
    .filter((value) => Number.isFinite(value));

  if (timestamps.length === 0) return undefined;
  return new Date(Math.max(...timestamps));
}

function relativeAge(checkedAt: Date, current: Date): string {
  const seconds = Math.max(0, Math.round((current.getTime() - checkedAt.getTime()) / 1000));
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.round(hours / 24)}d`;
}

function colorForHealth(score: number): ShieldsBadgeJson["color"] {
  if (score >= 90) return "brightgreen";
  if (score >= 70) return "yellow";
  if (score >= 40) return "orange";
  return "red";
}
