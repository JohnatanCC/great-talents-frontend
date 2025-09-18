
import { BodyCreateNewCandidate, ResponseFindAllCandidates } from "../types/candidates.types";
import api from "./api";

class CandidateService {

    private endpoint = 'candidates';

    async findAll(){
        const response = await api.get(`/${this.endpoint}`)
        return response.data as ResponseFindAllCandidates
    }  

    async create(data: BodyCreateNewCandidate) {
        const formData = new FormData()

        if (data.photo) {
            formData.append('photo', data.photo);
        }
        
        formData.append('name', data.name)
        formData.append('email', data.email)
        formData.append('password', data.password)
     
        formData.append('contact', data.contact)
        formData.append('cep', data.cep)
        formData.append('city', data.city)
        formData.append('complement', data.complement)
        formData.append('state', data.state.value.toString())
        formData.append('number', data.number)
        formData.append('neighborhood', data.neighborhood)
     
        formData.append('date_birth', data.date_birth)
        formData.append('street', data.street)
        formData.append('genre', data.genre.value.toString())

        formData.append('is_pcd', data.is_pcd.toString())
        formData.append('pcd_description', data.pcd_description)

        formData.append('education', data.education.value.toString())
        formData.append('company_name', data.company_name)
        formData.append('position', data.position)
        formData.append('start', data.start)
        formData.append('end', data.end)
        


        const response = await api.post('candidates', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        return response.data
    }
    
}

export default new CandidateService();