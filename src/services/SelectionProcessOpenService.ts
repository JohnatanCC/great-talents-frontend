
import type { ResponseGetOneSelectionProcessOpen, ResponseGetSelectionProcessOpen } from "@/types/selectionProcessOpen.types";
import api from "./api";

class SelectionProcessOpenService {
  private endpoint = "selection-processes-open";


  async findOne(id: string) {
    const response = await api.get<ResponseGetOneSelectionProcessOpen>(`/${this.endpoint}/${id}`);
    return response.data;
  }

  async getSelectionProcessOpen() {
    const response = await api.get<ResponseGetSelectionProcessOpen[]>(
      `/${this.endpoint}`
    );
    return response.data;
  }
}

export default new SelectionProcessOpenService();
