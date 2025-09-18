interface SelectionProcess {
  id: number;
  profile: string;
  title: string;
  position_id: number;
  contract_type: string;
  work_modality: string;
  salary_range: string;

  state: string;
  city: string;
  is_pcd: boolean;
  education: string;
  description: string;
  with_video: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
}

interface Candidate {
  id: number;
  name: string;
  email: string;
  cpf: string;
  contact: string;
  date_birth: string;
  genre: string;
  cep: string;
  city: string;
  neighborhood: string;
  number: string;
  street: string;
  state: string;
  complement: string;
  file_id: number;
  created_at: string;
  updated_at: string;
}

export interface Registration {
  companyName: string;
  id: number;
  status: string;
  title: string ;
}

export type ResponseGetRegistrations = Registration[];

export type ResponseGetDetailsSteps = {
    title: string;
    company_name: string;
    description: string;
};

export type StepState = ResponseGetDetailsSteps;
