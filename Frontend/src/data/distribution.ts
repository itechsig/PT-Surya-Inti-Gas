export interface DistributionLocation {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  type: "kantor-pusat" | "pabrik";
  shortDescription: string;
  description: string;
  mapsUrl: string;
}

const structure: Pick<DistributionLocation, "id" | "lat" | "lng" | "type" | "mapsUrl">[] = [
  {
    id: "kantor-pusat",
    lat: -7.4669737,
    lng: 112.7497521,
    type: "kantor-pusat",
    mapsUrl:
      "http://google.com/maps/place/PT.+Surya+Inti+Gas/@-7.4669737,112.7497521,16z/data=!3m1!4b1!4m6!3m5!1s0x2dd7e14793b1542f:0xe5456eaac6d0291d!8m2!3d-7.466979!4d112.752327!16s%2Fg%2F11gcm0cz2j?entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D",
  },
  {
    id: "pabrik-balikpapan",
    lat: -1.1870876,
    lng: 116.8489722,
    type: "pabrik",
    mapsUrl:
      "https://www.google.com/maps/place/PT.+SURYA+INTI+GAS+(+PT.+SIG+)+BALIKPAPAN/@-1.1870876,116.8489722,17z/data=!3m1!4b1!4m6!3m5!1s0x2df148fc497a3ea1:0xba6abd6e8257b9b4!8m2!3d-1.187093!4d116.8515471!16s%2Fg%2F11g887kpnd?entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D",
  },
];

type TFunc = (key: string) => string;

/** Builds the full location list every distribution page expects, sourcing all text from i18n. */
export function getDistributionLocations(t: TFunc): DistributionLocation[] {
  return structure.map(({ id, lat, lng, type, mapsUrl }) => ({
    id,
    lat,
    lng,
    type,
    mapsUrl,
    name: t(`distribution.locations.${id}.name`),
    region: t(`distribution.locations.${id}.region`),
    shortDescription: t(`distribution.locations.${id}.shortDescription`),
    description: t(`distribution.locations.${id}.description`),
  }));
}
