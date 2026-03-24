import Link from "next/link";

type ScanRow = {
  id: string;
  scan_url: string;
  scan_status: string;
  overall_score: number | null;
  created_at: string;
};

export function DashboardScanTable({ scans }: { scans: ScanRow[] }) {
  if (!scans.length) {
    return <div className="glass-card p-6 text-sm text-slate-600">No scans yet. Run your first scan from the homepage or dashboard action.</div>;
  }

  return (
    <div className="glass-card overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-100 text-slate-600">
          <tr>
            <th className="px-4 py-3">URL</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Score</th>
            <th className="px-4 py-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {scans.map((scan) => (
            <tr key={scan.id} className="border-t border-slate-100">
              <td className="px-4 py-3"><Link href={`/scan/${scan.id}`} className="text-brand-600 hover:underline">{scan.scan_url}</Link></td>
              <td className="px-4 py-3">{scan.scan_status}</td>
              <td className="px-4 py-3">{scan.overall_score ?? "-"}</td>
              <td className="px-4 py-3">{new Date(scan.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
