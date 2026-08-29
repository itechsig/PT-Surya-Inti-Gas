import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { subscribeRouteLoading, getRouteLoading } from "../../utils/routeProgress";

export function RouteProgressBar() {
  const loading = useSyncExternalStore(subscribeRouteLoading, getRouteLoading, getRouteLoading);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed top-0 left-0 w-full z-[9999] pointer-events-none"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
        >
          <motion.div
            className="h-[3px]"
            style={{ background: "linear-gradient(90deg, var(--brand-navy) 0%, var(--brand-blue) 50%, var(--brand-sky) 100%)" }}
            initial={{ width: "0%" }}
            animate={{ width: "85%" }}
            exit={{ width: "100%", transition: { duration: 0.25, ease: "easeOut" } }}
            transition={{ duration: 2.2, ease: [0.4, 0, 0.2, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
