
import api from "./api";

class QuestionService {

    private endpoint = 'personality_test/questions';

    async findAll() {
        const response = await api.get(`${this.endpoint}`)
        return response.data
    }
}

export default new QuestionService();