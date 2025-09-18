
import type { ResponseFindOneCurriculum } from "@/types/curriculum.types";
import api from "../api";

class CandidateCurriculumService {

    private endpoint = 'candidate/curriculum';

    async findMyCurriculum() {
        const response = await api.get(`/${this.endpoint}`)
        return response.data as ResponseFindOneCurriculum
    }

    async findByCandidateId(candidateId: string) {
        const response = await api.get(`/candidate/${candidateId}/curriculum`)
        return response.data as ResponseFindOneCurriculum
    }

}

export default new CandidateCurriculumService();