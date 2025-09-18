
import type { ResponseSelectOptions } from "@/types/main.types";
import api from "./api";

class BenefitService {

    private endpoint = 'benefits';

    async getOptions() {
        const response = await api.get<ResponseSelectOptions>(`/${this.endpoint}/options`)
        return response.data
    }
}

export default new BenefitService();