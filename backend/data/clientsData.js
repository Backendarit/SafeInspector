/**
 * This file acts as a temporary "database" for the backend.
 * It stores all clients, their sites, and extinguishers.
 * In the future, this can be replaced with an actual SQL or NoSQL database.
 */

const clients = [
  {
    id: "1",
    name: "Sale-R Oy",
    businessId: "1234567-8",
    sites: [
      {
        id: "1",
        name: "Sale Härmälänranta Tampere",
        address: "Lentovarikonkatu 1, 33900 Tampere",
        contact: {
          name: "Maija Menninkäinen",
          phone: "040 123 456",
        },
        inspector: "Tarkastaja1",
        extinguishers: [
          {
            id: "1",
            type: "Tamrex 6kg ABC",
            location: "Backroom",
            manufactureYear: 2018,
            lastInspection: "2023-10-20",
            intervalYears: 2,
            nextInspection: "2025-10-20",
            serviceDue: 2028,
            status: "Inspection Due",
            notes: "",
          },
          {
            id: "2",
            type: "Tamrex 6kg ABC",
            location: "Cashiers",
            manufactureYear: 2016,
            lastInspection: "2023-09-01",
            intervalYears: 2,
            nextInspection: "2025-09-01",
            serviceDue: 2026,
            status: "Late",
            notes: "Test Note",
          },
        ],
      },
      {
        id: "2",
        name: "Sale Hatanpää Tampere",
        address: "Hatanpään puistokuja 29, 33900 Tampere",
        contact: {
          name: "Tarja Menninkäinen",
          phone: "040 123 455",
        },
        inspector: "Tarkastaja1",
        extinguishers: [
          {
            id: "1",
            type: "Tamrex 6kg ABC",
            location: "Backroom",
            manufactureYear: 2018,
            lastInspection: "2024-09-02",
            intervalYears: 2,
            nextInspection: "2026-09-02",
            serviceDue: 2028,
            status: "OK",
            notes: "",
          },
          {
            id: "2",
            type: "Tamrex 12kg ABC",
            location: "Cashiers",
            manufactureYear: 2016,
            lastInspection: "2023-10-02",
            intervalYears: 2,
            nextInspection: "2025-10-02",
            serviceDue: 2026,
            status: "Service Due",
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
        contact: {
          name: "Nelli Matula",
          phone: "040 123 454",
        },
        inspector: "Tarkastaja1",
        extinguishers: [
          {
            id: "1",
            type: "Tamrex 6kg ABC",
            location: "Backroom",
            manufactureYear: 2019,
            lastInspection: "2023-10-02",
            intervalYears: 2,
            nextInspection: "2025-10-02",
            serviceDue: 2029,
            status: "Inspection Due",
            notes: "",
          },
        ],
      },
      {
        id: "2",
        name: "Housing Company Sotkankatu 16",
        address: "Sotkankatu 16, 33230 Tampere",
        contact: {
          name: "Olivia Terttu",
          phone: "040 123 453",
        },
        inspector: "Tarkastaja1",
        extinguishers: [
          {
            id: "1",
            type: "Tamrex 6kg ABC",
            location: "Staircase A",
            manufactureYear: 2018,
            lastInspection: "2025-06-02",
            intervalYears: 2,
            nextInspection: "2027-06-02",
            serviceDue: 2028,
            status: "OK",
            notes: "",
          },
          {
            id: "2",
            type: "Tamrex 6kg ABC",
            location: "Staircase B",
            manufactureYear: 2019,
            lastInspection: "2025-06-02",
            intervalYears: 2,
            nextInspection: "2027-06-02",
            serviceDue: 2029,
            status: "OK",
            notes: "",
          },
        ],
      },
    ],
  },
];

// Export dataset so it can be imported in server.js or routes
module.exports = clients;