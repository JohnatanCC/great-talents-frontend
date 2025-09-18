export type ResponseFindOneCurriculum = {
  name: string;
  educations: Education[];
  experiences: Experience[];
  resume: string;
  url_foto: string;
  video_curriculum_link: string | null;
  contact: string;
  email: string;
  languages: [];
  softwares: [];
  address: Address;
  pcd: {
    is_pcd: boolean;
    pcd_description: string;
  }
};

export type Education = {
  id: number;
  institution: string;
  course: string;
  start_date: string;
  end_date: string;
  description: string;
  formation_status: string;
  candidate_id: number;
  created_at: string;
  updated_at: string;
};

export type Experience = {
  id: number;
  candidate_id: number;
  description: string;
  position: string;
  company_name: string;
  state: string;
  city: string;
  start: string;
  end: string;
  current: boolean;
  created_at: string;
  updated_at: string;
};

export type Address = {
  cep: string;
  city: string;
  neighborhood: string;
  number: string;
  street: string;
  state: string;
  complement: string;
};

export type StateProfile = ResponseFindOneCurriculum;
