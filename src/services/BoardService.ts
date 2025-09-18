import api from "./api";

class BoardService {
  private endpoint = "board";

  // análise de currículo
  async find(id: string) {
    const response = await api.get(`/${this.endpoint}/${id}`);
    return response.data;
  }

  async analise(candidateId: number, processId: number) {
    const response = await api.patch(`/${this.endpoint}/${processId}/analise`, {
      candidate_id: candidateId,
    });
    return response.data;
  }

  async reprove(candidateId: number, id: number) {
    const response = await api.patch(`/${this.endpoint}/${id}/reprove`, {
      candidate_id: candidateId,
    });
    return response.data;
  }

  async conference(candidateId: number, id: number) {
    const response = await api.patch(`/${this.endpoint}/${id}/conference`, {
      candidate_id: candidateId,
    });
    return response.data;
  }

  async proposta(candidateId: number, id: number) {
    const response = await api.patch(`/${this.endpoint}/${id}/proposta`, {
      candidate_id: candidateId,
    });
    return response.data;
  }

  async avaliation(candidateId: number, id: number) {
    const response = await api.patch(`/${this.endpoint}/${id}/avaliation`, {
      candidate_id: candidateId,
    });
    return response.data;
  }

  async aprovado(candidateId: number, id: number) {
    const response = await api.patch(`/${this.endpoint}/${id}/aprovado`, {
      candidate_id: candidateId,
    });
    return response.data;
  }

  async decline(id: number) {
    const response = await api.patch(`/${this.endpoint}/${id}/decline`);
    return response.data;
  }
}

export default new BoardService();
