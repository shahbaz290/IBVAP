import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { ToastProvider } from "./components/ui/Toast";
import Dashboard from "./pages/Dashboard";
import LiveSurveillance from "./pages/LiveSurveillance";
import Alerts from "./pages/Alerts";
import EventDetails from "./pages/EventDetails";
import EventsPage from "./pages/Events";
import LoginPage from "./pages/LoginPage";
import MapView from "./pages/MapView";
import PeopleVehiclesPage from "./pages/PeopleVehicles";
import CamerasPage from "./pages/Cameras";
import AnalyticsPage from "./pages/Analytics";
import ReportsPage from "./pages/Reports";
import SettingsPage from "./pages/Settings";
import ZonesPage from "./pages/Zones";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/live" element={<LiveSurveillance />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/alerts/:id" element={<EventDetails />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/people" element={<PeopleVehiclesPage />} />
            <Route path="/vehicles" element={<PeopleVehiclesPage />} />
            <Route path="/cameras" element={<CamerasPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/zones" element={<ZonesPage />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}
