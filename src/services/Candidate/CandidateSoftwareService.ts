

import type { BodySaveNewSoftware, SoftwareState } from "@/types/Softwares.types";
import api from "../api";

class CandidateSoftwareService {

    private endpoint = 'candidates/softwares';

    async create(body: BodySaveNewSoftware) {
        const response = await api.post(`/${this.endpoint}`, body)
        return response.data
    }

    async findAll() {
        const response = await api.get(`/${this.endpoint}`)
        return response.data as SoftwareState
    }

    async delete(id: string) {
        await api.delete(`/${this.endpoint}/${id}`);
    }

}

export default new CandidateSoftwareService();