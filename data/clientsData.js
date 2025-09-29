//  Calculates next inspection + service due
function calculateExtinguisherData(extinguisher) {
  const manufactureYear = extinguisher.manufactureYear;
  const intervalYears = extinguisher.intervalYears;
  const lastInspection = new Date(extinguisher.lastInspection);

  // Service due = manufactureYear + 10
  const serviceDue = manufactureYear + 10;

  // Next inspection = lastInspection + intervalYears
  const nextInspection = new Date(
    lastInspection.setFullYear(lastInspection.getFullYear() + intervalYears)
  )
    .toISOString()
    .split("T")[0]; // YYYY-MM-DD

  return {
    ...extinguisher,
    serviceDue,
    nextInspection,
  };
}

// Raw clients (without manually written nextInspection/serviceDue)
const rawClients = [
  {
    id: "1",
    name: "Sale-R Oy",
    businessId: "1234567-8",
    sites: [
      {
        id: "1",
        name: "Sale Härmälänranta Tampere",
        address: "Lentovarikonkatu 1, 33900 Tampere",
        contact: { name: "Maija Menninkäinen", phone: "040 123 456" },
        extinguishers: [
          {
            id: "1",
            type: "Tamrex 6kg ABC",
            location: "Backroom",
            manufactureYear: 2018,
            lastInspection: "2023-09-01",
            intervalYears: 2,
            status: "OK",
            notes: "",
          },
          {
            id: "2",
            type: "Tamrex 6kg ABC",
            location: "Cashiers",
            manufactureYear: 2016,
            lastInspection: "2023-09-01",
            intervalYears: 2,
            status: "Needs service",
            notes: "1-year label or send to service",
          },
        ],
      },
      {
        id: "2",
        name: "Sale Hatanpää Tampere",
        address: "Hatanpään puistokuja 29, 33900 Tampere",
        contact: { name: "Tarja Menninkäinen", phone: "040 123 455" },
        extinguishers: [
          {
            id: "1",
            type: "Tamrex 6kg ABC",
            location: "Backroom",
            manufactureYear: 2018,
            lastInspection: "2023-09-02",
            intervalYears: 2,
            status: "OK",
            notes: "",
          },
          {
            id: "2",
            type: "Tamrex 12kg ABC",
            location: "Cashiers",
            manufactureYear: 2016,
            lastInspection: "2023-09-02",
            intervalYears: 2,
            status: "Needs service",
            notes: "1-year label or send to service",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Property Management Tampere",
    businessId: "1234567-8",
    sites: [
      {
        id: "1",
        name: "Housing Company Aktuaari",
        address: "Kortelahdenkatu 15, 33210 Tampere",
        contact: { name: "Nelli Matula", phone: "040 123 454" },
        extinguishers: [
          {
            id: "1",
            type: "Tamrex 6kg ABC",
            location: "Backroom",
            manufactureYear: 2019,
            lastInspection: "2023-10-02",
            intervalYears: 2,
            status: "OK",
            notes: "",
          },
        ],
      },
      {
        id: "2",
        name: "Housing Company Sotkankatu 16",
        address: "Sotkankatu 16, 33230 Tampere",
        contact: { name: "Olivia Terttu", phone: "040 123 453" },
        extinguishers: [
          {
            id: "1",
            type: "Tamrex 6kg ABC",
            location: "Staircase A",
            manufactureYear: 2018,
            lastInspection: "2025-06-02",
            intervalYears: 2,
            status: "OK",
            notes: "",
          },
          {
            id: "2",
            type: "Tamrex 6kg ABC",
            location: "Staircase B",
            manufactureYear: 2016,
            lastInspection: "2025-06-02",
            intervalYears: 2,
            status: "Needs service",
            notes: "1-year label or send to service",
          },
        ],
      },
    ],
  },
];

// Export for all extinguishers to have calculated fields
export const clients = rawClients.map((client) => ({
  ...client,
  sites: client.sites.map((site) => ({
    ...site,
    extinguishers: site.extinguishers.map((ext) =>
      calculateExtinguisherData(ext)
    ),
  })),
}));
