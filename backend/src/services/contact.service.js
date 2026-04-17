import Contact from "../models/contact.model.js";

class ContactService {
    async create(data) {
        const contact = new Contact(data);
        return await contact.save();
    }

    async findAll() {
        return await Contact.find().sort({ createdAt: -1 });
    }

    async delete(id) {
        return await Contact.findByIdAndDelete(id);
    }

    async updateStatus(id, status) {
        return await Contact.findByIdAndUpdate(id, { status }, { new: true });
    }
}

export default ContactService;
