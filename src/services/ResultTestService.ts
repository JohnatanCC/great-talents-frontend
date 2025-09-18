
import api from "./api";

class ResultTestService {

    private endpoint = 'candidate/personality_test';

    async create(body: any){
        const response = await api.post(
            `/${this.endpoint}`, 
          body)
        return response.data 
    }


    async find() {
        const response = await api.get(`${this.endpoint}/result`)
        return response.data
    }
}

export default new ResultTestService();