"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode
} from "react";

export type AuthView = "login" | "register" | "forgot";

type AuthModalContextValue = {
  isOpen: boolean;
  view: AuthView;
  open: (view?: AuthView) => void;
  close: () => void;
  setView: (view: AuthView) => void;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<AuthView>("login");

  const open = useCallback((next: AuthView = "login") => {
    setView(next);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <AuthModalContext.Provider
      value={{ isOpen, view, open, close, setView }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error("useAuthModal must be used inside <AuthModalProvider>");
  }
  return ctx;
};
