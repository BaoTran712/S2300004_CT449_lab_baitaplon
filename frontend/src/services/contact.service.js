import ApiClient from "./api.service";

class ContactService {
    constructor(baseUrl = "/api/contact") {
        this.api = ApiClient(baseUrl);
    }

    async create(data) {
        return (await this.api.post("/", data)).data;
    }

    async findAll() {
        return (await this.api.get("/")).data;
    }

    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }

    async updateStatus(id, data) {
        return (await this.api.patch(`/${id}`, data)).data;
    }
}

export default new ContactService();
