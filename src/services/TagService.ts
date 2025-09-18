
import { ResponseSelectOptions } from "../types/main.types";
import api from "./api";

class TagService {

    private endpoint = 'tags';

    async getOptions(){
        const response = await api.get<ResponseSelectOptions>(`/${this.endpoint}/options`)
        return response.data
    }

}

export default new TagService();