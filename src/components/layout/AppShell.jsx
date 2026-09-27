import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const titleMap = {
  "/": "Login",
  "/dashboard": "Dashboard",
  "/live": "Live Surveillance",
  "/alerts": "Alerts",
  "/events": "Events",
  "/map": "Map View",
  "/people": "People & Vehicles",
  "/vehicles": "People & Vehicles",
  "/cameras": "Cameras",
  "/analytics": "Analytics",
  "/reports": "Reports",
  "/settings": "Settings",
  "/zones": "Zone Configuration",
};

function resolveTitle(pathname) {
  if (titleMap[pathname]) return titleMap[pathname];
  if (pathname.startsWith("/alerts/")) return "Event Details";
  if (pathname.startsWith("/events/")) return "Event Details";
  return "IBVAP";
}

export function AppShell() {
  const location = useLocation();
  const title = resolveTitle(location.pathname);

  return (
    <div className="h-screen w-screen flex bg-slate-100 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
