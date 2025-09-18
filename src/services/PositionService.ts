

import type { ResponseSelectOptions } from "@/types/main.types";
import api from "./api";

class PositionService {

    private endpoint = 'positions';

    async getOptions() {
        PositionService
        const response = await api.get<ResponseSelectOptions>(`/${this.endpoint}/options`)
        return response.data
    }

}

export default new PositionService();