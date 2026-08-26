/**
 * Verifica che ogni riferimento a un asset statico presente nel codice
 * corrisponda a un file realmente esistente in public/, con la stessa
 * identica combinazione di maiuscole e minuscole.
 *
 * Serve perche NTFS e case-insensitive: un riferimento a "portfolio-14.jpg"
 * quando il file si chiama "portfolio-14.JPG" funziona su Windows e produce
 * un 404 sul filesystem case-sensitive di qualunque host Linux. E' esattamente
 * il bug presente nel progetto ASP.NET di partenza.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, relative, extname, sep } from "node:path";

const ROOT = process.cwd();
const PUBLIC_DIR = join(ROOT, "public");
const SCAN_DIRS = ["src"];
const SCAN_EXT = new Set([".ts", ".tsx", ".mjs", ".js", ".scss", ".css"]);
const REFERENCE_RE = /["'`](\/(?:img|fonts|videos|files)\/[^"'`)\s]+)["'`]/g;

const toPosix = (p) => p.split(sep).join("/");

function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const publicFiles = new Set(walk(PUBLIC_DIR).map((f) => "/" + toPosix(relative(PUBLIC_DIR, f))));
if (publicFiles.size === 0) {
  console.error("check-assets: public/ vuota o inesistente");
  process.exit(1);
}

/** @type {Map<string, Set<string>>} riferimento -> sorgenti che lo citano */
const referenced = new Map();
for (const dir of SCAN_DIRS) {
  for (const file of walk(join(ROOT, dir))) {
    if (!SCAN_EXT.has(extname(file))) continue;
    for (const [, ref] of readFileSync(file, "utf8").matchAll(REFERENCE_RE)) {
      const key = decodeURIComponent(ref);
      if (!referenced.has(key)) referenced.set(key, new Set());
      referenced.get(key).add(toPosix(relative(ROOT, file)));
    }
  }
}

const byLowerCase = new Map([...publicFiles].map((f) => [f.toLowerCase(), f]));
const problems = [];

for (const [ref, sources] of referenced) {
  if (publicFiles.has(ref)) continue;
  const onDisk = byLowerCase.get(ref.toLowerCase());
  problems.push(
    onDisk
      ? `case mismatch: ${ref} -> su disco e ${onDisk} (citato da ${[...sources].join(", ")})`
      : `asset mancante: ${ref} (citato da ${[...sources].join(", ")})`,
  );
}

for (const asset of publicFiles) {
  if (/\.[A-Z]+$/.test(asset)) problems.push(`estensione maiuscola in public/: ${asset}`);
}

if (problems.length > 0) {
  for (const problem of problems) console.error(`check-assets: ${problem}`);
  process.exit(1);
}

console.log(
  `check-assets: OK - ${referenced.size} riferimenti verificati su ${publicFiles.size} file in public/`,
);
