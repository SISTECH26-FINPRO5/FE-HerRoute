import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LoginPage } from "./login/page";
import { DashboardPage } from "./dashboard/page";
import MapDashboard from "./map/page";

type Page = "login" | "dashboard" | "map";

export default function App() {
  const [page, setPage] = useState<Page>("login");

  return (
    <AnimatePresence mode="wait">
      {page === "login" ? (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35 }}
        >
          <LoginPage onLogin={() => setPage("dashboard")} />
        </motion.div>
      ) : page === "dashboard" ? (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <DashboardPage
            onLogout={() => setPage("login")}
            onGoToMap={() => setPage("map")}
          />
        </motion.div>
      ) : (
        <motion.div
          key="map"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >

          <MapDashboard onGoToHomepage={() => setPage("dashboard")} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}