/** P0-B 準拠のデモ用ワーカー（キラーカード・/worker 向け） */

export type DemoWorkerRow = {
  id: string;
  displayNameEn: string;
  clientShortJa: string;
  joinDate: string;
  visaExpiry: string;
  birthDate: string;
  jpProgressPct: number;
  ethicsDoneCount: number;
  lastStudyDate: string;
  stalled: boolean;
  virtuePoints: number;
};

export const demoWorkers: DemoWorkerRow[] = [
  {
    id: "w-kasun",
    displayNameEn: "Kasun Perera",
    clientShortJa: "野田フーズ",
    joinDate: "2024-06-01",
    visaExpiry: "2026-08-20",
    birthDate: "1995-03-12",
    jpProgressPct: 72,
    ethicsDoneCount: 4,
    lastStudyDate: "2026-04-02",
    stalled: false,
    virtuePoints: 120,
  },
  {
    id: "w-dilshan",
    displayNameEn: "Dilshan Fernando",
    clientShortJa: "野田フーズ",
    joinDate: "2024-08-15",
    visaExpiry: "2026-11-05",
    birthDate: "1992-11-22",
    jpProgressPct: 45,
    ethicsDoneCount: 2,
    lastStudyDate: "2026-03-10",
    stalled: true,
    virtuePoints: 45,
  },
  {
    id: "w-chamara",
    displayNameEn: "Chamara Silva",
    clientShortJa: "千葉水産加工",
    joinDate: "2023-11-01",
    visaExpiry: "2027-01-12",
    birthDate: "1990-07-08",
    jpProgressPct: 81,
    ethicsDoneCount: 5,
    lastStudyDate: "2026-04-03",
    stalled: false,
    virtuePoints: 210,
  },
  {
    id: "w-nuwan",
    displayNameEn: "Nuwan Jayasuriya",
    clientShortJa: "千葉水産加工",
    joinDate: "2025-01-10",
    visaExpiry: "2026-06-30",
    birthDate: "1996-01-30",
    jpProgressPct: 58,
    ethicsDoneCount: 3,
    lastStudyDate: "2026-03-28",
    stalled: false,
    virtuePoints: 78,
  },
  {
    id: "w-thisara",
    displayNameEn: "Thisara Mendis",
    clientShortJa: "大阪食肉卸A",
    joinDate: "2025-03-20",
    visaExpiry: "2026-09-15",
    birthDate: "1994-05-18",
    jpProgressPct: 38,
    ethicsDoneCount: 1,
    lastStudyDate: "2026-02-01",
    stalled: true,
    virtuePoints: 22,
  },
  {
    id: "w-lahiru",
    displayNameEn: "Lahiru Bandara",
    clientShortJa: "大阪食肉卸A",
    joinDate: "2024-02-01",
    visaExpiry: "2027-03-01",
    birthDate: "1991-09-05",
    jpProgressPct: 66,
    ethicsDoneCount: 4,
    lastStudyDate: "2026-04-01",
    stalled: false,
    virtuePoints: 155,
  },
  {
    id: "w-rangana",
    displayNameEn: "Rangana Herath",
    clientShortJa: "名古屋製パン",
    joinDate: "2023-05-12",
    visaExpiry: "2026-12-10",
    birthDate: "1989-12-01",
    jpProgressPct: 77,
    ethicsDoneCount: 5,
    lastStudyDate: "2026-04-03",
    stalled: false,
    virtuePoints: 198,
  },
  {
    id: "w-kusal",
    displayNameEn: "Kusal Perera",
    clientShortJa: "名古屋製パン",
    joinDate: "2025-02-01",
    visaExpiry: "2026-05-25",
    birthDate: "1997-04-14",
    jpProgressPct: 52,
    ethicsDoneCount: 2,
    lastStudyDate: "2026-03-15",
    stalled: true,
    virtuePoints: 40,
  },
  {
    id: "w-mahela",
    displayNameEn: "Mahela Wickramasinghe",
    clientShortJa: "福岡物流B",
    joinDate: "2022-10-01",
    visaExpiry: "2026-10-08",
    birthDate: "1988-08-20",
    jpProgressPct: 88,
    ethicsDoneCount: 6,
    lastStudyDate: "2026-04-03",
    stalled: false,
    virtuePoints: 260,
  },
  {
    id: "w-sanath",
    displayNameEn: "Sanath Jayasuriya",
    clientShortJa: "福岡物流B",
    joinDate: "2024-12-01",
    visaExpiry: "2027-02-28",
    birthDate: "1993-02-28",
    jpProgressPct: 61,
    ethicsDoneCount: 3,
    lastStudyDate: "2026-03-20",
    stalled: false,
    virtuePoints: 95,
  },
];

export function getStalledWorkers(): DemoWorkerRow[] {
  return demoWorkers.filter((w) => w.stalled);
}

export type DemoAlertRow = {
  id: string;
  workerId: string;
  workerName: string;
  typeJa: string;
  dueDate: string;
  daysLeft: number;
};

function daysUntil(iso: string): number {
  const t = new Date(iso).getTime();
  const now = Date.now();
  return Math.ceil((t - now) / (86400 * 1000));
}

export function getDemoAlerts(): DemoAlertRow[] {
  const rows: DemoAlertRow[] = [];
  for (const w of demoWorkers) {
    const d = daysUntil(w.visaExpiry);
    if (d <= 120 && d >= 0) {
      rows.push({
        id: `visa-${w.id}`,
        workerId: w.id,
        workerName: w.displayNameEn,
        typeJa: "在留期限",
        dueDate: w.visaExpiry,
        daysLeft: d,
      });
    }
  }
  rows.push({
    id: "interview-kasun",
    workerId: "w-kasun",
    workerName: "Kasun Perera",
    typeJa: "月次面談",
    dueDate: "2026-04-10",
    daysLeft: daysUntil("2026-04-10"),
  });
  rows.sort((a, b) => a.daysLeft - b.daysLeft);
  return rows.slice(0, 8);
}

export function avgJpProgress(): number {
  const sum = demoWorkers.reduce((a, w) => a + w.jpProgressPct, 0);
  return Math.round(sum / demoWorkers.length);
}

export function avgEthicsModules(): string {
  const sum = demoWorkers.reduce((a, w) => a + w.ethicsDoneCount, 0);
  return (sum / demoWorkers.length).toFixed(1);
}
