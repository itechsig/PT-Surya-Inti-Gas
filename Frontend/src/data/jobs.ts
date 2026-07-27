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
