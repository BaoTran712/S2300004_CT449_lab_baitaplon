import createApiClient from "./api.service";

class UploadService {
    constructor(baseUrl = "/api/upload") {
        this.api = createApiClient(baseUrl);
    }
    
    async uploadImage(file) {
        const formData = new FormData();
        formData.append("image", file);

        return (await this.api.post("/", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })).data;
    }
}

export default new UploadService();
