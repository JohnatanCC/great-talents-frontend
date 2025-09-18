
import { Opportunity, ResponseGetOppportunities } from "../types/opportunities.type";

import api from "./api";

class OportunityService {

    private endpoint = 'oppportunities';

    async findAll() {
        const response = await api.get<ResponseGetOppportunities>(`/${this.endpoint}`)
        return response.data
    }

    
    async findOne(id: string) {
        const response = await api.get<Opportunity>(`/${this.endpoint}/${id}`)
        return response.data
    }

    
}

export default new OportunityService();