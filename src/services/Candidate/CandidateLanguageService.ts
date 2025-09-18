
import type { BodySaveNewLanguage, LanguageState } from "@/types/language.types";
import api from "../api";

class CandidateLanguageService {
  private endpoint = "candidates/languages";

  async create(body: BodySaveNewLanguage) {
    const response = await api.post(`/${this.endpoint}`, body);
    return response.data;
  }

  async findAll() {
    const response = await api.get(`/${this.endpoint}`);
    return response.data as LanguageState[];
  }

  async delete(id: string) {
    await api.delete(`/${this.endpoint}/${id}`);
  }
}

export default new CandidateLanguageService();
