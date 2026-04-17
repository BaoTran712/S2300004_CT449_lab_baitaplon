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

    async updateStatus(id, data) {
        const updateData = { status: data.status };
        if (data.response) {
            updateData.response = data.response;
            updateData.respondedAt = Date.now();
            updateData.status = 'responded';
        }
        return await Contact.findByIdAndUpdate(id, updateData, { new: true });
    }
}

export default ContactService;
