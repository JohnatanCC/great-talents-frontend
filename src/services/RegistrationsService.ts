




import type { ResponseGetDetailsSteps, ResponseGetRegistrations } from "@/types/registrations.types";
import api from "./api";

class RegistrationsService {

    private endpoint = 'registrations';

    async create(selectionProcessId: string) {
        const response = await api.post(`/${this.endpoint}`, { selection_process_id: selectionProcessId })
        return response.data
    }

    async findAll() {
        const response = await api.get(`/${this.endpoint}/me`)
        return response.data as ResponseGetRegistrations
    }

    async decline(selectionProcessId: string) {
        const response = await api.patch(`/${this.endpoint}/${selectionProcessId}/decline`)
        return response.data
    }

    async detailsSteps(registrationId: string) {
        const response = await api.get(`/${this.endpoint}/${registrationId}/current-active`)
        return response.data as ResponseGetDetailsSteps
    }

}

export default new RegistrationsService();