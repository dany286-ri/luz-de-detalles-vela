import React, { createContext, useCallback, useContext, useState } from "react";
import { buildWhatsAppLinkForSede, type LocationKey } from "../config/site.config";

interface OrderFlowContextValue {
  /** Pide confirmar la sede y luego abre WhatsApp con este mensaje ya construido. */
  requestWhatsApp: (message: string) => void;
  isModalOpen: boolean;
  confirmSede: (sede: LocationKey) => void;
  cancel: () => void;
}

const OrderFlowContext = createContext<OrderFlowContextValue | undefined>(undefined);

export function OrderFlowProvider({ children }: { children: React.ReactNode }) {
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);

  const requestWhatsApp = useCallback((message: string) => {
    setPendingMessage(message);
  }, []);

  const confirmSede = useCallback(
    (sede: LocationKey) => {
      if (pendingMessage) {
        window.open(buildWhatsAppLinkForSede(sede, pendingMessage), "_blank");
      }
      setPendingMessage(null);
    },
    [pendingMessage]
  );

  const cancel = useCallback(() => setPendingMessage(null), []);

  return (
    <OrderFlowContext.Provider
      value={{ requestWhatsApp, isModalOpen: pendingMessage !== null, confirmSede, cancel }}
    >
      {children}
    </OrderFlowContext.Provider>
  );
}

export function useOrderFlow() {
  const ctx = useContext(OrderFlowContext);
  if (!ctx) throw new Error("useOrderFlow debe usarse dentro de <OrderFlowProvider>");
  return ctx;
}
