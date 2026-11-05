import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { StoredOrder } from "../shared/orderTypes";
import { ApiError, api, getToken, setToken } from "./api";
import { buildLedger, computeSummary } from "./stats";
import SummaryTab from "./SummaryTab";
import OrdersTab from "./OrdersTab";
import LedgerTab from "./LedgerTab";

type Tab = "resumen" | "pedidos" | "pagos";
const TABS: { key: Tab; label: string }[] = [
  { key: "resumen", label: "Resumen" },
  { key: "pedidos", label: "Pedidos" },
  { key: "pagos", label: "Pagos e ingresos" },
];

function Login({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { token } = await api.login(password);
      setToken(token);
      onLogin();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo entrar.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl border border-ink/10 bg-cream p-8 shadow-card space-y-4">
        <div className="text-center">
          <span className="text-3xl" aria-hidden>
            🕯️
          </span>
          <h1 className="font-serif text-2xl text-ink mt-1">Panel de Luz de Detalles</h1>
          <p className="text-sm text-charcoal/60 mt-1">Solo para administración</p>
        </div>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Clave de administración"
          className="w-full rounded-lg border border-ink/15 bg-ivory px-3.5 py-3 text-sm focus:outline-none focus:border-gold"
          required
        />
        {error && (
          <p className="text-sm text-red-700/90" role="alert">
            {error}
          </p>
        )}
        <button disabled={busy} className="w-full rounded-full bg-ink py-3 text-sm text-cream hover:bg-charcoal disabled:opacity-50">
          {busy ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}

export default function AdminApp() {
  const [authed, setAuthed] = useState(() => !!getToken());
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("resumen");

  useEffect(() => {
    document.title = "Panel · Luz de Detalles";
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.appendChild(meta);
    }
    meta.content = "noindex, nofollow";
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setAuthed(false);
    setOrders([]);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setOrders((await api.list()).orders);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) logout();
      else setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    if (authed) void load();
  }, [authed, load]);

  const summary = useMemo(() => computeSummary(orders), [orders]);
  const ledger = useMemo(() => buildLedger(orders), [orders]);
  const replaceOrder = (o: StoredOrder) => setOrders((prev) => prev.map((x) => (x.id === o.id ? o : x)));

  if (!authed) return <Login onLogin={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-ink/10 bg-cream/95 sticky top-0 z-10 backdrop-blur">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <h1 className="font-serif text-xl md:text-2xl text-ink">Panel · Luz de Detalles</h1>
          <div className="flex items-center gap-3 text-sm">
            <button onClick={load} disabled={loading} className="rounded-full border border-ink/20 px-4 py-1.5 hover:border-gold disabled:opacity-50">
              {loading ? "Actualizando..." : "Actualizar"}
            </button>
            <button onClick={logout} className="text-charcoal/60 underline">
              Salir
            </button>
          </div>
        </div>
        <nav className="max-w-5xl mx-auto px-5 flex gap-1 overflow-x-auto" aria-label="Secciones">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`whitespace-nowrap px-4 py-2.5 text-sm border-b-2 ${tab === t.key ? "border-gold text-ink font-medium" : "border-transparent text-charcoal/60 hover:text-ink"}`}
            >
              {t.label}
              {t.key === "pedidos" && summary.pendingCount > 0 && (
                <span className="ml-2 rounded-full bg-amber-200 px-2 py-0.5 text-xs text-amber-900">{summary.pendingCount}</span>
              )}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-8">
        {error && (
          <p className="mb-6 rounded-xl border border-red-700/30 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
            {error}
          </p>
        )}
        {tab === "resumen" && <SummaryTab summary={summary} />}
        {tab === "pedidos" && <OrdersTab orders={orders} onChanged={replaceOrder} />}
        {tab === "pagos" && <LedgerTab rows={ledger} />}
      </main>
    </div>
  );
}
