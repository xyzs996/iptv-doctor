export interface ComplianceFinding {
  file: string;
  line: number;
  code:
    | "XTREAM_CREDENTIALS"
    | "STALKER_PORTAL"
    | "MAC_PORTAL"
    | "SOFTCAM_KEY"
    | "SECRET_STREAM_URL"
    | "BULK_STREAM_LIST";
  message: string;
}

const SAFE_HOSTS = new Set(["example.com", "example.org", "example.net", "example.invalid", "localhost"]);

export function scanComplianceText(input: string, file = "<memory>"): ComplianceFinding[] {
  const findings: ComplianceFinding[] = [];
  const lines = input.split(/\r?\n/);
  let extinfCount = 0;
  let realStreamUrlCount = 0;

  lines.forEach((line, index) => {
    const lower = line.toLowerCase();
    const lineNumber = index + 1;

    if (line.trim().startsWith("#EXTINF")) extinfCount += 1;

    if (/get\.php\?[^ \n]*username=[^ \n&]+[^ \n]*password=[^ \n&]+/i.test(line)) {
      findings.push(finding(file, lineNumber, "XTREAM_CREDENTIALS", "Xtream credentials must not be committed."));
    }
    if (lower.includes("stalker_portal")) {
      findings.push(finding(file, lineNumber, "STALKER_PORTAL", "Stalker portal markers are not allowed."));
    }
    if (/\bmac=([0-9a-f]{2}:){5}[0-9a-f]{2}\b/i.test(line)) {
      findings.push(finding(file, lineNumber, "MAC_PORTAL", "MAC portal identifiers are not allowed."));
    }
    if (lower.includes("softcam")) {
      findings.push(finding(file, lineNumber, "SOFTCAM_KEY", "Softcam key content is not allowed."));
    }

    for (const url of findUrls(line)) {
      if (isSafeUrl(url)) continue;
      if (url.includes(".m3u8") || url.includes("/live/") || url.includes("token=")) {
        realStreamUrlCount += 1;
      }
      if (url.includes("token=") || url.includes("auth=")) {
        findings.push(finding(file, lineNumber, "SECRET_STREAM_URL", "Secret-looking stream URLs are not allowed."));
      }
    }
  });

  if (extinfCount >= 3 && realStreamUrlCount >= 3) {
    findings.push(finding(file, 1, "BULK_STREAM_LIST", "Bulk real-looking stream lists are not allowed."));
  }

  return findings;
}

function finding(file: string, line: number, code: ComplianceFinding["code"], message: string): ComplianceFinding {
  return { file, line, code, message };
}

function findUrls(line: string): string[] {
  return line.match(/https?:\/\/[^\s"'<>]+/g) ?? [];
}

function isSafeUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return SAFE_HOSTS.has(url.hostname) || url.hostname.endsWith(".test") || url.hostname.endsWith(".invalid");
  } catch {
    return false;
  }
}
