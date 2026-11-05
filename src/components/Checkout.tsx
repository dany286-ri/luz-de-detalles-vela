import React, { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "../context/CartContext";
import { LOCATIONS, SITE_CONFIG, buildWhatsAppLinkForSede, formatCOP, type LocationKey } from "../config/site.config";
import { calcOrderTotals } from "../utils/pricing";
import {
  loadDraft,
  minDeliveryDate,
  saveDraft,
  saveLastOrder,
  submitOrder,
  validateCustomer,
  type CustomerData,
  type CustomerErrors,
  type OrderRecord,
} from "../utils/orders";
import PaymentCard from "./checkout/PaymentCard";
import OrderSummary from "./checkout/OrderSummary";

type Step = 1 | 2 | 3;
type SendStatus = "idle" | "sending" | "error";

function prettyDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });
}

const STEP_LABELS = ["Tus datos", "Pago", "Listo"];

const inputClass =
  "w-full rounded-lg border bg-ivory px-3.5 py-2.5 text-sm text-ink placeholder:text-charcoal/40 focus:outline-none focus:border-gold transition-colors";

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-ink mb-1.5">{label}</span>
      {children}
      {hint && !error && <span className="block text-xs text-charcoal/50 mt-1">{hint}</span>}
      {error && (
        <span className="block text-xs text-red-700/80 mt-1" role="alert">
          {error}
        </span>
      )}
    </label>
  );
}

/**
 * Compra guiada en 3 pasos dentro de la misma página:
 * 1) datos + sede  2) pago por Nequi de la sede elegida  3) pedido registrado (pendiente de verificación).
 */
