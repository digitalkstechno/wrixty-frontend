"use client";

import React, { useEffect } from "react";
import { Close } from "@mui/icons-material";
import { Loader } from "./Loader";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  sizeClass?: string;
  isLoading?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  sizeClass = "max-w-lg",
  isLoading = false
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-sm animate-fade-in">
      <div
        className={`relative w-full ${sizeClass} bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-2xl flex flex-col max-h-[90vh] animate-modal-in overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
          {title ? (
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-50">
              {title}
            </h3>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Close className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="relative p-5 overflow-y-auto flex-1 text-left text-sm text-zinc-650 dark:text-zinc-350">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 dark:bg-zinc-950/60 backdrop-blur-[2px]">
              <Loader size="lg" className="text-indigo-600 dark:text-indigo-500 mb-4" />
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-500 animate-pulse">Processing...</p>
            </div>
          )}
          <div className={isLoading ? "opacity-30 pointer-events-none transition-opacity" : "transition-opacity"}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
