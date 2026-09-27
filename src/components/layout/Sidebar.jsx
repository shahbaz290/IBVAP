import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Video,
  ShieldAlert,
  Map,
  Camera,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  BarChart3,
  FileText,
  Users,
  MapPinned,
  BellDot,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/live", label: "Live Surveillance", icon: Video },
  { to: "/alerts", label: "Alerts", icon: ShieldAlert, badge: 12 },
  { to: "/events", label: "Events", icon: BellDot },
  { to: "/map", label: "Map View", icon: Map },
  { to: "/people", label: "People & Vehicles", icon: Users },
  { to: "/cameras", label: "Cameras", icon: Camera },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/zones", label: "Zones", icon: MapPinned },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden md:flex flex-col bg-[#0F1C2E] text-white shrink-0 transition-all duration-200 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="h-16 flex items-center gap-2.5 px-4 border-b border-slate-800 shrink-0">
        <div className="w-9 h-9 rounded-md bg-blue-600 flex items-center justify-center shrink-0">
          <ShieldAlert size={18} strokeWidth={2.25} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight tracking-tight">IBVAP</p>
            <p className="text-[10px] text-slate-300 leading-tight uppercase tracking-[0.18em]">
              Border Surveillance
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === "/dashboard"}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-2.5 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-200 hover:bg-slate-900 hover:text-white"
              } ${collapsed ? "justify-center" : ""}`
            }
          >
            <item.icon size={17} strokeWidth={1.9} className="shrink-0" />
            {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
            {!collapsed && item.badge && (
              <span className="text-[10px] font-semibold bg-red-600 text-white rounded px-1.5 py-0.5 leading-none">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-2 space-y-2">
        <div className="flex items-center gap-3 px-2.5 py-2 text-slate-200 text-sm">
          <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
          {!collapsed && <span>System Status</span>}
        </div>
        {!collapsed && (
          <div className="px-2.5 pb-2 text-xs text-slate-300">● All Systems Operational</div>
        )}

        <div className="px-2.5 py-2 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-white">
              AS
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">AS</p>
                <p className="text-[11px] text-slate-300">Security Operator</p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-full flex items-center gap-3 px-2.5 py-2 rounded-md text-sm text-slate-200 hover:bg-slate-900 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronsRight size={17} /> : <><ChevronsLeft size={17} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
