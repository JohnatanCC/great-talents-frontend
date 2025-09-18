import type { BodyCreateNewSelectionProcess, ResponseGetSelectionProcesses, ResponseGetToEditSelectionProcess, SelectionProcess } from "@/types/selectionProcess.types";
import api from "./api";

class SelectionProcessService {
  private endpoint = "selection-processes";

  async findAllByStatus() {
    const response = await api.get<ResponseGetSelectionProcesses>(
      `/${this.endpoint}`
    );
    return response.data;
  }

  async updateStatus(id: number, status: string) {
    const response = await api.patch(`/${this.endpoint}/${id}/status`, {
      status,
    });
    return response.data;
  }

  async findOne(id: string) {
    const response = await api.get<SelectionProcess>(`${this.endpoint}/${id}`);
    return response.data;
  }

  async findOneToEdit(id: string) {
    const response = await api.get<ResponseGetToEditSelectionProcess>(`${this.endpoint}/${id}`);
    return response.data;
  }

  async create(body: BodyCreateNewSelectionProcess) {
    console.log("entreii")
    const response = await api.post(`${this.endpoint}`, body);
    return response.data;
  }
}

export default new SelectionProcessService();
