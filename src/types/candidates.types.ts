import type { SelectOption } from "./main.types";


export type ResponseFindAllCandidates = {
  id: string;
}[];

export type FormValuesNewCandidate = {
  name: string;
  email: string;
  password: string;
  contact: string;
  date_birth: string;
  genre: SelectOption;
  education: SelectOption;
  cep: string;
  state: SelectOption;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
  photo?: File | null;

  is_pcd: boolean;
  pcd_description: string;

  position: string
  company_name: string
  start: string
  end: string
};

export type BodyCreateNewCandidate = {
  name: string;
  email: string;
  password: string;
  contact: string;
  date_birth: string;
  genre: SelectOption;
  education: SelectOption;
  cep: string;
  state: SelectOption;
  city: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
  photo?: File | null;

  is_pcd: boolean;
  pcd_description: string;

  company_name: string
  position: string
  start: string
  end: string
};
