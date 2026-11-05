import React, { useEffect, useState } from "react";
import { LOCATIONS, formatCOP, formatPhone } from "../config/site.config";
import {
  PAYMENT_KINDS,
  STATUS_LABELS,
  balanceDue,
  orderStatus,
  paidTotal,
  type OrderStatus,
  type PaymentKind,
  type StoredOrder,
} from "../shared/orderTypes";
import { api, type OrderPhotoView } from "./api";
import { localToday } from "./stats";

const STATUS_STYLE: Record<OrderStatus, string> = {
  pendiente: "bg-amber-100 text-amber-900",
  parcial: "bg-orange-100 text-orange-900",
  anticipo: "bg-sky-100 text-sky-900",
  pagado: "bg-emerald-100 text-emerald-900",
  cancelado: "bg-stone-200 text-stone-600",
};

const FILTERS: { key: "todos" | OrderStatus; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "pendiente", label: "Pendientes" },
  { key: "anticipo", label: "Con anticipo" },
  { key: "parcial", label: "Pago parcial" },
  { key: "pagado", label: "Pagados" },
  { key: "cancelado", label: "Cancelados" },
];

const FIELD_LABELS: Record<string, string> = {
  nombre: "Nombre / palabra",
  colorGlitter: "Color",
  notas: "Información adicional",
  anio: "Año",
  mensaje: "Mensaje",
  fechaEvento: "Fecha del evento",
  nombreMascota: "Nombre de la mascota",
};

const inputClass = "w-full rounded-lg border border-ink/15 bg-cream px-3 py-2 text-sm text-ink focus:outline-none focus:border-gold";

