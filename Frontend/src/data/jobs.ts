export interface Job {
  id: number;
  title: string;
  division: string;
  location: string;
  type: string;
  level: string;
  description: string;
  fullDescription: string;
  requirements: string[];
  deadline: string;
}

type DivisionKey = "salesMarketing" | "technicalOperations" | "financeAdmin" | "logisticsDistribution";
type LocationKey = "sidoarjo" | "balikpapan";
type LevelKey = "entry" | "mid" | "senior";

type JobStructureItem = {
  id: number;
  divisionKey: DivisionKey;
  locationKey: LocationKey;
  levelKey: LevelKey;
  deadline: string;
};

const structure: JobStructureItem[] = [
  { id: 1, divisionKey: "salesMarketing", locationKey: "sidoarjo", levelKey: "mid", deadline: "2027-12-30" },
  { id: 2, divisionKey: "technicalOperations", locationKey: "sidoarjo", levelKey: "mid", deadline: "2027-12-30" },
  { id: 3, divisionKey: "financeAdmin", locationKey: "balikpapan", levelKey: "entry", deadline: "2027-12-30" },
  { id: 4, divisionKey: "logisticsDistribution", locationKey: "sidoarjo", levelKey: "entry", deadline: "2027-12-30" },
  { id: 5, divisionKey: "technicalOperations", locationKey: "sidoarjo", levelKey: "mid", deadline: "2027-12-30" },
  { id: 6, divisionKey: "salesMarketing", locationKey: "balikpapan", levelKey: "mid", deadline: "2027-12-30" },
  { id: 7, divisionKey: "logisticsDistribution", locationKey: "sidoarjo", levelKey: "senior", deadline: "2027-12-30" },
  { id: 8, divisionKey: "financeAdmin", locationKey: "balikpapan", levelKey: "senior", deadline: "2027-12-30" },
  { id: 9, divisionKey: "technicalOperations", locationKey: "sidoarjo", levelKey: "mid", deadline: "2027-12-30" },
];

type TFunc = (key: string, opts?: Record<string, unknown>) => string;

/** Builds the full job list every career page expects, sourcing all text from i18n. */
export function getJobs(t: TFunc): Job[] {
  return structure.map(({ id, divisionKey, locationKey, levelKey, deadline }) => ({
    id,
    deadline,
    title: t(`career.jobs.${id}.title`),
    division: t(`career.jobDivisions.${divisionKey}`),
    location: t(`career.jobLocations.${locationKey}`),
    type: t("career.jobTypes.fullTime"),
    level: t(`career.jobLevels.${levelKey}`),
    description: t(`career.jobs.${id}.description`),
    fullDescription: t(`career.jobs.${id}.fullDescription`),
    requirements: t(`career.jobs.${id}.requirements`, { returnObjects: true }) as unknown as string[],
  }));
}

export function getJobById(t: TFunc, id: number): Job | undefined {
  return getJobs(t).find((job) => job.id === id);
}
