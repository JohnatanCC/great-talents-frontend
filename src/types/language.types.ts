import type { SelectOption } from "./main.types";


export type Language = {
  name: string;
  level: string;
};

export type LanguageState = {
  id: string;
  name: string;
  level: string;
};

export type DefaultValuesUseFormNewLanguage = {
  name: string;
  level: SelectOption;
};

export type BodySaveNewLanguage = {
  name: string;
  level: string;
};
