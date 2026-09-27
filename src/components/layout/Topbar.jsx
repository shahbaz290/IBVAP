import { useEffect, useState } from "react";
import { Bell, ChevronDown, Search, Wifi } from "lucide-react";
import { StatusDot } from "../ui/StatusDot";

export function Topbar({ title }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = now.toLocaleTimeString("en-IN", { hour12: false });
  const dateStr = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <header className="h-16 shrink-0 bg-white border-b border-slate-200 flex items-center justify-between px-5 gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <h2 className="text-base font-semibold text-slate-900 truncate">{title}</h2>
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 border border-slate-200 rounded px-2 py-1">
          <Wifi size={13} className="text-green-600" />
          <span>Feed link stable</span>
        </div>
      </div>

      <div className="flex-1 max-w-lg hidden md:block">
        <div className="relative">
          <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search events, cameras, people, vehicles..."
            className="w-full bg-slate-50 border border-slate-200 rounded px-8 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-600"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="hidden xl:flex items-center gap-2 text-slate-500">
          <span className="text-[11px] uppercase tracking-[0.16em]">System status</span>
          <StatusDot status="online" label="All Systems Operational" showLabel={false} />
        </div>

        <div className="hidden sm:flex flex-col items-end leading-tight">
          <span className="text-sm font-mono font-medium text-slate-900 tabular-nums">{timeStr}</span>
          <span className="text-[11px] text-slate-500">{dateStr} IST</span>
        </div>

        <button className="relative h-9 w-9 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-500 transition-colors">
          <Bell size={17} strokeWidth={1.9} />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-600" />
        </button>

        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F1C2E] text-white text-xs font-semibold shrink-0">
            AS
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-medium text-slate-900">Security Operator</p>
            <div className="flex items-center gap-1">
              <StatusDot status="online" label="On duty" />
            </div>
          </div>
          <ChevronDown size={14} className="hidden sm:block text-slate-400" />
        </div>
      </div>
    </header>
  );
}
