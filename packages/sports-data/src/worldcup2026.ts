import type { SportsDataset } from "./types.js";

const dataset: SportsDataset = {
  tournament: {
    name: "FIFA World Cup 2026",
    edition: 23,
    startDate: "2026-06-11",
    endDate: "2026-07-19",
    hostCountries: ["Canada", "Mexico", "United States"],
    teamCount: 48,
    matchCount: 104
  },
  broadcasters: {
    US: {
      country: "US",
      label: "United States",
      channels: [
        {
          id: "fox.us",
          name: "FOX",
          country: "US",
          language: "English",
          kind: "broadcast",
          website: "https://www.foxsports.com/",
          notes: "Legal viewing path placeholder for US English-language coverage."
        },
        {
          id: "fs1.us",
          name: "FS1",
          country: "US",
          language: "English",
          kind: "broadcast",
          website: "https://www.foxsports.com/",
          notes: "Legal viewing path placeholder for US English-language coverage."
        },
        {
          id: "telemundo.us",
          name: "Telemundo",
          country: "US",
          language: "Spanish",
          kind: "broadcast",
          website: "https://www.telemundo.com/",
          notes: "Legal viewing path placeholder for US Spanish-language coverage."
        },
        {
          id: "peacock.us",
          name: "Peacock",
          country: "US",
          language: "Spanish",
          kind: "streaming",
          website: "https://www.peacocktv.com/",
          notes: "Legal streaming path placeholder for US Spanish-language coverage."
        }
      ]
    },
    CA: {
      country: "CA",
      label: "Canada",
      channels: [
        {
          id: "ctv.ca",
          name: "CTV",
          country: "CA",
          language: "English",
          kind: "broadcast",
          website: "https://www.ctv.ca/",
          notes: "Canada legal viewing placeholder."
        },
        {
          id: "tsn.ca",
          name: "TSN",
          country: "CA",
          language: "English",
          kind: "broadcast",
          website: "https://www.tsn.ca/",
          notes: "Canada legal viewing placeholder."
        }
      ]
    },
    MX: {
      country: "MX",
      label: "Mexico",
      channels: [
        {
          id: "tudn.mx",
          name: "TUDN",
          country: "MX",
          language: "Spanish",
          kind: "broadcast",
          website: "https://www.tudn.com/",
          notes: "Mexico legal viewing placeholder."
        },
        {
          id: "televisa.mx",
          name: "Televisa",
          country: "MX",
          language: "Spanish",
          kind: "broadcast",
          website: "https://www.televisa.com/",
          notes: "Mexico legal viewing placeholder."
        }
      ]
    }
  },
  fixtures: [
    {
      id: "wc26-001",
      stage: "Group Stage",
      status: "scheduled",
      kickoffUtc: "2026-06-11T19:00:00Z",
      homeTeam: "Mexico",
      awayTeam: "South Africa",
      venue: "Estadio Azteca",
      city: "Mexico City",
      country: "Mexico",
      broadcasterIdsByCountry: {
        US: ["fox.us", "telemundo.us", "peacock.us"],
        CA: ["ctv.ca", "tsn.ca"],
        MX: ["tudn.mx", "televisa.mx"]
      }
    },
    {
      id: "wc26-002",
      stage: "Group Stage",
      status: "scheduled",
      kickoffUtc: "2026-06-12T02:00:00Z",
      homeTeam: "United States",
      awayTeam: "Wales",
      venue: "SoFi Stadium",
      city: "Los Angeles",
      country: "United States",
      broadcasterIdsByCountry: {
        US: ["fox.us", "telemundo.us", "peacock.us"],
        CA: ["ctv.ca", "tsn.ca"]
      }
    },
    {
      id: "wc26-003",
      stage: "Group Stage",
      status: "scheduled",
      kickoffUtc: "2026-06-12T19:00:00Z",
      homeTeam: "Canada",
      awayTeam: "Japan",
      venue: "BMO Field",
      city: "Toronto",
      country: "Canada",
      broadcasterIdsByCountry: {
        US: ["fs1.us", "telemundo.us", "peacock.us"],
        CA: ["ctv.ca", "tsn.ca"]
      }
    },
    {
      id: "wc26-004",
      stage: "Group Stage",
      status: "scheduled",
      kickoffUtc: "2026-06-13T22:00:00Z",
      homeTeam: "Brazil",
      awayTeam: "Morocco",
      venue: "MetLife Stadium",
      city: "New York/New Jersey",
      country: "United States",
      broadcasterIdsByCountry: {
        US: ["fox.us", "telemundo.us", "peacock.us"],
        CA: ["tsn.ca"]
      }
    },
    {
      id: "wc26-005",
      stage: "Round of 32",
      status: "unknown",
      kickoffUtc: "2026-06-28T20:00:00Z",
      homeTeam: "Winner Group A",
      awayTeam: "Third Place Group C/D/E",
      venue: "AT&T Stadium",
      city: "Dallas",
      country: "United States",
      broadcasterIdsByCountry: {
        US: ["fox.us", "telemundo.us", "peacock.us"],
        CA: ["ctv.ca", "tsn.ca"]
      }
    },
    {
      id: "wc26-006",
      stage: "Final",
      status: "unknown",
      kickoffUtc: "2026-07-19T19:00:00Z",
      homeTeam: "TBD",
      awayTeam: "TBD",
      venue: "MetLife Stadium",
      city: "New York/New Jersey",
      country: "United States",
      broadcasterIdsByCountry: {
        US: ["fox.us", "telemundo.us", "peacock.us"],
        CA: ["ctv.ca", "tsn.ca"],
        MX: ["tudn.mx", "televisa.mx"]
      }
    }
  ]
};

export function getWorldCup2026Dataset(): SportsDataset {
  return dataset;
}
