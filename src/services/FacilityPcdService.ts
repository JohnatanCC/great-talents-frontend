

import type { ResponseSelectOptions } from "@/types/main.types";
import api from "./api";

class FacilityPcdService {

    private endpoint = 'facilitiesPcds';

    async getOptions() {
        const response = await api.get<ResponseSelectOptions>(`/${this.endpoint}/options`)
        return response.data
    }
}

export default new FacilityPcdService();