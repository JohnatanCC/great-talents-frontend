
import type { ResponseFindAllEducations } from "@/types/education.types";
import api from "../api";

class EducationCandidateService {
  private endpoint = "candidates/educations";

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
    return response.data as ResponseFindAllEducations[];
  }

  async findOne(id: number) {
    const response = await api.get(`${this.endpoint}/${id}`);
    return response.data as ResponseFindAllEducations;
  }

  async delete(id: number) {
    await api.delete(`${this.endpoint}/${id}`);
  }
}

export default new EducationCandidateService();
