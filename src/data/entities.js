export const people = [
  {
    trackingId: "P-1042",
    thumbnail: "Person",
    firstSeen: "2026-09-12T10:24:12",
    lastSeen: "2026-09-12T10:24:25",
    cameras: "CAM-04 → CAM-05",
    status: "Possible Match",
    confidence: "82%",
  },
  {
    trackingId: "P-883",
    thumbnail: "Person",
    firstSeen: "2026-09-12T10:12:08",
    lastSeen: "2026-09-12T10:13:01",
    cameras: "CAM-03",
    status: "Unknown",
    confidence: "—",
  },
  {
    trackingId: "P-401",
    thumbnail: "Person",
    firstSeen: "2026-09-12T09:55:00",
    lastSeen: "2026-09-12T09:55:45",
    cameras: "CAM-01",
    status: "Unidentified",
    confidence: "—",
  },
];

export const vehicles = [
  {
    vehicleId: "V-021",
    type: "Sedan",
    color: "Silver",
    plate: "DL 9C 8123",
    firstSeen: "2026-09-12T10:18:00",
    lastSeen: "2026-09-12T10:18:42",
    camera: "CAM-02",
  },
  {
    vehicleId: "V-047",
    type: "Truck",
    color: "White",
    plate: "PB 02 4481",
    firstSeen: "2026-09-12T09:48:54",
    lastSeen: "2026-09-12T09:49:31",
    camera: "CAM-03",
  },
];

export const plates = [
  { plate: "DL 9C 8123", owner: "Possible match", camera: "CAM-02", confidence: "81%" },
  { plate: "PB 02 4481", owner: "Status check", camera: "CAM-03", confidence: "74%" },
];
