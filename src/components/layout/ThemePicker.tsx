"use client";

import React, { useState, useRef, useEffect } from "react";
import { Palette, DarkMode, LightMode, Check } from "@mui/icons-material";
import { useTheme } from "../../context/ThemeContext";

const THEME_COLORS = [
  { name: "Teal", hex: "#0F766E" },
  { name: "Indigo", hex: "#4F46E5" },
  { name: "Purple", hex: "#9333EA" },
  { name: "Rose", hex: "#E11D48" },
  { name: "Orange", hex: "#EA580C" },
  { name: "Blue", hex: "#2563EB" },
  { name: "Emerald", hex: "#10B981" },
  { name: "Pink", hex: "#DB2777" },
  { name: "Violet", hex: "#7C3AED" },
  { name: "Cyan", hex: "#0891B2" },
  { name: "Fuchsia", hex: "#C026D3" }
];

export const ThemePicker: React.FC = () => {
  const { themeColor, darkMode, changeThemeColor, toggleDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full text-text-secondary hover:text-primary-teal hover:bg-primary-teal/5 transition-all duration-200"
        title="Theme Settings"
      >
        <Palette className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-64 bg-card-bg border border-border-ui rounded-xl shadow-xl py-4 px-4 z-50 animate-modal-in">
          <h3 className="text-sm font-bold text-text-primary mb-3">Theme Settings</h3>
          
          <div className="space-y-4">
            {/* Color Picker */}
            <div>
              <p className="text-xs font-semibold text-text-secondary mb-2">Primary Color</p>
              <div className="flex flex-wrap gap-2">
                {THEME_COLORS.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => { changeThemeColor(color.hex); setIsOpen(false); }}
                    className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {themeColor === color.hex && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-border-ui w-full"></div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
                {darkMode ? <DarkMode className="w-4 h-4 text-indigo-400" /> : <LightMode className="w-4 h-4 text-amber-500" />}
                <span>Dark Mode</span>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${darkMode ? 'bg-primary-teal' : 'bg-border-ui'}`}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${darkMode ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
