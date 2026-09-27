export const kpis = {
  activeAlerts: 4,
  criticalAlerts: 2,
  camerasOnline: 76,
  camerasTotal: 78,
  avgResponseTime: "4m 12s",
  crossingsPrevented7d: 11,
};

export const alertsOverTime = [
  { hour: "00:00", critical: 1, elevated: 0, moderate: 1 },
  { hour: "02:00", critical: 2, elevated: 1, moderate: 0 },
  { hour: "04:00", critical: 0, elevated: 0, moderate: 0 },
  { hour: "06:00", critical: 0, elevated: 1, moderate: 1 },
  { hour: "08:00", critical: 0, elevated: 0, moderate: 2 },
  { hour: "10:00", critical: 0, elevated: 1, moderate: 1 },
  { hour: "12:00", critical: 0, elevated: 0, moderate: 0 },
  { hour: "14:00", critical: 0, elevated: 1, moderate: 0 },
  { hour: "16:00", critical: 0, elevated: 0, moderate: 1 },
  { hour: "18:00", critical: 0, elevated: 1, moderate: 1 },
  { hour: "20:00", critical: 1, elevated: 0, moderate: 0 },
  { hour: "22:00", critical: 0, elevated: 1, moderate: 1 },
];

export const detectionsByType = [
  { type: "Unauthorized Crossing", count: 14 },
  { type: "Loitering", count: 22 },
  { type: "Fence Tampering", count: 6 },
  { type: "Vehicle Anomaly", count: 9 },
  { type: "Abandoned Object", count: 5 },
];

export const sectorRisk = [
  { sector: "Sector 4", score: 34 },
  { sector: "Sector 7", score: 71 },
  { sector: "Sector 11", score: 22 },
  { sector: "Sector 14", score: 88 },
];