function StatusBadge({ order }: { order: StoredOrder }) {
  const s = orderStatus(order);
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[s]}`}>{STATUS_LABELS[s]}</span>;
}

function OrderDetail({ initial, onChanged }: { initial: StoredOrder; onChanged: (o: StoredOrder) => void }) {
  const [order, setOrder] = useState(initial);
  const [photos, setPhotos] = useState<OrderPhotoView[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const paid = paidTotal(order);
  const [amount, setAmount] = useState(String(paid === 0 ? order.totals.deposit : balanceDue(order)));
  const [kind, setKind] = useState<PaymentKind>(paid === 0 ? "Anticipo" : "Saldo");
  const [paidAt, setPaidAt] = useState(localToday());
  const [note, setNote] = useState("");
  const [voidingId, setVoidingId] = useState<string | null>(null);
  const [voidReason, setVoidReason] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    let alive = true;
    api
      .get(initial.id)
      .then((r) => alive && (setPhotos(r.photos), setOrder(r.order)))
      .catch((e: Error) => alive && setError(e.message));
    return () => {
      alive = false;
    };
  }, [initial.id]);

  const apply = (o: StoredOrder) => {
    setOrder(o);
    onChanged(o);
    const p = paidTotal(o);
    setAmount(String(p === 0 ? o.totals.deposit : balanceDue(o)));
    setKind(p === 0 ? "Anticipo" : "Saldo");
  };

  const run = async (fn: () => Promise<{ order: StoredOrder }>) => {
    setBusy(true);
    setError("");
    try {
      apply((await fn()).order);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const submitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await run(() => api.addPayment({ id: order.id, amount: Number(amount.replace(/\D/g, "")), kind, paidAt, note }));
    if (ok) setNote("");
  };

  const digits = order.customer.celular;

  return (
    <div className="mt-4 space-y-6 border-t border-ink/10 pt-5 text-sm">
      {error && (
        <p className="rounded-lg border border-red-700/30 bg-red-50 px-3 py-2 text-red-800" role="alert">
          {error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-gold font-medium mb-1">Cliente</p>
          <p className="text-ink">{order.customer.nombre}</p>
          <p className="text-charcoal/70">
            <a className="underline" target="_blank" rel="noreferrer" href={`https://wa.me/57${digits}`}>
              {formatPhone(digits)} (WhatsApp)
            </a>
          </p>
          {order.customer.correo && <p className="text-charcoal/70">{order.customer.correo}</p>}
          <p className="text-charcoal/70">{order.customer.direccion}</p>
          <p className="text-charcoal/70">Entrega pedida para: {order.customer.fechaEntrega}</p>
          {order.customer.notas && <p className="text-charcoal/70 italic">“{order.customer.notas}”</p>}
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gold font-medium mb-1">Pago esperado</p>
          <p className="text-charcoal/80">
            Nequi de la sede {order.sedeLabel}: <strong>{formatPhone(order.nequiDestino)}</strong>
          </p>
          <p className="text-charcoal/80">Total: {formatCOP(order.totals.total)} (domicilio {formatCOP(order.totals.delivery)})</p>
          <p className="text-charcoal/80">Anticipo 50%: {formatCOP(order.totals.deposit)}</p>
          <p className="text-charcoal/80">Verificado: {formatCOP(paid)}</p>
          <p className="font-medium text-ink">Saldo pendiente: {formatCOP(balanceDue(order))}</p>
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-gold font-medium mb-2">Productos</p>
        <ul className="space-y-3">
          {order.items.map((it, i) => (
            <li key={i} className="rounded-xl bg-ivory/60 p-3">
              <p className="text-ink">
                {it.quantity} × {it.name} <span className="text-charcoal/50">({it.presentation})</span> — {formatCOP(it.lineTotal)}
              </p>
              {Object.entries(it.personalization).map(([k, v]) => (
                <p key={k} className="text-charcoal/70">
                  {FIELD_LABELS[k] ?? k}: {v}
                </p>
              ))}
            </li>
          ))}
        </ul>
      </div>

      {order.items.some((it) => it.photos.length > 0) && (
        <div>
          <p className="text-xs uppercase tracking-wide text-gold font-medium mb-2">Fotos para las velas</p>
          {photos === null ? (
            <p className="text-charcoal/60">Cargando fotos...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {photos.map((ph) => (
                <figure key={ph.key} className="space-y-1">
                  <a href={ph.dataUrl} download={`${order.id}-${ph.label || ph.key.split("/").pop()}.jpg`}>
                    <img src={ph.dataUrl} alt={ph.label || "Foto de vela"} className="aspect-square w-full rounded-lg object-cover" />
                  </a>
                  <figcaption className="text-xs text-charcoal/70">
                    {ph.label || "Sin etiqueta"} · <span className="underline">toca para descargar</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      )}

      <div>
        <p className="text-xs uppercase tracking-wide text-gold font-medium mb-2">Pagos registrados</p>
        {order.payments.length === 0 ? (
          <p className="text-charcoal/60">Todavía no has verificado ningún pago de este pedido.</p>
        ) : (
          <ul className="space-y-2">
            {order.payments.map((p) => (
              <li key={p.id} className="rounded-xl border border-ink/10 p-3">
                <div className={`flex flex-wrap items-center justify-between gap-2 ${p.voided ? "line-through text-charcoal/40" : ""}`}>
                  <span>
                    {p.paidAt} · {p.kind}
                    {p.note ? ` · ${p.note}` : ""}
                  </span>
                  <span className="font-medium">{formatCOP(p.amount)}</span>
                </div>
                {p.voided ? (
                  <p className="text-xs text-charcoal/55 mt-1">Anulado: {p.voided.reason}</p>
                ) : voidingId === p.id ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <input className={`${inputClass} flex-1`} placeholder="Motivo de la anulación" value={voidReason} onChange={(e) => setVoidReason(e.target.value)} />
                    <button
                      disabled={busy}
                      onClick={async () => {
                        if (await run(() => api.voidPayment(order.id, p.id, voidReason))) (setVoidingId(null), setVoidReason(""));
                      }}
                      className="rounded-full bg-ink px-4 py-2 text-cream disabled:opacity-50"
                    >
                      Anular pago
                    </button>
                    <button onClick={() => setVoidingId(null)} className="px-3 py-2 text-charcoal/60">
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setVoidingId(p.id)} className="mt-1 text-xs text-charcoal/55 underline">
                    Anular este pago
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {!order.cancelled && (
        <form onSubmit={submitPayment} className="rounded-2xl border border-gold/40 bg-gold/10 p-4 space-y-3">
          <p className="font-medium text-ink">Registrar un pago verificado</p>
          <p className="text-xs text-charcoal/65">Regístralo solo cuando ya revisaste el comprobante y el dinero aparece en el Nequi.</p>
          <div className="grid gap-3 sm:grid-cols-4">
            <label className="block">
              <span className="text-xs text-charcoal/70">Valor recibido</span>
              <input className={inputClass} inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </label>
            <label className="block">
              <span className="text-xs text-charcoal/70">Tipo</span>
              <select className={inputClass} value={kind} onChange={(e) => setKind(e.target.value as PaymentKind)}>
                {PAYMENT_KINDS.map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs text-charcoal/70">Fecha en que entró</span>
              <input className={inputClass} type="date" value={paidAt} max={localToday()} onChange={(e) => setPaidAt(e.target.value)} required />
            </label>
            <label className="block">
              <span className="text-xs text-charcoal/70">Nota (opcional)</span>
              <input className={inputClass} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ej. ref. 8421" />
            </label>
          </div>
          <button disabled={busy} className="rounded-full bg-ink px-5 py-2.5 text-cream hover:bg-charcoal disabled:opacity-50">
            {busy ? "Guardando..." : "Registrar pago"}
          </button>
        </form>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {order.cancelled ? (
          <>
            <p className="text-charcoal/70">Cancelado: {order.cancelled.reason}</p>
            <button disabled={busy} onClick={() => run(() => api.restore(order.id))} className="rounded-full border border-ink/20 px-4 py-2 hover:border-gold">
              Restaurar pedido
            </button>
          </>
        ) : cancelling ? (
          <>
            <input className={`${inputClass} max-w-xs`} placeholder="Motivo de la cancelación" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} />
            <button
              disabled={busy}
              onClick={async () => {
                if (await run(() => api.cancel(order.id, cancelReason))) (setCancelling(false), setCancelReason(""));
              }}
              className="rounded-full bg-ink px-4 py-2 text-cream disabled:opacity-50"
            >
              Cancelar pedido
            </button>
            <button onClick={() => setCancelling(false)} className="text-charcoal/60">
              Volver
            </button>
          </>
        ) : (
          <button onClick={() => setCancelling(true)} className="text-xs text-charcoal/55 underline">
            Cancelar este pedido
          </button>
        )}
      </div>
    </div>
  );
}

export default function OrdersTab({ orders, onChanged }: { orders: StoredOrder[]; onChanged: (o: StoredOrder) => void }) {
  const [filter, setFilter] = useState<"todos" | OrderStatus>("todos");
  const [sede, setSede] = useState("todas");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const visible = orders.filter(
    (o) =>
      (filter === "todos" || orderStatus(o) === filter) &&
      (sede === "todas" || o.sede === sede) &&
      (!q || o.id.toLowerCase().includes(q) || o.customer.nombre.toLowerCase().includes(q) || o.customer.celular.includes(q.replace(/\D/g, "") || "§"))
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3.5 py-1.5 text-xs border transition-colors ${filter === f.key ? "bg-ink text-cream border-ink" : "border-ink/15 text-charcoal/70 hover:border-gold"}`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 mb-5">
        <input className={`${inputClass} max-w-xs`} placeholder="Buscar por nombre, celular o número de pedido" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select aria-label="Sede" value={sede} onChange={(e) => setSede(e.target.value)} className={`${inputClass} max-w-[11rem]`}>
          <option value="todas">Todas las sedes</option>
          {Object.values(LOCATIONS).map((l) => (
            <option key={l.key} value={l.key}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      {visible.length === 0 ? (
        <p className="py-10 text-center text-sm text-charcoal/60">No hay pedidos con estos filtros.</p>
      ) : (
        <ul className="space-y-3">
          {visible.map((o) => {
            const open = openId === o.id;
            return (
              <li key={o.id} className="rounded-2xl border border-ink/10 bg-cream p-4">
                <button className="flex w-full flex-wrap items-center justify-between gap-3 text-left" onClick={() => setOpenId(open ? null : o.id)} aria-expanded={open}>
                  <span>
                    <span className="block font-medium text-ink">
                      {o.id} · {o.customer.nombre}
                    </span>
                    <span className="block text-xs text-charcoal/60">
                      {new Date(o.createdAt).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })} · Sede {o.sedeLabel}
                    </span>
                  </span>
                  <span className="flex items-center gap-3 text-sm">
                    <span className="text-charcoal/70">
                      {formatCOP(paidTotal(o))} / {formatCOP(o.totals.total)}
                    </span>
                    <StatusBadge order={o} />
                  </span>
                </button>
                {open && <OrderDetail initial={o} onChanged={onChanged} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
