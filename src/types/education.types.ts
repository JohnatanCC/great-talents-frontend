export type CandidateFormation = {
  candidate_id: number;
  course: string;
  created_at: string;
  description: string | null;
  end_date: string | null;
  formation_status: "CURSANDO" | "CONCLUIDO" | "INTERRUPT" | string;
  id: number;
  institution: string;
  start_date: string;
  updated_at: string;
};

export interface ResponseFindAllEducations {
  id: number;
  institution: string;
  course: string;
  start_date: string;
  end_date: string;
  description: string;
  formation_status: "CURSANDO" | "CONCLUIDO" | "INTERRUPT" | string;
  candidate_id: number;
  created_at: string;
  updated_at: string;
}

export type StateEducations = ResponseFindAllEducations;
