import type { SelectOption } from "./main.types";


export type Software = {
  name: string;
  level: SelectOption;
};

export type SoftwareState = {
  id: string;
  name: string;
  level: string;
};

export type BodySaveNewSoftware = {
  name: string;
  level: string;
};
