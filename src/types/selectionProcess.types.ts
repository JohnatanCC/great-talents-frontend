import type { SelectOption } from "./main.types";


export enum ContractTypeEnum {
  CLT = "CLT",
  PJ = "PJ",
  RPA = "RPA",
  ESTAGIO = "ESTAGIO",
}

export enum ProfileEnum {
  "TRAINEE" = "TRAINEE",
  "APPRENTICE" = "APPRENTICE",
  "MANAGERIAL" = "MANAGERIAL",
  "OPERATIONAL" = "OPERATIONAL",
}

export enum EducationEnum {
  ENSINO_FUNDAMENTAL_COMPLETO = "ENSINO_FUNDAMENTAL_COMPLETO",
  ENSINO_FUNDAMENTAL_INCOMPLETO = "ENSINO_FUNDAMENTAL_INCOMPLETO",
  ENSINO_MEDIO_COMPLETO = "ENSINO_MEDIO_COMPLETO",
  ENSINO_MEDIO_INCOMPLETO = "ENSINO_MEDIO_INCOMPLETO",
  ENSINO_SUPERIOR_COMPLETO = "ENSINO_SUPERIOR_COMPLETO",
  ENSINO_SUPERIOR_INCOMPLETO = "ENSINO_SUPERIOR_INCOMPLETO",
  POS_GRADUACAO_COMPLETO = "POS_GRADUACAO_COMPLETO",
  POS_GRADUACAO_INCOMPLETO = "POS_GRADUACAO_INCOMPLETO",
  DOUTORADO_COMPLETO = "DOUTORADO_COMPLETO",
  DOUTORADO_INCOMPLETO = "DOUTORADO_INCOMPLETO",
  CURSO_TECNICO_COMPLETO = "CURSO_TECNICO_COMPLETO",
  CURSO_TECNICO_INCOMPLETO = "CURSO_TECNICO_INCOMPLETO",
}

export const ModalidadeDeTrabalho = {
  TEMPO_INTEGRAL: "TEMPO_INTEGRAL",
  HORISTA: "HORISTA",
  INTERMITENTE: "INTERMITENTE",
  REPRESENTANTE: "REPRESENTANTE",
  TEMPORARIO: "TEMPORARIO",
  TRAINEE: "TRAINEE",
  RPA: "RPA",
};

export type Benefit = {
  id: number;
  description: string;
  created_at: string;
  updated_at: string;
};

type Tag = {
  id: number;
  name: string;
};

type SelectionProcessRequirement = {
  id: number;
  selection_process_id: number;
  name: string;
  required: boolean;
  created_at: string;
  updated_at: string;
};

type SelectionProcessBenefit = {
  id: number;
  selection_process_id: number;
  benefit_id: number;
  benefit: Benefit;
};

type SelectionProcessTag = {
  id: number;
  selection_process_id: number;
  tag_id: number;
  tag: Tag;
};

export type SelectionProcess = {
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
  selection_process_benefits: SelectionProcessBenefit[];
  selection_process_tags: SelectionProcessTag[];
  selection_process_requirements: SelectionProcessRequirement[];
  position: {
    id: number;
    name: string;
  };
  user_company: {
    id: number;
    company_id: string;
    user_id: string;
    user: {
      id: number;
      name: string;
    };
  };
};

export type ResponseGetSelectionProcesses = {
  created: SelectionProcess[];
  open: SelectionProcess[];
  finished: SelectionProcess[];
  paused: SelectionProcess[];
};

export type SelectionProcesses = ResponseGetSelectionProcesses & {};

type Requirement = {
  name: string;
  required: boolean;
};

export type FormValuesNewSelectionProcess = {
  profile: ProfileEnum;
  title: string;
  position_id: SelectOption | null;
  contract_type: SelectOption | null;
  work_modality: SelectOption | null;
  salary_range: string;

  state: SelectOption | null;
  city: string;
  education: SelectOption | null;
  is_pcd: boolean;
  description: string;
  extra_information: string;
  benefits: SelectOption[];
  with_video: boolean;
  requirements: Requirement[];
  show_salary: boolean;
  description_extra: string;
};

export type BodyCreateNewSelectionProcess = {
  profile: ProfileEnum;
  title: string;
  position_id: string;
  contract_type: ContractTypeEnum;
  work_modality: string;
  education: string;
  show_salary: boolean;
  salary_range: string;
  description: string;
  extra_information: string;

  state: string;
  city: string;
  is_pcd: boolean;

  requirements: Requirement[];
  benefits_ids: string[];
};

export type ResponseGetToEditSelectionProcess = {
  id: number;
  profile: ProfileEnum;
  title: string;
  position_id: number;
  contract_type: ContractTypeEnum;
  work_modality: string;
  show_salary: boolean;
  salary_range: string;
  state: string;
  city: string;
  is_pcd: boolean;
  education: EducationEnum;
  description: string;
  with_video: boolean;
  status: string;
  extra_information: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
  company_id: number;
  selection_process_benefits: SelectionProcessBenefit[];
  selection_process_tags: SelectionProcessTag[];
  selection_process_requirements: SelectionProcessRequirement[];
  position: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
};
