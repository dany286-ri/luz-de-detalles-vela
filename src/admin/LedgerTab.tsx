import React, { useMemo, useState } from "react";
import { LOCATIONS, formatCOP } from "../config/site.config";
import { ledgerToCsv, type LedgerRow } from "./stats";

export default function LedgerTab({ rows }: { rows: LedgerRow[] }) {
  const [sede, setSede] = useState("todas");
  const [month, setMonth] = useState("todos");

  const months = useMemo(() => [...new Set(rows.map((r) => r.paidAt.slice(0, 7)))].sort().reverse(), [rows]);
  const filtered = rows.filter(
    (r) => (sede === "todas" || r.sede === sede) && (month === "todos" || r.paidAt.startsWith(month))
  );
  const total = filtered.filter((r) => !r.voided).reduce((s, r) => s + r.amount, 0);

  const download = () => {
    const blob = new Blob([ledgerToCsv(filtered)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pagos-luz-de-detalles.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const select = "rounded-lg border border-ink/15 bg-cream px-3 py-2 text-sm text-ink";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select aria-label="Sede" value={sede} onChange={(e) => setSede(e.target.value)} className={select}>
          <option value="todas">Todas las sedes</option>
          {Object.values(LOCATIONS).map((l) => (
            <option key={l.key} value={l.key}>
              {l.label}
            </option>
          ))}
        </select>
        <select aria-label="Mes" value={month} onChange={(e) => setMonth(e.target.value)} className={select}>
          <option value="todos">Todos los meses</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <button onClick={download} disabled={filtered.length === 0} className="ml-auto rounded-full border border-ink/20 px-4 py-2 text-sm text-ink hover:border-gold disabled:opacity-40">
          Descargar para Excel (CSV)
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-charcoal/60 py-8 text-center">No hay pagos registrados con estos filtros.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-ink/10">
          <table className="w-full text-sm">
            <thead className="bg-ivory text-left text-xs uppercase tracking-wide text-charcoal/60">
              <tr>
                <th className="px-4 py-2.5">Fecha</th>
                <th className="px-4 py-2.5">Pedido</th>
                <th className="px-4 py-2.5">Cliente</th>
                <th className="px-4 py-2.5">Sede</th>
                <th className="px-4 py-2.5">Tipo</th>
                <th className="px-4 py-2.5">Nota</th>
                <th className="px-4 py-2.5 text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.paymentId} className={`border-t border-ink/10 ${r.voided ? "text-charcoal/40 line-through" : ""}`}>
                  <td className="px-4 py-2.5 whitespace-nowrap">{r.paidAt}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{r.orderId}</td>
                  <td className="px-4 py-2.5">{r.customer}</td>
                  <td className="px-4 py-2.5">{r.sedeLabel}</td>
                  <td className="px-4 py-2.5">{r.kind}</td>
                  <td className="px-4 py-2.5">
                    {r.note}
                    {r.voided && <span className="no-underline"> (anulado: {r.voidReason})</span>}
                  </td>
                  <td className="px-4 py-2.5 text-right whitespace-nowrap">{formatCOP(r.amount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-ink/20 bg-ivory font-medium">
                <td className="px-4 py-3" colSpan={6}>
                  Total verificado
                </td>
                <td className="px-4 py-3 text-right">{formatCOP(total)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
