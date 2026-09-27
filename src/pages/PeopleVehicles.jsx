import { useState } from "react";
import { Search, UserRound, CarFront, ScanLine } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { PageHeader } from "../components/ui/PageHeader";
import { people, vehicles, plates } from "../data/entities";

const tabs = ["People", "Vehicles", "License Plates"];

export default function PeopleVehiclesPage() {
  const [activeTab, setActiveTab] = useState("People");
  const [query, setQuery] = useState("");
  const normalizedQuery = query.toLowerCase();
  const filteredPeople = people.filter((person) => `${person.trackingId} ${person.cameras} ${person.status}`.toLowerCase().includes(normalizedQuery));
  const filteredVehicles = vehicles.filter((vehicle) => `${vehicle.vehicleId} ${vehicle.type} ${vehicle.color} ${vehicle.plate} ${vehicle.camera}`.toLowerCase().includes(normalizedQuery));
  const filteredPlates = plates.filter((plate) => `${plate.plate} ${plate.owner} ${plate.camera}`.toLowerCase().includes(normalizedQuery));
  const counts = { People: people.length, Vehicles: vehicles.length, "License Plates": plates.length };

  return (
    <div>
      <PageHeader title="People & Vehicles" subtitle="Cross-camera entity tracks and plate recognition matches" />

      <Card padded={false}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3"><div className="text-sm font-medium text-slate-700">Tracking records</div><div className="relative w-full sm:w-72"><Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search IDs, camera, plate" className="w-full border border-slate-200 py-2 pl-8 pr-3 text-sm outline-none focus:border-blue-600" /></div></div>

        <div className="p-4">
          <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Tracking record types">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                role="tab"
                aria-selected={activeTab === tab}
                className={`rounded border px-3 py-1.5 text-xs font-medium transition ${
                  activeTab === tab
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab} <span className="ml-1 opacity-70">{counts[tab]}</span>
              </button>
            ))}
          </div>

          {activeTab === "People" && (
            <div className="space-y-3">
              {filteredPeople.map((person) => (
                <div key={person.trackingId} className="flex flex-wrap items-center justify-between gap-3 rounded border border-slate-200 bg-white p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded bg-slate-100 text-slate-500">
                      <UserRound size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{person.trackingId}</div>
                      <div className="text-xs text-slate-500">{person.cameras}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <div><div className="font-medium text-slate-700">Match</div><div>{person.confidence}</div></div>
                    <div>
                      <div className="font-medium text-slate-700">First Seen</div>
                      <div>{formatTime(person.firstSeen)}</div>
                    </div>
                    <div>
                      <div className="font-medium text-slate-700">Last Seen</div>
                      <div>{formatTime(person.lastSeen)}</div>
                    </div>
                    <Badge color={person.status === "Possible Match" ? "blue" : "gray"}>{person.status}</Badge>
                  </div>
                </div>
              ))}
              {filteredPeople.length === 0 && <EmptyState query={query} />}
            </div>
          )}

          {activeTab === "Vehicles" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-3 py-2">Vehicle ID</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Color</th>
                    <th className="px-3 py-2">License Plate</th>
                    <th className="px-3 py-2">First Seen</th>
                    <th className="px-3 py-2">Last Seen</th>
                    <th className="px-3 py-2">Camera</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.vehicleId} className="text-slate-700">
                      <td className="px-3 py-2 font-medium text-slate-900"><span className="inline-flex items-center gap-2"><CarFront size={15} className="text-slate-400" />{vehicle.vehicleId}</span></td>
                      <td className="px-3 py-2">{vehicle.type}</td>
                      <td className="px-3 py-2">{vehicle.color}</td>
                      <td className="px-3 py-2">{vehicle.plate}</td>
                      <td className="px-3 py-2">{formatTime(vehicle.firstSeen)}</td>
                      <td className="px-3 py-2">{formatTime(vehicle.lastSeen)}</td>
                      <td className="px-3 py-2">{vehicle.camera}</td>
                    </tr>
                  ))}
                  {filteredVehicles.length === 0 && <tr><td colSpan={7} className="px-3 py-8 text-center text-sm text-slate-500">No vehicles match this search.</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "License Plates" && (
            <div className="space-y-3">
              {filteredPlates.map((plate) => (
                <div key={plate.plate} className="flex items-center justify-between rounded border border-slate-200 bg-white p-3">
                  <div>
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"><ScanLine size={15} className="text-slate-400" />{plate.plate}</div>
                    <div className="text-xs text-slate-500">Camera {plate.camera}</div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>{plate.owner}</span>
                    <Badge color="blue">{plate.confidence}</Badge>
                  </div>
                </div>
              ))}
              {filteredPlates.length === 0 && <EmptyState query={query} />}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function EmptyState({ query }) {
  return <div className="rounded border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500">{query ? "No records match this search." : "No records are available."}</div>;
}

function formatTime(value) {
  return new Date(value).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
}
