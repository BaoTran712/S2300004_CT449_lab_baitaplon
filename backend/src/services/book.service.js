import Book from "../models/book.model.js";

class BookService {
    async create(payload) {
        try {
            const bookData = {
                title: payload.title,
                price: payload.price,
                quantity: payload.quantity,
                published_year: payload.published_year,
                publisher_id: payload.publisher_id,
                author: payload.author,
                flash_sale_price: payload.flash_sale_price || null,
                flash_sale_end_time: payload.flash_sale_end_time || null,
                preview_chapter: payload.preview_chapter || null,
            };
            Object.keys(bookData).forEach(key => {
                if (bookData[key] === undefined) {
                    delete bookData[key];
                }
            });
            const book = new Book(bookData);
            return await book.save();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async find(filter) {
        return await Book.find(filter).populate("publisher_id");
    }

    async findById(id) {
        return await Book.findOne({ _id: id }).populate("publisher_id");
    }

    async findByName(name) {
        return await Book.find({
            name: { $regex: name, $options: "i" }
        });
    }

    async update(id, payload) {
        Object.keys(payload).forEach(key => {
            if (payload[key] === undefined || payload[key] === "" || payload[key] === null) {
                delete payload[key];
            }
        });

        const result = await Book.findByIdAndUpdate(
            id, { $set: payload }, { new: true, runValidators: true }
        );
        return result;
    }

    async delete(id) {
        const result = await Book.findByIdAndDelete(id);
        return result;
    }

    async deleteAll() {
        const result = await Book.deleteMany({});
        return result.deletedCount;
    }
}

export default BookService;