
import type { Company, FormValuesNewCompany } from "@/types/companies.types";
import api from "./api";
import type { SelectOption } from "@/types/main.types";

class CompanyService {

    private endpoint = 'companies';

    async findAll() {
        const response = await api.get(`${this.endpoint}`)
        return response.data as Company[]
    }

    async findOne(id: number) {
        const response = await api.get(`${this.endpoint}/${id}`)
        return response.data as Company
    }

    async getOptionsSize() {
        const response = await api.get('companies_sizes')
        return response.data as SelectOption[]
    }

    async getOptionsCategories() {
        const response = await api.get('companies_categories')
        return response.data as SelectOption[]
    }

    async getOptionsTypes() {
        const response = await api.get('companies_types')
        return response.data as SelectOption[]
    }

    async delete(id: number) {
        const response = await api.delete(`${this.endpoint}/${id}`)
        return response.data
    }

    async create(data: FormValuesNewCompany) {
        const formData = new FormData();
        formData.append("photo", data.photo as File);
        formData.append("name", data.name);
        formData.append("company_name", data.company_name);
        formData.append("category_id", data.category?.value as string);
        formData.append("type_id", data.type?.value as string);
        formData.append("size_id", data.size?.value as string);
        formData.append("cnpj", data.cnpj);
        formData.append("email", data.email);
        formData.append("description", data.description);
        formData.append("street", data.street);
        formData.append("state", data.state?.value as string);
        formData.append("city", data.city);
        formData.append("neighborhood", data.neighborhood);
        formData.append("cep", data.cep);
        formData.append("complement", data.complement);

        const response = await api.post('companies', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        return response.data
    }


    async update(data: FormValuesNewCompany, id: number) {
        const formData = new FormData();
        if (!id) formData.append("photo", data.photo as File);

        formData.append("name", data.name);
        formData.append("company_name", data.company_name);
        formData.append("category_id", data.category?.value as string);
        formData.append("type_id", data.type?.value as string);
        formData.append("size_id", data.size?.value as string);
        formData.append("cnpj", data.cnpj);
        formData.append("email", data.email);
        formData.append("description", data.description);
        formData.append("street", data.street);
        formData.append("state", data.state?.value as string);
        formData.append("city", data.city);
        formData.append("neighborhood", data.neighborhood);
        formData.append("cep", data.cep);
        formData.append("complement", data.complement);

        const response = await api.put('companies/' + id, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        return response.data

    }
}

export default new CompanyService();