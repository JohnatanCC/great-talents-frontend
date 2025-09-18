
import type { ResponseFindAllExperiences } from "@/types/experience.types";
import api from "../api";

class ExperienceCandidateService {
  private endpoint = "candidates/experiences";

  async create(body: any) {
    const response = await api.post(`/${this.endpoint}`, body);
    return response.data;
  }

  async update(body: any, id: number) {
    const response = await api.put(`/${this.endpoint}/${id}`, body);
    return response.data;
  }

  async findAll() {
    const response = await api.get(`${this.endpoint}`);
    return response.data as ResponseFindAllExperiences[];
  }

  async findOne(id: number) {
    const response = await api.get(`${this.endpoint}/${id}`);
    return response.data as ResponseFindAllExperiences;
  }

  async delete(id: number) {
    await api.delete(`${this.endpoint}/${id}`);
  }
}

export default new ExperienceCandidateService();
