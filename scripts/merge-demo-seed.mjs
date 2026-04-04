import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const dataDir = path.join(root, "data");

const clients = JSON.parse(fs.readFileSync(path.join(dataDir, "clients.json"), "utf8"));
const cands = JSON.parse(fs.readFileSync(path.join(dataDir, "candidates.json"), "utf8"));

const bundle = {
  meta: {
    version: "1.0.0",
    locale: "ja-JP",
    referenceDate: "2026-04-03",
    descriptionJa:
      "派遣・人材紹介ダッシュボードデモ用。候補者20名・クライアント8社。個人・連絡先は架空です。",
  },
  clients: clients.clients,
  candidates: cands.candidates,
};

const dest = path.join(dataDir, "demo-seed.json");
fs.writeFileSync(dest, JSON.stringify(bundle, null, 2), "utf8");
console.log("Wrote", dest);
