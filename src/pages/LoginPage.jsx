import { useNavigate } from "react-router-dom";
import { ShieldAlert, Lock, Eye } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#eef2f6] flex items-center justify-center p-6">
      <div className="w-full max-w-6xl overflow-hidden rounded-lg border border-surface-200 bg-white shadow-card">
        <div className="grid md:grid-cols-2 min-h-[720px]">
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.2),_transparent_40%),linear-gradient(135deg,_rgba(15,28,46,0.8),_rgba(15,28,46,0.96))]" />
            <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_96%,rgba(255,255,255,0.05)_100%)] opacity-60" />
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.03)_0,rgba(255,255,255,0.03)_1px,transparent_1px,transparent_5px)]" />
            <div className="relative z-10 h-full flex flex-col justify-between p-10 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-600/90">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-lg font-semibold tracking-tight">IBVAP</p>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-slate-300">DEMO ENVIRONMENT</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="inline-flex items-center rounded border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-blue-100">
                  Intelligent Border Video Analytics Platform
                </div>
                <h1 className="max-w-sm text-3xl font-semibold leading-tight tracking-tight">
                  AI-assisted surveillance for existing CCTV infrastructure
                </h1>
                <p className="max-w-md text-sm text-slate-200">
                  Detection, zone context, directionality, cross-camera continuity, and explainable risk scoring for border operations.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-sm text-slate-100">
                <div className="rounded border border-white/10 bg-white/5 p-3">
                  <div className="text-xl font-semibold">24</div>
                  <div className="text-[11px] text-slate-300">Cameras</div>
                </div>
                <div className="rounded border border-white/10 bg-white/5 p-3">
                  <div className="text-xl font-semibold">12</div>
                  <div className="text-[11px] text-slate-300">Alerts</div>
                </div>
                <div className="rounded border border-white/10 bg-white/5 p-3">
                  <div className="text-xl font-semibold">85</div>
                  <div className="text-[11px] text-slate-300">Risk score</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center bg-white p-8 md:p-12">
            <div className="w-full max-w-md">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Operator access</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-900">Sign In</h2>
              </div>

              <form
                className="space-y-5"
                onSubmit={(event) => {
                  event.preventDefault();
                  navigate("/dashboard");
                }}
              >
                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium text-slate-700">Username</label>
                  <div className="relative">
                    <input
                      id="username"
                      defaultValue="demo.operator"
                      className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2.5 pr-10 text-sm text-slate-900 focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      defaultValue="demo123"
                      className="w-full rounded border border-slate-300 bg-slate-50 px-3 py-2.5 pr-10 text-sm text-slate-900 focus:border-blue-600 focus:bg-white"
                    />
                    <Eye className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-600">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300 text-blue-600" />
                    Remember me
                  </label>
                  <button type="button" className="font-medium text-blue-600 hover:text-blue-700">
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded bg-navy-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800"
                >
                  <Lock className="h-4 w-4" />
                  Sign In
                </button>
              </form>

              <div className="mt-8 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                <div className="font-semibold">Demo Operator</div>
                <div className="mt-1 text-xs text-amber-700">This is DEMO ONLY. Local mock data is used for prototype simulation.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
