
import type { BodyUpdateVideoCurriculum, VideoCurriculum } from "@/types/VideoCurriculum.types";
import api from "../api";

class CandidateVideoCurriculumService {

    private endpoint = 'candidate/video_curriculum';

    async create(body: BodyUpdateVideoCurriculum) {
        const response = await api.post(`/${this.endpoint}`, body)
        return response.data
    }

    async find() {
        const response = await api.get(`/${this.endpoint}`)
        return response.data as VideoCurriculum
    }

}

export default new CandidateVideoCurriculumService();