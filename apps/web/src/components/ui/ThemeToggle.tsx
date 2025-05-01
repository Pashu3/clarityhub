"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="flex items-center space-x-1 rounded-lg border bg-card p-1">
      {["light", "dark", "system"].map((t) => (
        <motion.button
          key={t}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTheme(t)}
          className={`rounded-md px-2 py-1.5 ${
            theme === t
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted"
          }`}
          title={`Switch to ${t} theme`}
        >
          {t === "light" && <Sun size={16} />}
          {t === "dark" && <Moon size={16} />}
          {t === "system" && <Monitor size={16} />}
        </motion.button>
      ))}
    </div>
  );
}