"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useUI } from "@/lib/ui";
import { CheckIcon } from "@/components/ui/icons";

/** Short confirmation messages (“Added to your quote list”), announced politely. */
export function Toast() {
  const toast = useUI((u) => u.toast);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!toast) return;
    setVisible(true);
    const id = window.setTimeout(() => setVisible(false), 2200);
    return () => window.clearTimeout(id);
  }, [toast]);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-20 z-[70] flex justify-center px-4">
      <AnimatePresence>
        {visible && toast && (
          <motion.p
            key={toast.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 rounded-full border bg-elev/95 px-4 py-2.5 text-sm text-fg shadow-xl backdrop-blur-xl hairline"
          >
            <CheckIcon size={16} className="text-electric" />
            {toast.text}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
