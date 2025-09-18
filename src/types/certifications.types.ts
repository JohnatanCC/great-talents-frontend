
import { SelectOption } from "./main.types";

export type Certification = {
    title : string,
    issuingOrganization: string,
    startDate: string,
    endDate: string,
    courseType: SelectOption,
}

export type CertificationState = {
    id: number;
    title: string;
    issuing_organization: string; // alterado para corresponder ao CertificationCard
    startDate: string;
    endDate: string;
    course_type: SelectOption; // alterado para corresponder ao CertificationCard
}