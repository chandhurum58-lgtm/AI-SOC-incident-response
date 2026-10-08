export interface CityNode {
  id: string;
  name: string;
  district: string;
  state: string;
  country: string;
  countryFlag: string;
  lat: number;
  lng: number;
  zoom: number;
  isCapital?: boolean;
  population?: string;
}

export interface DistrictNode {
  id: string;
  name: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  zoom: number;
  cities: CityNode[];
}

export interface StateNode {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  zoom: number;
  districts: DistrictNode[];
}

export interface CountryNode {
  id: string;
  flag: string;
  name: string;
  continent: string;
  capital: string;
  lat: number;
  lng: number;
  zoom: number;
  states: StateNode[];
}

export const GEO_HIERARCHY: CountryNode[] = [
  {
    id: 'us',
    flag: '🇺🇸',
    name: 'United States',
    continent: 'North America',
    capital: 'Washington, D.C.',
    lat: 38.8951,
    lng: -77.0364,
    zoom: 4.5,
    states: [
      {
        id: 'us-dc',
        name: 'District of Columbia',
        country: 'United States',
        lat: 38.9072,
        lng: -77.0369,
        zoom: 11,
        districts: [
          {
            id: 'us-dc-central',
            name: 'Capital Federal District',
            state: 'District of Columbia',
            country: 'United States',
            lat: 38.8951,
            lng: -77.0364,
            zoom: 13,
            cities: [
              {
                id: 'us-dc-wash',
                name: 'Washington, D.C.',
                district: 'Capital Federal District',
                state: 'District of Columbia',
                country: 'United States',
                countryFlag: '🇺🇸',
                lat: 38.8951,
                lng: -77.0364,
                zoom: 13.5,
                isCapital: true,
                population: '712,000'
              }
            ]
          }
        ]
      },
      {
        id: 'us-ny',
        name: 'New York',
        country: 'United States',
        lat: 42.1657,
        lng: -74.9481,
        zoom: 7.5,
        districts: [
          {
            id: 'us-ny-manhattan',
            name: 'New York County (Manhattan)',
            state: 'New York',
            country: 'United States',
            lat: 40.7831,
            lng: -73.9712,
            zoom: 12.5,
            cities: [
              {
                id: 'us-ny-nyc',
                name: 'New York City',
                district: 'New York County (Manhattan)',
                state: 'New York',
                country: 'United States',
                countryFlag: '🇺🇸',
                lat: 40.7128,
                lng: -74.0060,
                zoom: 13,
                population: '8.33 Million'
              }
            ]
          },
          {
            id: 'us-ny-albany-dist',
            name: 'Albany County',
            state: 'New York',
            country: 'United States',
            lat: 42.6526,
            lng: -73.7562,
            zoom: 12,
            cities: [
              {
                id: 'us-ny-albany',
                name: 'Albany',
                district: 'Albany County',
                state: 'New York',
                country: 'United States',
                countryFlag: '🇺🇸',
                lat: 42.6526,
                lng: -73.7562,
                zoom: 13,
                population: '98,000'
              }
            ]
          }
        ]
      },
      {
        id: 'us-ca',
        name: 'California',
        country: 'United States',
        lat: 36.7783,
        lng: -119.4179,
        zoom: 6.5,
        districts: [
          {
            id: 'us-ca-la-county',
            name: 'Los Angeles County',
            state: 'California',
            country: 'United States',
            lat: 34.0522,
            lng: -118.2437,
            zoom: 11.5,
            cities: [
              {
                id: 'us-ca-la',
                name: 'Los Angeles',
                district: 'Los Angeles County',
                state: 'California',
                country: 'United States',
                countryFlag: '🇺🇸',
                lat: 34.0522,
                lng: -118.2437,
                zoom: 12.5,
                population: '3.98 Million'
              }
            ]
          },
          {
            id: 'us-ca-sf-county',
            name: 'San Francisco County',
            state: 'California',
            country: 'United States',
            lat: 37.7749,
            lng: -122.4194,
            zoom: 12.5,
            cities: [
              {
                id: 'us-ca-sf',
                name: 'San Francisco',
                district: 'San Francisco County',
                state: 'California',
                country: 'United States',
                countryFlag: '🇺🇸',
                lat: 37.7749,
                lng: -122.4194,
                zoom: 13,
                population: '815,000'
              }
            ]
          },
          {
            id: 'us-ca-santa-clara',
            name: 'Santa Clara County (Silicon Valley)',
            state: 'California',
            country: 'United States',
            lat: 37.3382,
            lng: -121.8863,
            zoom: 12,
            cities: [
              {
                id: 'us-ca-sj',
                name: 'San Jose',
                district: 'Santa Clara County (Silicon Valley)',
                state: 'California',
                country: 'United States',
                countryFlag: '🇺🇸',
                lat: 37.3382,
                lng: -121.8863,
                zoom: 12.5,
                population: '1.01 Million'
              }
            ]
          }
        ]
      },
      {
        id: 'us-il',
        name: 'Illinois',
        country: 'United States',
        lat: 40.6331,
        lng: -89.3985,
        zoom: 7,
        districts: [
          {
            id: 'us-il-cook',
            name: 'Cook County',
            state: 'Illinois',
            country: 'United States',
            lat: 41.8781,
            lng: -87.6298,
            zoom: 11.5,
            cities: [
              {
                id: 'us-il-chicago',
                name: 'Chicago',
                district: 'Cook County',
                state: 'Illinois',
                country: 'United States',
                countryFlag: '🇺🇸',
                lat: 41.8781,
                lng: -87.6298,
                zoom: 12.5,
                population: '2.7 Million'
              }
            ]
          }
        ]
      },
      {
        id: 'us-tx',
        name: 'Texas',
        country: 'United States',
        lat: 31.9686,
        lng: -99.9018,
        zoom: 6.5,
        districts: [
          {
            id: 'us-tx-travis',
            name: 'Travis County',
            state: 'Texas',
            country: 'United States',
            lat: 30.2672,
            lng: -97.7431,
            zoom: 12,
            cities: [
              {
                id: 'us-tx-austin',
                name: 'Austin',
                district: 'Travis County',
                state: 'Texas',
                country: 'United States',
                countryFlag: '🇺🇸',
                lat: 30.2672,
                lng: -97.7431,
                zoom: 12.5,
                population: '964,000'
              }
            ]
          },
          {
            id: 'us-tx-harris',
            name: 'Harris County',
            state: 'Texas',
            country: 'United States',
            lat: 29.7604,
            lng: -95.3698,
            zoom: 11.5,
            cities: [
              {
                id: 'us-tx-houston',
                name: 'Houston',
                district: 'Harris County',
                state: 'Texas',
                country: 'United States',
                countryFlag: '🇺🇸',
                lat: 29.7604,
                lng: -95.3698,
                zoom: 12.5,
                population: '2.3 Million'
              }
            ]
          }
        ]
      },
      {
        id: 'us-wa',
        name: 'Washington',
        country: 'United States',
        lat: 47.7511,
        lng: -120.7401,
        zoom: 7,
        districts: [
          {
            id: 'us-wa-king',
            name: 'King County',
            state: 'Washington',
            country: 'United States',
            lat: 47.6062,
            lng: -122.3321,
            zoom: 12,
            cities: [
              {
                id: 'us-wa-seattle',
                name: 'Seattle',
                district: 'King County',
                state: 'Washington',
                country: 'United States',
                countryFlag: '🇺🇸',
                lat: 47.6062,
                lng: -122.3321,
                zoom: 12.5,
                population: '737,000'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'in',
    flag: '🇮🇳',
    name: 'India',
    continent: 'South Asia',
    capital: 'New Delhi',
    lat: 20.5937,
    lng: 78.9629,
    zoom: 5.0,
    states: [
      {
        id: 'in-dl',
        name: 'National Capital Territory of Delhi',
        country: 'India',
        lat: 28.7041,
        lng: 77.1025,
        zoom: 10.5,
        districts: [
          {
            id: 'in-dl-new-delhi',
            name: 'New Delhi District',
            state: 'National Capital Territory of Delhi',
            country: 'India',
            lat: 28.6139,
            lng: 77.2090,
            zoom: 12.5,
            cities: [
              {
                id: 'in-dl-city',
                name: 'New Delhi',
                district: 'New Delhi District',
                state: 'National Capital Territory of Delhi',
                country: 'India',
                countryFlag: '🇮🇳',
                lat: 28.6139,
                lng: 77.2090,
                zoom: 13,
                isCapital: true,
                population: '32.9 Million (NCR)'
              }
            ]
          },
          {
            id: 'in-dl-central',
            name: 'Central Delhi District',
            state: 'National Capital Territory of Delhi',
            country: 'India',
            lat: 28.6448,
            lng: 77.2167,
            zoom: 13,
            cities: [
              {
                id: 'in-dl-connaught',
                name: 'Connaught Place',
                district: 'Central Delhi District',
                state: 'National Capital Territory of Delhi',
                country: 'India',
                countryFlag: '🇮🇳',
                lat: 28.6315,
                lng: 77.2167,
                zoom: 14,
                population: 'Major Business Center'
              }
            ]
          }
        ]
      },
      {
        id: 'in-mh',
        name: 'Maharashtra',
        country: 'India',
        lat: 19.7515,
        lng: 75.7139,
        zoom: 7,
        districts: [
          {
            id: 'in-mh-mumbai-city',
            name: 'Mumbai City & Suburban District',
            state: 'Maharashtra',
            country: 'India',
            lat: 19.0760,
            lng: 72.8777,
            zoom: 11.5,
            cities: [
              {
                id: 'in-mh-mumbai',
                name: 'Mumbai',
                district: 'Mumbai City & Suburban District',
                state: 'Maharashtra',
                country: 'India',
                countryFlag: '🇮🇳',
                lat: 19.0760,
                lng: 72.8777,
                zoom: 12.5,
                population: '21.3 Million (MMR)'
              }
            ]
          },
          {
            id: 'in-mh-pune-dist',
            name: 'Pune District',
            state: 'Maharashtra',
            country: 'India',
            lat: 18.5204,
            lng: 73.8567,
            zoom: 12,
            cities: [
              {
                id: 'in-mh-pune',
                name: 'Pune',
                district: 'Pune District',
                state: 'Maharashtra',
                country: 'India',
                countryFlag: '🇮🇳',
                lat: 18.5204,
                lng: 73.8567,
                zoom: 12.5,
                population: '7.4 Million'
              }
            ]
          }
        ]
      },
      {
        id: 'in-ka',
        name: 'Karnataka',
        country: 'India',
        lat: 15.3173,
        lng: 75.7139,
        zoom: 7,
        districts: [
          {
            id: 'in-ka-bengaluru-urban',
            name: 'Bengaluru Urban District',
            state: 'Karnataka',
            country: 'India',
            lat: 12.9716,
            lng: 77.5946,
            zoom: 11.5,
            cities: [
              {
                id: 'in-ka-bengaluru',
                name: 'Bengaluru (Bangalore)',
                district: 'Bengaluru Urban District',
                state: 'Karnataka',
                country: 'India',
                countryFlag: '🇮🇳',
                lat: 12.9716,
                lng: 77.5946,
                zoom: 12.5,
                population: '13.2 Million'
              }
            ]
          }
        ]
      },
      {
        id: 'in-tn',
        name: 'Tamil Nadu',
        country: 'India',
        lat: 11.1271,
        lng: 78.6569,
        zoom: 7,
        districts: [
          {
            id: 'in-tn-chennai-dist',
            name: 'Chennai District',
            state: 'Tamil Nadu',
            country: 'India',
            lat: 13.0827,
            lng: 80.2707,
            zoom: 12,
            cities: [
              {
                id: 'in-tn-chennai',
                name: 'Chennai',
                district: 'Chennai District',
                state: 'Tamil Nadu',
                country: 'India',
                countryFlag: '🇮🇳',
                lat: 13.0827,
                lng: 80.2707,
                zoom: 12.5,
                population: '11.5 Million'
              }
            ]
          }
        ]
      },
      {
        id: 'in-wb',
        name: 'West Bengal',
        country: 'India',
        lat: 22.9868,
        lng: 87.8550,
        zoom: 7,
        districts: [
          {
            id: 'in-wb-kolkata-dist',
            name: 'Kolkata District',
            state: 'West Bengal',
            country: 'India',
            lat: 22.5726,
            lng: 88.3639,
            zoom: 12,
            cities: [
              {
                id: 'in-wb-kolkata',
                name: 'Kolkata',
                district: 'Kolkata District',
                state: 'West Bengal',
                country: 'India',
                countryFlag: '🇮🇳',
                lat: 22.5726,
                lng: 88.3639,
                zoom: 12.5,
                population: '14.9 Million'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'gb',
    flag: '🇬🇧',
    name: 'United Kingdom',
    continent: 'Europe',
    capital: 'London',
    lat: 51.5074,
    lng: -0.1278,
    zoom: 6.2,
    states: [
      {
        id: 'gb-eng',
        name: 'England',
        country: 'United Kingdom',
        lat: 52.3555,
        lng: -1.1743,
        zoom: 7,
        districts: [
          {
            id: 'gb-eng-greater-london',
            name: 'Greater London / Westminster',
            state: 'England',
            country: 'United Kingdom',
            lat: 51.5074,
            lng: -0.1278,
            zoom: 12,
            cities: [
              {
                id: 'gb-eng-london',
                name: 'London',
                district: 'Greater London / Westminster',
                state: 'England',
                country: 'United Kingdom',
                countryFlag: '🇬🇧',
                lat: 51.5074,
                lng: -0.1278,
                zoom: 13,
                isCapital: true,
                population: '8.98 Million'
              }
            ]
          },
          {
            id: 'gb-eng-manchester',
            name: 'Greater Manchester District',
            state: 'England',
            country: 'United Kingdom',
            lat: 53.4808,
            lng: -2.2426,
            zoom: 12,
            cities: [
              {
                id: 'gb-eng-mcr',
                name: 'Manchester',
                district: 'Greater Manchester District',
                state: 'England',
                country: 'United Kingdom',
                countryFlag: '🇬🇧',
                lat: 53.4808,
                lng: -2.2426,
                zoom: 13,
                population: '553,000'
              }
            ]
          },
          {
            id: 'gb-eng-midlands',
            name: 'West Midlands District',
            state: 'England',
            country: 'United Kingdom',
            lat: 52.4862,
            lng: -1.8904,
            zoom: 12,
            cities: [
              {
                id: 'gb-eng-bham',
                name: 'Birmingham',
                district: 'West Midlands District',
                state: 'England',
                country: 'United Kingdom',
                countryFlag: '🇬🇧',
                lat: 52.4862,
                lng: -1.8904,
                zoom: 13,
                population: '1.14 Million'
              }
            ]
          }
        ]
      },
      {
        id: 'gb-sct',
        name: 'Scotland',
        country: 'United Kingdom',
        lat: 56.4907,
        lng: -4.2026,
        zoom: 7,
        districts: [
          {
            id: 'gb-sct-edinburgh',
            name: 'City of Edinburgh District',
            state: 'Scotland',
            country: 'United Kingdom',
            lat: 55.9533,
            lng: -3.1883,
            zoom: 12,
            cities: [
              {
                id: 'gb-sct-edin',
                name: 'Edinburgh',
                district: 'City of Edinburgh District',
                state: 'Scotland',
                country: 'United Kingdom',
                countryFlag: '🇬🇧',
                lat: 55.9533,
                lng: -3.1883,
                zoom: 13,
                population: '527,000'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'de',
    flag: '🇩🇪',
    name: 'Germany',
    continent: 'Europe',
    capital: 'Berlin',
    lat: 52.5200,
    lng: 13.4050,
    zoom: 6.2,
    states: [
      {
        id: 'de-be',
        name: 'State of Berlin',
        country: 'Germany',
        lat: 52.5200,
        lng: 13.4050,
        zoom: 11,
        districts: [
          {
            id: 'de-be-mitte',
            name: 'Mitte District',
            state: 'State of Berlin',
            country: 'Germany',
            lat: 52.5200,
            lng: 13.4050,
            zoom: 13,
            cities: [
              {
                id: 'de-be-berlin',
                name: 'Berlin',
                district: 'Mitte District',
                state: 'State of Berlin',
                country: 'Germany',
                countryFlag: '🇩🇪',
                lat: 52.5200,
                lng: 13.4050,
                zoom: 13,
                isCapital: true,
                population: '3.68 Million'
              }
            ]
          }
        ]
      },
      {
        id: 'de-he',
        name: 'Hesse',
        country: 'Germany',
        lat: 50.6521,
        lng: 9.1624,
        zoom: 8,
        districts: [
          {
            id: 'de-he-frankfurt',
            name: 'Frankfurt am Main District',
            state: 'Hesse',
            country: 'Germany',
            lat: 50.1109,
            lng: 8.6821,
            zoom: 12,
            cities: [
              {
                id: 'de-he-ffm',
                name: 'Frankfurt',
                district: 'Frankfurt am Main District',
                state: 'Hesse',
                country: 'Germany',
                countryFlag: '🇩🇪',
                lat: 50.1109,
                lng: 8.6821,
                zoom: 13,
                population: '753,000'
              }
            ]
          }
        ]
      },
      {
        id: 'de-by',
        name: 'Bavaria (Bayern)',
        country: 'Germany',
        lat: 48.7904,
        lng: 11.4979,
        zoom: 7.5,
        districts: [
          {
            id: 'de-by-munich',
            name: 'Upper Bavaria / Munich District',
            state: 'Bavaria (Bayern)',
            country: 'Germany',
            lat: 48.1351,
            lng: 11.5820,
            zoom: 12,
            cities: [
              {
                id: 'de-by-muc',
                name: 'Munich',
                district: 'Upper Bavaria / Munich District',
                state: 'Bavaria (Bayern)',
                country: 'Germany',
                countryFlag: '🇩🇪',
                lat: 48.1351,
                lng: 11.5820,
                zoom: 13,
                population: '1.48 Million'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'fr',
    flag: '🇫🇷',
    name: 'France',
    continent: 'Europe',
    capital: 'Paris',
    lat: 48.8566,
    lng: 2.3522,
    zoom: 6.0,
    states: [
      {
        id: 'fr-idf',
        name: 'Île-de-France',
        country: 'France',
        lat: 48.8499,
        lng: 2.6370,
        zoom: 9.5,
        districts: [
          {
            id: 'fr-idf-paris-dept',
            name: 'Paris Central Department',
            state: 'Île-de-France',
            country: 'France',
            lat: 48.8566,
            lng: 2.3522,
            zoom: 12.5,
            cities: [
              {
                id: 'fr-idf-paris',
                name: 'Paris',
                district: 'Paris Central Department',
                state: 'Île-de-France',
                country: 'France',
                countryFlag: '🇫🇷',
                lat: 48.8566,
                lng: 2.3522,
                zoom: 13,
                isCapital: true,
                population: '2.16 Million'
              }
            ]
          }
        ]
      },
      {
        id: 'fr-ara',
        name: 'Auvergne-Rhône-Alpes',
        country: 'France',
        lat: 45.4471,
        lng: 4.3853,
        zoom: 8,
        districts: [
          {
            id: 'fr-ara-lyon',
            name: 'Lyon Metropolis District',
            state: 'Auvergne-Rhône-Alpes',
            country: 'France',
            lat: 45.7640,
            lng: 4.8357,
            zoom: 12,
            cities: [
              {
                id: 'fr-ara-lyn',
                name: 'Lyon',
                district: 'Lyon Metropolis District',
                state: 'Auvergne-Rhône-Alpes',
                country: 'France',
                countryFlag: '🇫🇷',
                lat: 45.7640,
                lng: 4.8357,
                zoom: 13,
                population: '522,000'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'jp',
    flag: '🇯🇵',
    name: 'Japan',
    continent: 'East Asia',
    capital: 'Tokyo',
    lat: 35.6762,
    lng: 139.6503,
    zoom: 6.0,
    states: [
      {
        id: 'jp-tokyo',
        name: 'Tokyo Metropolis (Prefecture)',
        country: 'Japan',
        lat: 35.6762,
        lng: 139.6503,
        zoom: 11,
        districts: [
          {
            id: 'jp-tokyo-chiyoda',
            name: 'Chiyoda & Shinjuku Wards',
            state: 'Tokyo Metropolis (Prefecture)',
            country: 'Japan',
            lat: 35.6895,
            lng: 139.6917,
            zoom: 13,
            cities: [
              {
                id: 'jp-tokyo-city',
                name: 'Tokyo (Special Wards)',
                district: 'Chiyoda & Shinjuku Wards',
                state: 'Tokyo Metropolis (Prefecture)',
                country: 'Japan',
                countryFlag: '🇯🇵',
                lat: 35.6762,
                lng: 139.6503,
                zoom: 13,
                isCapital: true,
                population: '14.0 Million'
              }
            ]
          }
        ]
      },
      {
        id: 'jp-osaka',
        name: 'Osaka Prefecture',
        country: 'Japan',
        lat: 34.6937,
        lng: 135.5023,
        zoom: 11,
        districts: [
          {
            id: 'jp-osaka-kita',
            name: 'Kita & Chuo Wards',
            state: 'Osaka Prefecture',
            country: 'Japan',
            lat: 34.6937,
            lng: 135.5023,
            zoom: 13,
            cities: [
              {
                id: 'jp-osaka-city',
                name: 'Osaka',
                district: 'Kita & Chuo Wards',
                state: 'Osaka Prefecture',
                country: 'Japan',
                countryFlag: '🇯🇵',
                lat: 34.6937,
                lng: 135.5023,
                zoom: 13,
                population: '2.75 Million'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'ca',
    flag: '🇨🇦',
    name: 'Canada',
    continent: 'North America',
    capital: 'Ottawa',
    lat: 45.4215,
    lng: -75.6972,
    zoom: 4.5,
    states: [
      {
        id: 'ca-on',
        name: 'Ontario',
        country: 'Canada',
        lat: 51.2538,
        lng: -85.3232,
        zoom: 6,
        districts: [
          {
            id: 'ca-on-ottawa',
            name: 'National Capital District',
            state: 'Ontario',
            country: 'Canada',
            lat: 45.4215,
            lng: -75.6972,
            zoom: 12,
            cities: [
              {
                id: 'ca-on-ott',
                name: 'Ottawa',
                district: 'National Capital District',
                state: 'Ontario',
                country: 'Canada',
                countryFlag: '🇨🇦',
                lat: 45.4215,
                lng: -75.6972,
                zoom: 13,
                isCapital: true,
                population: '1.01 Million'
              }
            ]
          },
          {
            id: 'ca-on-gta',
            name: 'Greater Toronto District',
            state: 'Ontario',
            country: 'Canada',
            lat: 43.6532,
            lng: -79.3832,
            zoom: 11.5,
            cities: [
              {
                id: 'ca-on-toronto',
                name: 'Toronto',
                district: 'Greater Toronto District',
                state: 'Ontario',
                country: 'Canada',
                countryFlag: '🇨🇦',
                lat: 43.6532,
                lng: -79.3832,
                zoom: 12.5,
                population: '2.93 Million'
              }
            ]
          }
        ]
      },
      {
        id: 'ca-bc',
        name: 'British Columbia',
        country: 'Canada',
        lat: 53.7267,
        lng: -127.6476,
        zoom: 6,
        districts: [
          {
            id: 'ca-bc-van',
            name: 'Metro Vancouver District',
            state: 'British Columbia',
            country: 'Canada',
            lat: 49.2827,
            lng: -123.1207,
            zoom: 12,
            cities: [
              {
                id: 'ca-bc-vancouver',
                name: 'Vancouver',
                district: 'Metro Vancouver District',
                state: 'British Columbia',
                country: 'Canada',
                countryFlag: '🇨🇦',
                lat: 49.2827,
                lng: -123.1207,
                zoom: 13,
                population: '675,000'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'au',
    flag: '🇦🇺',
    name: 'Australia',
    continent: 'Oceania',
    capital: 'Canberra',
    lat: -35.2809,
    lng: 149.1300,
    zoom: 4.8,
    states: [
      {
        id: 'au-act',
        name: 'Australian Capital Territory',
        country: 'Australia',
        lat: -35.2809,
        lng: 149.1300,
        zoom: 11,
        districts: [
          {
            id: 'au-act-canberra-dist',
            name: 'Canberra Central District',
            state: 'Australian Capital Territory',
            country: 'Australia',
            lat: -35.2809,
            lng: 149.1300,
            zoom: 12.5,
            cities: [
              {
                id: 'au-act-canberra',
                name: 'Canberra',
                district: 'Canberra Central District',
                state: 'Australian Capital Territory',
                country: 'Australia',
                countryFlag: '🇦🇺',
                lat: -35.2809,
                lng: 149.1300,
                zoom: 13,
                isCapital: true,
                population: '456,000'
              }
            ]
          }
        ]
      },
      {
        id: 'au-nsw',
        name: 'New South Wales',
        country: 'Australia',
        lat: -31.8402,
        lng: 145.6128,
        zoom: 6.5,
        districts: [
          {
            id: 'au-nsw-sydney-dist',
            name: 'City of Sydney / Greater Sydney District',
            state: 'New South Wales',
            country: 'Australia',
            lat: -33.8688,
            lng: 151.2093,
            zoom: 11.5,
            cities: [
              {
                id: 'au-nsw-syd',
                name: 'Sydney',
                district: 'City of Sydney / Greater Sydney District',
                state: 'New South Wales',
                country: 'Australia',
                countryFlag: '🇦🇺',
                lat: -33.8688,
                lng: 151.2093,
                zoom: 12.5,
                population: '5.3 Million'
              }
            ]
          }
        ]
      },
      {
        id: 'au-vic',
        name: 'Victoria',
        country: 'Australia',
        lat: -37.4713,
        lng: 144.7852,
        zoom: 7,
        districts: [
          {
            id: 'au-vic-melbourne-dist',
            name: 'City of Melbourne District',
            state: 'Victoria',
            country: 'Australia',
            lat: -37.8136,
            lng: 144.9631,
            zoom: 12,
            cities: [
              {
                id: 'au-vic-mel',
                name: 'Melbourne',
                district: 'City of Melbourne District',
                state: 'Victoria',
                country: 'Australia',
                countryFlag: '🇦🇺',
                lat: -37.8136,
                lng: 144.9631,
                zoom: 12.5,
                population: '5.1 Million'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'sg',
    flag: '🇸🇬',
    name: 'Singapore',
    continent: 'Southeast Asia',
    capital: 'Singapore',
    lat: 1.3521,
    lng: 103.8198,
    zoom: 11.5,
    states: [
      {
        id: 'sg-central',
        name: 'Central Region',
        country: 'Singapore',
        lat: 1.2838,
        lng: 103.8591,
        zoom: 12.5,
        districts: [
          {
            id: 'sg-downtown',
            name: 'Downtown Core District',
            state: 'Central Region',
            country: 'Singapore',
            lat: 1.2838,
            lng: 103.8591,
            zoom: 14,
            cities: [
              {
                id: 'sg-capital',
                name: 'Singapore Central',
                district: 'Downtown Core District',
                state: 'Central Region',
                country: 'Singapore',
                countryFlag: '🇸🇬',
                lat: 1.2838,
                lng: 103.8591,
                zoom: 14,
                isCapital: true,
                population: '5.64 Million'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'ae',
    flag: '🇦🇪',
    name: 'United Arab Emirates',
    continent: 'Middle East',
    capital: 'Abu Dhabi',
    lat: 24.4539,
    lng: 54.3773,
    zoom: 7.5,
    states: [
      {
        id: 'ae-dxb',
        name: 'Emirate of Dubai',
        country: 'United Arab Emirates',
        lat: 25.2048,
        lng: 55.2708,
        zoom: 11,
        districts: [
          {
            id: 'ae-dxb-downtown',
            name: 'Bur Dubai & Downtown District',
            state: 'Emirate of Dubai',
            country: 'United Arab Emirates',
            lat: 25.2048,
            lng: 55.2708,
            zoom: 13,
            cities: [
              {
                id: 'ae-dxb-city',
                name: 'Dubai',
                district: 'Bur Dubai & Downtown District',
                state: 'Emirate of Dubai',
                country: 'United Arab Emirates',
                countryFlag: '🇦🇪',
                lat: 25.2048,
                lng: 55.2708,
                zoom: 13,
                population: '3.6 Million'
              }
            ]
          }
        ]
      },
      {
        id: 'ae-auh',
        name: 'Emirate of Abu Dhabi',
        country: 'United Arab Emirates',
        lat: 24.4539,
        lng: 54.3773,
        zoom: 10.5,
        districts: [
          {
            id: 'ae-auh-central',
            name: 'Abu Dhabi Island Capital District',
            state: 'Emirate of Abu Dhabi',
            country: 'United Arab Emirates',
            lat: 24.4539,
            lng: 54.3773,
            zoom: 12.5,
            cities: [
              {
                id: 'ae-auh-city',
                name: 'Abu Dhabi',
                district: 'Abu Dhabi Island Capital District',
                state: 'Emirate of Abu Dhabi',
                country: 'United Arab Emirates',
                countryFlag: '🇦🇪',
                lat: 24.4539,
                lng: 54.3773,
                zoom: 13,
                isCapital: true,
                population: '1.5 Million'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'br',
    flag: '🇧🇷',
    name: 'Brazil',
    continent: 'South America',
    capital: 'Brasília',
    lat: -15.7975,
    lng: -47.8919,
    zoom: 4.5,
    states: [
      {
        id: 'br-df',
        name: 'Distrito Federal',
        country: 'Brazil',
        lat: -15.7975,
        lng: -47.8919,
        zoom: 11,
        districts: [
          {
            id: 'br-df-plano',
            name: 'Plano Piloto District',
            state: 'Distrito Federal',
            country: 'Brazil',
            lat: -15.7975,
            lng: -47.8919,
            zoom: 13,
            cities: [
              {
                id: 'br-df-brasilia',
                name: 'Brasília',
                district: 'Plano Piloto District',
                state: 'Distrito Federal',
                country: 'Brazil',
                countryFlag: '🇧🇷',
                lat: -15.7975,
                lng: -47.8919,
                zoom: 13,
                isCapital: true,
                population: '3.1 Million'
              }
            ]
          }
        ]
      },
      {
        id: 'br-sp',
        name: 'São Paulo State',
        country: 'Brazil',
        lat: -23.5505,
        lng: -46.6333,
        zoom: 9,
        districts: [
          {
            id: 'br-sp-metro',
            name: 'São Paulo Metro District',
            state: 'São Paulo State',
            country: 'Brazil',
            lat: -23.5505,
            lng: -46.6333,
            zoom: 12,
            cities: [
              {
                id: 'br-sp-city',
                name: 'São Paulo',
                district: 'São Paulo Metro District',
                state: 'São Paulo State',
                country: 'Brazil',
                countryFlag: '🇧🇷',
                lat: -23.5505,
                lng: -46.6333,
                zoom: 12.5,
                population: '12.3 Million'
              }
            ]
          }
        ]
      }
    ]
  }
];

export interface FlatGeoPlace {
  id: string;
  type: 'country' | 'state' | 'district' | 'city';
  name: string;
  countryName: string;
  countryFlag: string;
  stateName?: string;
  districtName?: string;
  lat: number;
  lng: number;
  zoom: number;
}

export const getAllFlatPlaces = (): FlatGeoPlace[] => {
  const places: FlatGeoPlace[] = [];
  for (const country of GEO_HIERARCHY) {
    places.push({
      id: `country-${country.id}`,
      type: 'country',
      name: country.name,
      countryName: country.name,
      countryFlag: country.flag,
      lat: country.lat,
      lng: country.lng,
      zoom: country.zoom
    });
    for (const state of country.states) {
      places.push({
        id: `state-${state.id}`,
        type: 'state',
        name: state.name,
        countryName: country.name,
        countryFlag: country.flag,
        stateName: state.name,
        lat: state.lat,
        lng: state.lng,
        zoom: state.zoom
      });
      for (const district of state.districts) {
        places.push({
          id: `district-${district.id}`,
          type: 'district',
          name: district.name,
          countryName: country.name,
          countryFlag: country.flag,
          stateName: state.name,
          districtName: district.name,
          lat: district.lat,
          lng: district.lng,
          zoom: district.zoom
        });
        for (const city of district.cities) {
          places.push({
            id: `city-${city.id}`,
            type: 'city',
            name: city.name,
            countryName: country.name,
            countryFlag: country.flag,
            stateName: state.name,
            districtName: district.name,
            lat: city.lat,
            lng: city.lng,
            zoom: city.zoom
          });
        }
      }
    }
  }
  return places;
};
