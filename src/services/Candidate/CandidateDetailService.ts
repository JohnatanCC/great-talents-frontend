import api from "../api";

class CandidateDetailService {

    private endpoint = 'candidates/details';

    async update(body: { resume: string }) {
        const response = await api.post(`/${this.endpoint}`, body)
        return response.data
    }

    async findOne() {
        const response = await api.get(`/${this.endpoint}`)
        return response.data
    }

}

export default new CandidateDetailService();