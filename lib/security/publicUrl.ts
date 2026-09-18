const ALLOWED_PORTS = new Set([80, 443]);

const BLOCKED_HOSTNAMES = new Set([
  "metadata.google.internal",
  "metadata.google",
  "metadata",
  "instance-data",
  "kubernetes.default",
  "kubernetes.default.svc",
]);

export function failPublicUrl(message: string): never {
  throw new Error(message);
}

export function parseIpv4Octets(
  value: string
): [number, number, number, number] | null {
  if (!/^[\d.]+$/.test(value)) {
    return null;
  }

  const parts = value.split(".");

  if (parts.length < 1 || parts.length > 4) {
    return null;
  }

  const numbers = parts.map((part) => {
    if (!/^\d+$/.test(part)) {
      return Number.NaN;
    }

    return Number(part);
  });

  if (numbers.some((n) => !Number.isInteger(n) || n < 0)) {
    return null;
  }

  let addr = 0;

  if (numbers.length === 1) {
    if (numbers[0] > 0xffffffff) {
      return null;
    }

    addr = numbers[0];
  } else if (numbers.length === 2) {
    if (numbers[0] > 255 || numbers[1] > 0xffffff) {
      return null;
    }

    addr = (numbers[0] << 24) | numbers[1];
  } else if (numbers.length === 3) {
    if (numbers[0] > 255 || numbers[1] > 255 || numbers[2] > 0xffff) {
      return null;
    }

    addr = (numbers[0] << 24) | (numbers[1] << 16) | numbers[2];
  } else {
    if (numbers.some((n) => n > 255)) {
      return null;
    }

    addr =
      (numbers[0] << 24) |
      (numbers[1] << 16) |
      (numbers[2] << 8) |
      numbers[3];
  }

  addr >>>= 0;

  return [
    (addr >>> 24) & 255,
    (addr >>> 16) & 255,
    (addr >>> 8) & 255,
    addr & 255,
  ];
}

function isBlockedIpv4(octets: [number, number, number, number]): boolean {
  const [a, b, c] = octets;

  if (a === 0 || a === 10 || a === 127) {
    return true;
  }

  if (a === 100 && b >= 64 && b <= 127) {
    return true;
  }

  if (a === 169 && b === 254) {
    return true;
  }

  if (a === 172 && b >= 16 && b <= 31) {
    return true;
  }

  if (a === 192 && b === 0 && (c === 0 || c === 2)) {
    return true;
  }

  if (a === 192 && b === 168) {
    return true;
  }

  if (a === 198 && (b === 18 || b === 19)) {
    return true;
  }

  if (a === 198 && b === 51 && c === 100) {
    return true;
  }

  if (a === 203 && b === 0 && c === 113) {
    return true;
  }

  if (a >= 224) {
    return true;
  }

  return false;
}

function expandIpv6(hostname: string): string[] | null {
  const lowered = hostname.toLowerCase();

  if (!lowered.includes(":")) {
    return null;
  }

  const [withoutZone] = lowered.split("%");

  if (!/^[0-9a-f:]+$/.test(withoutZone)) {
    return null;
  }

  const sides = withoutZone.split("::");

  if (sides.length > 2) {
    return null;
  }

  const splitGroups = (side: string) =>
    side ? side.split(":") : [];

  let head = splitGroups(sides[0] ?? "");
  let tail = sides.length === 2 ? splitGroups(sides[1] ?? "") : [];

  if (sides.length === 1) {
    head = withoutZone.split(":");
    tail = [];
  }

  if (head.some((group) => group.length > 4) || tail.some((group) => group.length > 4)) {
    return null;
  }

  const missing = 8 - (head.length + tail.length);

  if (sides.length === 1 && missing !== 0) {
    return null;
  }

  if (missing < 0) {
    return null;
  }

  const groups = [
    ...head,
    ...Array.from({ length: missing }, () => "0"),
    ...tail,
  ].map((group) => group.padStart(4, "0"));

  if (groups.length !== 8 || groups.some((group) => !/^[0-9a-f]{4}$/.test(group))) {
    return null;
  }

  return groups;
}

function isBlockedIpv6(hostname: string): boolean {
  const groups = expandIpv6(hostname);

  if (!groups) {
    return false;
  }

  const first = Number.parseInt(groups[0], 16);
  const mappedIpv4 =
    groups[0] === "0000" &&
    groups[1] === "0000" &&
    groups[2] === "0000" &&
    groups[3] === "0000" &&
    groups[4] === "0000" &&
    (groups[5] === "ffff" || groups[5] === "0000");

  if (mappedIpv4) {
    const hi = Number.parseInt(groups[6], 16);
    const lo = Number.parseInt(groups[7], 16);
    const octets: [number, number, number, number] = [
      (hi >> 8) & 255,
      hi & 255,
      (lo >> 8) & 255,
      lo & 255,
    ];

    if (groups[5] === "0000" && octets.every((octet) => octet === 0)) {
      return true;
    }

    if (groups[5] === "ffff") {
      return isBlockedIpv4(octets);
    }
  }

  if (groups.every((group) => group === "0000")) {
    return true;
  }

  if (
    groups.slice(0, 7).every((group) => group === "0000") &&
    groups[7] === "0001"
  ) {
    return true;
  }

  if ((first & 0xfe00) === 0xfc00) {
    return true;
  }

  if ((first & 0xffc0) === 0xfe80) {
    return true;
  }

  if ((first & 0xff00) === 0xff00) {
    return true;
  }

  if (first === 0x2001 && Number.parseInt(groups[1], 16) === 0x0db8) {
    return true;
  }

  return false;
}

export function isBlockedHostname(hostname: string): boolean {
  const normalized = hostname
    .toLowerCase()
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .replace(/\.$/, "");

  if (
    normalized === "localhost" ||
    normalized.endsWith(".localhost") ||
    normalized.endsWith(".local") ||
    normalized.endsWith(".internal") ||
    normalized.endsWith(".corp") ||
    normalized.endsWith(".lan")
  ) {
    return true;
  }

  if (BLOCKED_HOSTNAMES.has(normalized)) {
    return true;
  }

  const ipv4 = parseIpv4Octets(normalized);

  if (ipv4 && isBlockedIpv4(ipv4)) {
    return true;
  }

  if (isBlockedIpv6(normalized)) {
    return true;
  }

  return false;
}

function defaultPort(protocol: string): number {
  return protocol === "https:" ? 443 : 80;
}

export function assertSafePublicHttpUrl(
  input: URL,
  message = "Local or private network URLs are not supported."
) {
  if (input.protocol !== "https:" && input.protocol !== "http:") {
    failPublicUrl("Only HTTP and HTTPS article URLs are supported.");
  }

  if (input.username || input.password) {
    failPublicUrl("This URL is not supported.");
  }

  const port = input.port ? Number(input.port) : defaultPort(input.protocol);

  if (!ALLOWED_PORTS.has(port)) {
    failPublicUrl("This URL is not supported.");
  }

  if (isBlockedHostname(input.hostname)) {
    failPublicUrl(message);
  }
}