export default function Checkout() {
  const { items, isCheckoutOpen, closeCheckout, clearCart } = useCart();

  const [step, setStep] = useState<Step>(1);
  const [customer, setCustomer] = useState<CustomerData>(() => loadDraft().customer);
  const [sede, setSede] = useState<LocationKey | null>(() => loadDraft().sede);
  const [errors, setErrors] = useState<CustomerErrors>({});
  const [confirmed, setConfirmed] = useState(false);
  const [status, setStatus] = useState<SendStatus>("idle");
  const [sendError, setSendError] = useState("");
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.product.price * i.quantity, 0), [items]);
  const totals = useMemo(() => calcOrderTotals(subtotal), [subtotal]);

  // Guarda lo que la persona va escribiendo para no perderlo si cierra la ventana.
  useEffect(() => {
    saveDraft({ customer, sede });
  }, [customer, sede]);

  // Cada paso nuevo empieza arriba del todo.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [step]);

  useEffect(() => {
    if (isCheckoutOpen) document.body.style.overflow = "hidden";
    return () => {
      if (isCheckoutOpen) document.body.style.overflow = "";
    };
  }, [isCheckoutOpen]);

  // Al abrir una compra nueva (con productos), se empieza desde el paso 1.
  useEffect(() => {
    if (isCheckoutOpen && !order) {
      setStep(1);
      setStatus("idle");
      setConfirmed(false);
    }
  }, [isCheckoutOpen, order]);

  if (!isCheckoutOpen) return null;

  const update = (key: keyof CustomerData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomer((c) => ({ ...c, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const chooseSede = (key: LocationKey) => {
    setSede(key);
    if (errors.sede) setErrors((er) => ({ ...er, sede: undefined }));
  };

  const goToPayment = () => {
    const found = validateCustomer(customer, sede, items);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!sede || !confirmed || status === "sending") return;
    setStatus("sending");
    setSendError("");
    try {
      const record = await submitOrder(items, customer, sede);
      saveLastOrder(record);
      setOrder(record);
      clearCart();
      setStep(3);
      setStatus("idle");
    } catch (err) {
      setSendError(err instanceof Error ? err.message : "No pudimos registrar tu pedido.");
      setStatus("error");
    }
  };

  const finish = () => {
    // Cierra la compra terminada y deja todo listo para un pedido nuevo.
    setOrder(null);
    setConfirmed(false);
    setStep(1);
    closeCheckout();
  };

  /** WhatsApp de la sede elegida, con el número de pedido para que el comprobante se asocie fácil. */
  const receiptWhatsApp = (record: OrderRecord) => {
    const msg = [
      `Hola, te envío el comprobante de pago de mi pedido ${record.id} en ${SITE_CONFIG.BRAND_NAME}.`,
      `Nombre: ${record.customer.nombre.trim()}`,
      `Anticipo pagado por Nequi: ${formatCOP(record.totals.deposit)}`,
      record.photoCount > 0 ? "Ya subí las fotos de mis velas en la página." : "",
      "(Adjunto la captura del comprobante en este chat)",
    ]
      .filter(Boolean)
      .join("\n");
    return buildWhatsAppLinkForSede(record.sede, msg);
  };

  const emptyCart = items.length === 0 && !order;

  return (
    <div className="fixed inset-0 z-[85] flex items-end md:items-center justify-center" role="dialog" aria-modal="true" aria-label="Finalizar pedido">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={step === 3 ? finish : closeCheckout} />

      <div className="relative flex w-full max-h-[94dvh] md:max-h-[90vh] md:max-w-2xl flex-col rounded-t-3xl md:rounded-3xl bg-cream shadow-soft animate-popIn">
        {/* Encabezado + pasos */}
        <div className="px-5 md:px-7 pt-5 pb-4 border-b border-ink/10">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl md:text-2xl text-ink">Finalizar pedido</h2>
            <button
              onClick={step === 3 ? finish : closeCheckout}
              aria-label="Cerrar"
              className="text-xl text-charcoal/60 hover:text-ink"
            >
              ✕
            </button>
          </div>
          <ol className="mt-4 flex items-center gap-2">
            {STEP_LABELS.map((label, i) => {
              const n = (i + 1) as Step;
              const active = n === step;
              const done = n < step;
              return (
                <li key={label} className="flex flex-1 items-center gap-2 last:flex-none">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                      active || done ? "bg-ink text-cream" : "bg-beige text-charcoal/60"
                    }`}
                  >
                    {done ? "✓" : n}
                  </span>
                  <span className={`text-xs ${active ? "text-ink font-medium" : "text-charcoal/50"}`}>{label}</span>
                  {i < STEP_LABELS.length - 1 && <span className="h-px flex-1 bg-ink/15" />}
                </li>
              );
            })}
          </ol>
        </div>

        {/* Contenido */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 md:px-7 py-6 space-y-6">
          {emptyCart && (
            <div className="py-10 text-center text-charcoal/60 text-sm">
              <p>Tu pedido está vacío. Agrega un detalle del catálogo para continuar.</p>
            </div>
          )}

          {/* PASO 1: datos + sede */}
          {step === 1 && !emptyCart && (
            <>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.cartId} className="flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0 truncate text-charcoal/80">
                      {item.quantity} × {item.product.name}
                      <span className="text-charcoal/45"> · {item.product.presentation}</span>
                      {item.photos && item.photos.length > 0 && (
                        <span className="text-gold"> · 📷 {item.photos.length}</span>
                      )}
                    </span>
                    <span className="shrink-0 text-ink">{formatCOP(item.product.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>

              {errors.items && (
                <p className="rounded-xl border border-red-700/30 bg-red-50 px-4 py-3 text-sm text-red-800/90" role="alert">
                  {errors.items}
                </p>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nombre completo" error={errors.nombre}>
                  <input
                    type="text"
                    autoComplete="name"
                    value={customer.nombre}
                    onChange={update("nombre")}
                    placeholder="Ej. María Pérez"
                    className={`${inputClass} ${errors.nombre ? "border-red-700/50" : "border-ink/15"}`}
                  />
                </Field>
                <Field label="Celular / WhatsApp" error={errors.celular}>
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={customer.celular}
                    onChange={update("celular")}
                    placeholder="3001234567"
                    className={`${inputClass} ${errors.celular ? "border-red-700/50" : "border-ink/15"}`}
                  />
                </Field>
                <Field label="Correo (opcional)" error={errors.correo}>
                  <input
                    type="email"
                    autoComplete="email"
                    value={customer.correo}
                    onChange={update("correo")}
                    placeholder="tucorreo@ejemplo.com"
                    className={`${inputClass} ${errors.correo ? "border-red-700/50" : "border-ink/15"}`}
                  />
                </Field>
                <Field
                  label="¿Para qué fecha lo necesitas?"
                  error={errors.fechaEntrega}
                  hint={`Mínimo ${SITE_CONFIG.MIN_LEAD_DAYS} días de anticipación.`}
                >
                  <input
                    type="date"
                    min={minDeliveryDate()}
                    value={customer.fechaEntrega}
                    onChange={update("fechaEntrega")}
                    className={`${inputClass} ${errors.fechaEntrega ? "border-red-700/50" : "border-ink/15"}`}
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Dirección o barrio de entrega" error={errors.direccion}>
                    <input
                      type="text"
                      autoComplete="street-address"
                      value={customer.direccion}
                      onChange={update("direccion")}
                      placeholder="Calle, número, barrio y ciudad"
                      className={`${inputClass} ${errors.direccion ? "border-red-700/50" : "border-ink/15"}`}
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Notas para tu pedido (opcional)">
                    <textarea
                      rows={2}
                      value={customer.notas}
                      onChange={update("notas")}
                      placeholder="Algo que debamos saber"
                      className={`${inputClass} border-ink/15 resize-none`}
                    />
                  </Field>
                </div>
              </div>

              {/* Sede */}
              <div>
                <p className="text-xs font-medium text-ink mb-1.5">¿Desde qué sede haces tu pedido?</p>
                <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Sede del pedido">
                  {Object.values(LOCATIONS).map((loc) => {
                    const selected = sede === loc.key;
                    return (
                      <button
                        key={loc.key}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => chooseSede(loc.key)}
                        className={`rounded-2xl border-2 px-4 py-4 text-center transition-all ${
                          selected ? "border-ink bg-ink text-cream shadow-card" : "border-ink/15 bg-cream text-ink hover:border-gold"
                        }`}
                      >
                        <span className="block text-xl" aria-hidden>
                          📍
                        </span>
                        <span className="block text-sm font-medium mt-1">{loc.label}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.sede && (
                  <p className="text-xs text-red-700/80 mt-2" role="alert">
                    {errors.sede}
                  </p>
                )}
                <p className="text-xs text-charcoal/50 mt-2">
                  La sede define a qué Nequi vas a transferir. Lo verás en el siguiente paso.
                </p>
              </div>

              <OrderSummary totals={totals} />
            </>
          )}

          {/* PASO 2: pago */}
          {step === 2 && sede && !emptyCart && (
            <>
              <PaymentCard sede={sede} onChangeSede={chooseSede} totals={totals} />
              <OrderSummary totals={totals} />
              <div className="rounded-2xl border border-[#25D366]/40 bg-[#25D366]/10 p-4">
                <p className="text-sm font-medium text-ink">📲 Envía tu comprobante por WhatsApp</p>
                <p className="text-xs text-charcoal/70 mt-1 leading-relaxed">
                  Después de transferir, toma una captura del comprobante y envíala por WhatsApp a la sede{" "}
                  <strong>{LOCATIONS[sede].label}</strong>. Al enviar tu pedido te daremos el botón directo, con tu
                  número de pedido ya escrito.
                </p>
              </div>

              <label className="flex items-start gap-3 rounded-2xl border border-ink/10 bg-ivory/60 p-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#2B2724]"
                />
                <span className="text-sm text-charcoal/80">
                  <span className="block text-ink font-medium">Ya realicé la transferencia del anticipo</span>
                  <span className="block text-xs text-charcoal/60 mt-0.5">
                    Esto no confirma el pago: tu pedido queda «{`Pendiente de verificación`}» hasta que recibamos tu
                    comprobante por WhatsApp y revisemos la transferencia.
                  </span>
                </span>
              </label>

              {status === "error" && (
                <div className="rounded-xl border border-red-700/30 bg-red-50 px-4 py-3 text-sm text-red-800/90" role="alert">
                  {sendError || "No pudimos registrar tu pedido. Revisa tu conexión e intenta de nuevo."}{" "}
                  <a
                    className="underline"
                    target="_blank"
                    rel="noreferrer"
                    href={buildWhatsAppLinkForSede(sede, `Hola, tuve un problema al enviar mi pedido en ${SITE_CONFIG.BRAND_NAME}.`)}
                  >
                    Escríbenos por WhatsApp
                  </a>
                  .
                </div>
              )}
            </>
          )}

          {/* PASO 3: pedido registrado */}
          {step === 3 && order && (
            <div className="text-center space-y-5 py-2">
              <span className="text-4xl inline-block animate-flicker" aria-hidden>
                🕯️
              </span>
              <div>
                <h3 className="font-serif text-2xl md:text-3xl text-ink">¡Recibimos tu pedido!</h3>
                <p className="text-sm text-charcoal/70 mt-2">
                  Tu pedido quedó <strong className="text-ink">pendiente de verificación</strong>. Lo confirmaremos
                  cuando revisemos tu anticipo de {formatCOP(order.totals.deposit)}.
                </p>
              </div>

              <div className="rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3 inline-block">
                <p className="text-xs uppercase tracking-[0.2em] text-cocoa">Número de pedido</p>
                <p className="font-serif text-2xl text-ink tracking-wider select-all">{order.id}</p>
              </div>

              <div className="text-left">
                <OrderSummary totals={order.totals} registered />
              </div>

              <ul className="text-left text-sm text-charcoal/75 space-y-1.5">
                <li>• Sede: {order.sedeLabel}</li>
                <li>• Entrega solicitada para el {prettyDate(order.customer.fechaEntrega)}</li>
                {order.photoCount > 0 && <li>• Fotos recibidas: {order.photoCount} 📷</li>}
              </ul>

              <div className="rounded-2xl border border-[#25D366]/50 bg-[#25D366]/10 p-5 text-left">
                <p className="text-sm font-medium text-ink">Último paso: envía tu comprobante por WhatsApp</p>
                <p className="text-xs text-charcoal/70 mt-1 leading-relaxed">
                  Tu pedido no se confirma hasta que recibamos el comprobante de tu transferencia de{" "}
                  {formatCOP(order.totals.deposit)} y la verifiquemos.
                </p>
                <a
                  href={receiptWhatsApp(order)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 text-sm font-medium text-white hover:brightness-95 transition"
                >
                  Enviar comprobante a la sede {order.sedeLabel}
                </a>
                <p className="text-xs text-charcoal/55 mt-2 text-center">Guarda tu número de pedido: {order.id}</p>
              </div>
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="border-t border-ink/10 px-5 md:px-7 py-4 flex items-center gap-3">
          {step === 1 && !emptyCart && (
            <button
              onClick={goToPayment}
              className="w-full bg-ink text-cream py-3.5 rounded-full text-sm tracking-wide hover:bg-charcoal transition-colors"
            >
              Continuar al pago
            </button>
          )}
          {step === 2 && (
            <>
              <button
                onClick={() => setStep(1)}
                disabled={status === "sending"}
                className="px-5 py-3.5 rounded-full text-sm border border-ink/20 text-ink hover:border-ink transition-colors disabled:opacity-50"
              >
                Volver
              </button>
              <button
                onClick={handleSubmit}
                disabled={!confirmed || status === "sending" || !sede}
                className="flex-1 bg-ink text-cream py-3.5 rounded-full text-sm tracking-wide hover:bg-charcoal transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {status === "sending" ? "Enviando tu pedido..." : "Enviar mi pedido"}
              </button>
            </>
          )}
          {step === 3 && (
            <button
              onClick={finish}
              className="w-full bg-ink text-cream py-3.5 rounded-full text-sm tracking-wide hover:bg-charcoal transition-colors"
            >
              Seguir explorando
            </button>
          )}
          {emptyCart && (
            <button
              onClick={closeCheckout}
              className="w-full bg-ink text-cream py-3.5 rounded-full text-sm tracking-wide hover:bg-charcoal transition-colors"
            >
              Volver al catálogo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
