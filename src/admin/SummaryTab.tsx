import React from "react";
import { LOCATIONS, formatCOP } from "../config/site.config";
import type { Summary } from "./stats";

function Card({ label, value, hint, strong }: { label: string; value: string; hint?: string; strong?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 ${strong ? "border-gold/50 bg-gold/10" : "border-ink/10 bg-cream"}`}>
      <p className="text-xs uppercase tracking-[0.15em] text-charcoal/60">{label}</p>
      <p className="font-serif text-3xl text-ink mt-1">{value}</p>
      {hint && <p className="text-xs text-charcoal/55 mt-1">{hint}</p>}
    </div>
  );
}

const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
export const prettyMonth = (ym: string) => `${MONTHS[Number(ym.slice(5, 7)) - 1] ?? ym} ${ym.slice(0, 4)}`;

export default function SummaryTab({ summary }: { summary: Summary }) {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-serif text-xl text-ink mb-3">Dinero que ha entrado al negocio</h2>
        <p className="text-xs text-charcoal/55 mb-4">Solo cuenta pagos que tú verificaste y registraste. Los pagos anulados no suman.</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <Card strong label="Total verificado" value={formatCOP(summary.totalVerified)} />
          <Card label="Este mes" value={formatCOP(summary.month)} />
          <Card label="Hoy" value={formatCOP(summary.today)} />
        </div>
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink mb-3">Por sede</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {Object.values(LOCATIONS).map((loc) => (
            <Card key={loc.key} label={`Sede ${loc.label}`} value={formatCOP(summary.bySede[loc.key])} hint={`Nequi ${loc.nequi}`} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink mb-3">Por cobrar y pendientes</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card label="Saldo por cobrar" value={formatCOP(summary.receivable)} hint="De pedidos activos (no cancelados)" />
          <Card
            label="Pendientes de verificación"
            value={String(summary.pendingCount)}
            hint={`Anticipos esperados: ${formatCOP(summary.pendingDeposit)}`}
          />
        </div>
      </section>

      <section>
        <h2 className="font-serif text-xl text-ink mb-3">Ingresos por mes</h2>
        {summary.byMonth.length === 0 ? (
          <p className="text-sm text-charcoal/60">Aún no has registrado pagos.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-ink/10">
            <table className="w-full text-sm">
              <thead className="bg-ivory text-left text-xs uppercase tracking-wide text-charcoal/60">
                <tr>
                  <th className="px-4 py-2.5">Mes</th>
                  <th className="px-4 py-2.5 text-right">Pagos</th>
                  <th className="px-4 py-2.5 text-right">Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {summary.byMonth.map((m) => (
                  <tr key={m.month} className="border-t border-ink/10">
                    <td className="px-4 py-2.5 capitalize">{prettyMonth(m.month)}</td>
                    <td className="px-4 py-2.5 text-right">{m.count}</td>
                    <td className="px-4 py-2.5 text-right font-medium">{formatCOP(m.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
