import ApiClient from "./api.service";

class ReviewService {
  constructor(baseUrl = "/api/review") {
    this.api = ApiClient(baseUrl);
  }

  async createReview(data) {
    return (await this.api.post("/", data)).data;
  }

  async getReviewsByBookId(bookId) {
    return (await this.api.get(`/book/${bookId}`)).data;
  }

  async getReviewsByUserId(userId) {
    return (await this.api.get(`/user/${userId}`)).data;
  }

  async getAllReviews() {
    return (await this.api.get("/")).data;
  }

  async deleteReview(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  async updateReply(id, reply) {
    return (await this.api.patch(`/${id}`, { reply })).data;
  }
}

export default ReviewService;
