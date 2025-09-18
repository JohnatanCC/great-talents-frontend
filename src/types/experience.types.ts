export interface ResponseFindAllExperiences {
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
}

export type StateExperiences = ResponseFindAllExperiences