import ContactService from "../services/contact.service.js";
import ApiError from "../api-error.js";

const contactService = new ContactService();

export async function create(req, res, next) {
    if (!req.body?.name || !req.body?.email || !req.body?.subject || !req.body?.message) {
        return next(new ApiError(400, "Name, Email, Subject and Message are required"));
    }

    try {
        const document = await contactService.create(req.body);
        return res.status(201).json(document);
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "Error while sending contact message"));
    }
}

export async function findAll(req, res, next) {
    try {
        const documents = await contactService.findAll();
        return res.json(documents);
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "Error while retrieving contact messages"));
    }
}

export async function deleteOne(req, res, next) {
    try {
        const document = await contactService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Contact message not found"));
        }
        return res.json({ message: "Contact message deleted successfully" });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "Error while deleting contact message"));
    }
}

export async function updateStatus(req, res, next) {
    try {
        const document = await contactService.updateStatus(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Contact message not found"));
        }
        return res.json(document);
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "Error while updating status"));
    }
}

export default {
    create, findAll, deleteOne, updateStatus
};
