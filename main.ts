const fs = require("node:fs");
const path = require("node:path");

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  throw new Error("MAKEFUN_OUTPUT_DIR is not set");
}

const entry = "fix: I deleted prod at 3am and have learned a valuable lesson (I have not)";

// Gate: UTF-8 text, 1-200 code points, single line, not whitespace-only.
const codePoints = [...entry];
if (codePoints.length < 1 || codePoints.length > 200) {
  throw new Error("entry must be 1-200 characters");
}
if (entry.trim().length === 0) {
  throw new Error("entry must not be whitespace-only");
}
if (/[\r\n]/.test(entry)) {
  throw new Error("entry must be a single line");
}
if (Buffer.from(entry, "utf8").toString("utf8") !== entry) {
  throw new Error("entry must be valid UTF-8");
}

fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, "entry.txt");
fs.writeFileSync(outPath, entry, "utf8");

// Round-trip validation: exact bytes back, no trailing newline.
const roundTrip = fs.readFileSync(outPath, "utf8");
if (roundTrip !== entry) {
  throw new Error("round-trip mismatch");
}
if (roundTrip.endsWith("\n")) {
  throw new Error("entry must not end with a newline");
}
