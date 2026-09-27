export const events = [
  {
    id: "EVT-2026-001042",
    time: "2026-09-12T10:24:12",
    type: "Unauthorized Entry",
    camera: "CAM-04",
    entity: "P-1042",
    risk: "HIGH",
    status: "NEW",
    zone: "Restricted Zone B",
  },
  {
    id: "EVT-2026-001041",
    time: "2026-09-12T10:18:42",
    type: "Vehicle in Restricted Zone",
    camera: "CAM-02",
    entity: "V-021",
    risk: "HIGH",
    status: "ACKNOWLEDGED",
    zone: "Patrol Road",
  },
  {
    id: "EVT-2026-001040",
    time: "2026-09-12T10:12:09",
    type: "Loitering Detected",
    camera: "CAM-03",
    entity: "P-883",
    risk: "MEDIUM",
    status: "REVIEWED",
    zone: "Watch Tower Area",
  },
  {
    id: "EVT-2026-001039",
    time: "2026-09-12T09:55:30",
    type: "Wrong Direction Movement",
    camera: "CAM-01",
    entity: "P-401",
    risk: "MEDIUM",
    status: "RESOLVED",
    zone: "Border Fence - North",
  },
  {
    id: "EVT-2026-001038",
    time: "2026-09-12T09:40:14",
    type: "Multiple Persons Detected",
    camera: "CAM-04",
    entity: "P-1183",
    risk: "LOW",
    status: "RESOLVED",
    zone: "Restricted Zone B",
  },
];

export const riskOrder = ["HIGH", "MEDIUM", "LOW"];

export const eventStatusMeta = {
  NEW: { label: "NEW", color: "red" },
  ACKNOWLEDGED: { label: "ACKNOWLEDGED", color: "amber" },
  REVIEWED: { label: "REVIEWED", color: "blue" },
  RESOLVED: { label: "RESOLVED", color: "green" },
};

export const eventRiskMeta = {
  HIGH: { label: "High", color: "red" },
  MEDIUM: { label: "Medium", color: "amber" },
  LOW: { label: "Low", color: "blue" },
};
