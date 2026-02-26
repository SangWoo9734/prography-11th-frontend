"use client";

import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";

interface ModalContextType {
  isModalOpen: boolean;
  toggleModal: () => void;
}

export const ModalContext = createContext<ModalContextType | null>(null);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within ModalProvider");
  return context;
}

interface ModalProviderProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function ModalProvider({ children, modal }: ModalProviderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function toggleModal() {
    setIsModalOpen((prev) => !prev);
  }

  return (
    <ModalContext value={{ isModalOpen, toggleModal }}>
      {children}
      {isModalOpen && createPortal(modal, document.body)}
    </ModalContext>
  );
}
