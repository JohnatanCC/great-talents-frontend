import type { SelectOption } from "./main.types";


interface FileResponse {
  id: number;
  name: string;
  size: string;
  mime: string;
  url: string;
}

interface Type {
  id: number;
  name: string;
}

interface Size {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

export type Company = {
  id: number;
  user_id: number;
  name: string;
  company_name: string;
  category_id: number;
  type_id: number;
  size_id: number;
  cnpj: string;
  email: string;
  description: string;
  cep: string;
  street: string;
  number: string;
  state: string;
  city: string;
  neighborhood: string;
  complement: string | null;
  file_id: number;
  created_at: string;
  updated_at: string;
  file: FileResponse;
  type: Type;
  size: Size;
  category: Category;
  user: {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
  };
};

export type FormValuesNewCompany = {
  name: string;
  company_name: string;
  category: SelectOption | null;
  type: SelectOption | null;
  size: SelectOption | null;
  cnpj: string;
  email: string;
  description: string;
  cep: string;
  state: SelectOption | null;
  city: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string;

  photo: File | null;
};
