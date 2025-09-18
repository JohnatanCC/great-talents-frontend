// selectionProcessOpen.types.ts (refatorado para remover enum)
// Alinhado com selectionProcess.types.ts que usa objetos `as const` + union types

import type {
  ContractType,
  Education,
  Profile,
  WorkModality,
} from "./selectionProcess.types";

export type ResponseGetSelectionProcessOpen = {
  id: number;
  profile: Profile;
  title: string;
  neighborhood: string;
  show_salary: boolean;
  city: string;
  state: string;
  salary: string; // mantém string conforme API
  is_pcd: boolean;
  company: {
    name: string;
    photo: string;
  };
};

export type StateSelectionProcessOpen = ResponseGetSelectionProcessOpen;

export type ResponseGetOneSelectionProcessOpen = {
  id: number;
  title: string;
  description: string;
  profile: Profile;
  contract_type: ContractType;
  education: Education;
  work_modality: WorkModality; // antes: string
  show_salary: boolean;
  salary_range: string;
  state: string;
  city: string;
  position: {
    id: number;
    name: string;
  };
  is_pcd: boolean;
  selection_process_benefits: {
    id: number;
    description: string;
  }[];
  selection_process_requirements: {
    id: number;
    name: string;
    required: boolean;
  }[];
  company: {
    name: string;
    photo: string;
    description: string;
    neighborhood: string;
  };
};

export type StateSelectionProcessOpenDetails = ResponseGetOneSelectionProcessOpen;
