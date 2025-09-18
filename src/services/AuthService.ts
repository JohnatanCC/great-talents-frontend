import api from "./api";

class AuthService {
  private endpoint = "recovery-password";

  async recoveryPassword(email: string) {
    const response = await api.post(`/${this.endpoint}`, { email });
    return response.data;
  }

  async findDataUser() {
    const response = await api.get(`/${this.endpoint}/me`);
    return response.data;
  }
}

export default new AuthService();
