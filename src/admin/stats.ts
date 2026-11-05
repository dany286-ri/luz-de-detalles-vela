import { LOCATIONS, type LocationKey } from "../config/site.config";
import { balanceDue, orderStatus, paidTotal, type PaymentKind, type StoredOrder } from "../shared/orderTypes";

/** Una fila del libro de pagos: cada pago registrado, con el pedido al que pertenece. */
export interface LedgerRow {
  paymentId: string;
  orderId: string;
  customer: string;
  sede: LocationKey;
  sedeLabel: string;
  kind: PaymentKind;
  note: string;
  amount: number;
  paidAt: string; // yyyy-mm-dd
  registeredAt: string;
  voided: boolean;
  voidReason: string;
}

export function localToday(now = new Date()): string {
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${mm}-${dd}`;
}

export function buildLedger(orders: StoredOrder[]): LedgerRow[] {
  const rows: LedgerRow[] = [];
  for (const o of orders) {
    for (const p of o.payments) {
      rows.push({
        paymentId: p.id,
        orderId: o.id,
        customer: o.customer.nombre,
        sede: o.sede,
        sedeLabel: o.sedeLabel,
        kind: p.kind,
        note: p.note,
        amount: p.amount,
        paidAt: p.paidAt,
        registeredAt: p.registeredAt,
        voided: !!p.voided,
        voidReason: p.voided?.reason ?? "",
      });
    }
  }
  return rows.sort((a, b) => b.paidAt.localeCompare(a.paidAt) || b.registeredAt.localeCompare(a.registeredAt));
}

export interface Summary {
  /** Todo el dinero verificado (pagos no anulados). */
  totalVerified: number;
  today: number;
  month: number;
  bySede: Record<LocationKey, number>;
  /** Lo que falta por cobrar de pedidos que siguen activos. */
  receivable: number;
  pendingCount: number;
  /** Anticipo que se espera de los pedidos aún sin ningún pago verificado. */
  pendingDeposit: number;
  byMonth: { month: string; count: number; total: number }[];
}

export function computeSummary(orders: StoredOrder[], todayStr = localToday()): Summary {
  const valid = buildLedger(orders).filter((r) => !r.voided);
  const monthStr = todayStr.slice(0, 7);
  const bySede = Object.keys(LOCATIONS).reduce((acc, k) => ({ ...acc, [k]: 0 }), {} as Record<LocationKey, number>);
  const months = new Map<string, { count: number; total: number }>();
  let totalVerified = 0;
  let today = 0;
  let month = 0;

  for (const r of valid) {
    totalVerified += r.amount;
    if (r.paidAt === todayStr) today += r.amount;
    if (r.paidAt.startsWith(monthStr)) month += r.amount;
    bySede[r.sede] += r.amount;
    const m = r.paidAt.slice(0, 7);
    const cur = months.get(m) ?? { count: 0, total: 0 };
    months.set(m, { count: cur.count + 1, total: cur.total + r.amount });
  }

  const active = orders.filter((o) => !o.cancelled);
  const pending = active.filter((o) => orderStatus(o) === "pendiente");

  return {
    totalVerified,
    today,
    month,
    bySede,
    receivable: active.reduce((sum, o) => sum + balanceDue(o), 0),
    pendingCount: pending.length,
    pendingDeposit: pending.reduce((sum, o) => sum + o.totals.deposit, 0),
    byMonth: [...months.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([m, v]) => ({ month: m, ...v })),
  };
}

const csvCell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

/** CSV del libro de pagos (con BOM para que Excel respete las tildes). */
export function ledgerToCsv(rows: LedgerRow[]): string {
  const header = ["Fecha del pago", "Pedido", "Cliente", "Sede", "Tipo", "Nota", "Valor", "Estado", "Motivo anulación"];
  const lines = rows.map((r) =>
    [r.paidAt, r.orderId, r.customer, r.sedeLabel, r.kind, r.note, r.amount, r.voided ? "Anulado" : "Verificado", r.voidReason]
      .map(csvCell)
      .join(",")
  );
  return "﻿" + [header.map(csvCell).join(","), ...lines].join("\r\n");
}

export { paidTotal };
