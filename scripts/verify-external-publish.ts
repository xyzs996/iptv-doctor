export interface ExternalPublicationConfig {
  githubRepository: string;
  npmPackage: string;
  ghcrImage: string;
  badgeEndpointUrl: string;
}

export interface ExternalPublicationCheck {
  name: "npm" | "github-action" | "ghcr" | "badge";
  ok: boolean;
  url: string;
  message: string;
}

export interface ExternalPublicationOptions {
  fetchImpl?: typeof fetch;
}

const requiredEnvironment = ["GITHUB_REPOSITORY", "NPM_TOKEN", "GHCR_IMAGE", "BADGE_ENDPOINT_URL"];

export async function verifyExternalPublication(
  config: ExternalPublicationConfig,
  options: ExternalPublicationOptions = {}
): Promise<ExternalPublicationCheck[]> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const checks: Array<{
    name: ExternalPublicationCheck["name"];
    url: string;
    validate: (response: Response) => Promise<boolean>;
  }> = [
    {
      name: "npm",
      url: `https://registry.npmjs.org/${encodeURIComponent(config.npmPackage)}`,
      validate: async (response) => response.ok
    },
    {
      name: "github-action",
      url: `https://api.github.com/repos/${config.githubRepository}/git/ref/tags/v1`,
      validate: async (response) => response.ok
    },
    {
      name: "ghcr",
      url: ghcrManifestUrl(config.ghcrImage),
      validate: async (response) => response.ok
    },
    {
      name: "badge",
      url: config.badgeEndpointUrl,
      validate: async (response) => {
        if (!response.ok) return false;
        const body = (await response.json()) as { schemaVersion?: number };
        return body.schemaVersion === 1;
      }
    }
  ];

  const results: ExternalPublicationCheck[] = [];
  for (const check of checks) {
    try {
      const response = await fetchImpl(check.url, ghcrFetchInit(check.name));
      const ok = await check.validate(response);
      results.push({
        name: check.name,
        ok,
        url: check.url,
        message: ok ? "published" : `unexpected response ${response.status}`
      });
    } catch (error) {
      results.push({
        name: check.name,
        ok: false,
        url: check.url,
        message: error instanceof Error ? error.message : String(error)
      });
    }
  }

  return results;
}

function readConfigFromEnvironment(): ExternalPublicationConfig {
  const missing = requiredEnvironment.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing external publish environment: ${missing.join(", ")}`);
  }

  return {
    githubRepository: process.env.GITHUB_REPOSITORY ?? "",
    npmPackage: process.env.NPM_PACKAGE ?? "iptv-doctor",
    ghcrImage: process.env.GHCR_IMAGE ?? "",
    badgeEndpointUrl: process.env.BADGE_ENDPOINT_URL ?? ""
  };
}

function ghcrManifestUrl(image: string): string {
  const withoutRegistry = image.replace(/^ghcr\.io\//, "");
  return `https://ghcr.io/v2/${withoutRegistry}/manifests/latest`;
}

function ghcrFetchInit(name: ExternalPublicationCheck["name"]): RequestInit | undefined {
  if (name !== "ghcr") return undefined;
  return {
    headers: {
      accept: "application/vnd.oci.image.manifest.v1+json, application/vnd.docker.distribution.manifest.v2+json"
    }
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const results = await verifyExternalPublication(readConfigFromEnvironment());
    for (const result of results) {
      process.stdout.write(`${result.ok ? "ok" : "fail"} ${result.name} ${result.url} ${result.message}\n`);
    }
    if (results.some((result) => !result.ok)) process.exit(1);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
