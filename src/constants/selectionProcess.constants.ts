import {
  ContractTypeEnum,
  EducationEnum,
  ProfileEnum,
} from "../types/selectionProcess.types";
import { defaultOptionSelect } from "./global.constants";

export const contractTypesOptions = [
  { value: ContractTypeEnum.CLT, label: "CLT" },
  { value: ContractTypeEnum.ESTAGIO, label: "ESTAGIO" },
  { value: ContractTypeEnum.PJ, label: "PJ" },
  { value: ContractTypeEnum.RPA, label: "RPA" },
];

export const educationOptions = [
  {
    value: EducationEnum.ENSINO_FUNDAMENTAL_COMPLETO,
    label: "Ensino Fundamental Completo",
  },
  {
    value: EducationEnum.ENSINO_FUNDAMENTAL_INCOMPLETO,
    label: "Ensino Fundamental Incompleto",
  },
  {
    value: EducationEnum.ENSINO_MEDIO_COMPLETO,
    label: "Ensino Médio Completo",
  },
  {
    value: EducationEnum.ENSINO_MEDIO_INCOMPLETO,
    label: "Ensino Médio Incompleto",
  },
  {
    value: EducationEnum.ENSINO_SUPERIOR_COMPLETO,
    label: "Ensino Superior Completo",
  },
  {
    value: EducationEnum.ENSINO_SUPERIOR_INCOMPLETO,
    label: "Ensino Superior Incompleto",
  },
  {
    value: EducationEnum.POS_GRADUACAO_COMPLETO,
    label: "Pós-graduação Completa",
  },
  {
    value: EducationEnum.POS_GRADUACAO_INCOMPLETO,
    label: "Pós-graduação Incompleta",
  },
  { value: EducationEnum.DOUTORADO_COMPLETO, label: "Doutorado Completo" },
  { value: EducationEnum.DOUTORADO_INCOMPLETO, label: "Doutorado Incompleto" },
  {
    value: EducationEnum.CURSO_TECNICO_COMPLETO,
    label: "Curso Técnico Completo",
  },
  {
    value: EducationEnum.CURSO_TECNICO_INCOMPLETO,
    label: "Curso Técnico Incompleto",
  },
];
export const workModalityOptions = [
  { value: "TEMPO INTEGRAL", label: "Tempo integral" },
  { value: "ESTÁGIO", label: "Estágio" },
  { value: "HORISTA", label: "Horista" },
  { value: "INTERMITENTE", label: "Intermitente" },
  { value: "REPRESENTANTE", label: "Representante" },
  { value: "TEMPORÁRIO", label: "Temporário" },
  { value: "RPA", label: "RPA" },
];

export const defaultValueNewSelectionProcess = {
  profile: ProfileEnum.APPRENTICE,
  title: "",
  position_id: defaultOptionSelect,
  contract_type: defaultOptionSelect,
  work_modality: defaultOptionSelect,
  education: defaultOptionSelect,
  state: defaultOptionSelect,
  city: "",
  show_salary: false,
  salary_range: "",
  description: "",
  extra_information: "",
  is_pcd: false,

  requirements: [],

  benefits: [],
};
