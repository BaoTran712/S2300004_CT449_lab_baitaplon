import BorrowService from "../services/borrow.service.js";
import ApiError from "../api-error.js";
import UserService from "../services/user.service.js";

const borrowService = new BorrowService();
const userService = new UserService();

export async function create(req, res, next) {
    if (!req.body?.user_id || !req.body?.book_id) {
        return next(new ApiError(400, "User or book information is missing"));
    }

    const user = await userService.findById(req.body.user_id);
    if (!user) {
        return next(new ApiError(404, "User not found"));
    }
    
    if (user.suspended_until && new Date(user.suspended_until) > new Date()) {
        return next(new ApiError(403, "Tài khoản đang bị tạm khóa mượn sách do có vi phạm trả trễ gần đây."));
    }

    const overdues = await borrowService.find({
        user_id: req.body.user_id,
        status: "borrowing",
        return_date: { $lt: new Date() }
    });

    if (overdues.length > 0) {
        return next(new ApiError(403, "Bạn đang có sách quá hạn chưa gia hạn hoặc trả lại. Không thể mượn thêm sách."));
    }

    const existingBorrow = await borrowService.find({
        user_id: req.body.user_id,
        book_id: req.body.book_id,
        status: {
            $in: ["pending", "borrowing"]
        }
    });

    const totalBorrow = await borrowService.find({
        user_id: req.body.user_id,
        status: {
            $in: ["pending", "borrowing"]
        }
    });

    if (existingBorrow.length >= 2) {
        return next(new ApiError(422, "Borrowing record for each book is limited to 2"));
    }

    if (totalBorrow.length >= 5) {
        return next(new ApiError(409, "Bạn chỉ được mượn tối đa 5 cuốn sách (bao gồm cả chờ duyệt) cùng một thời điểm."));
    }

    try {
        req.body.return_date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const document = await borrowService.create(req.body);
        return res.status(201).json({ message: "Book borrowing record created successfully", document });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "An error occurred while creating the book borrowing record"));
    }
}

export async function findAll(req, res, next) {
    try {
        const filter = {};
        if (req.query.user_id) {
            filter.user_id = req.query.user_id;
        }
        const documents = await borrowService.find(filter);
        return res.json(documents);
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "An error occurred while retrieving the list of book borrowing records"));
    }
}

export async function findOne(req, res, next) {
    try {
        const document = await borrowService.findById(req.params.id);

        if (!document) {
            return next(new ApiError(404, "Book borrowing record not found"));
        }

        return res.json(document);
    } catch (error) {
        console.log(error);
        return next(
            new ApiError(500, `Error while retrieving book borrowing record with id ${req.params.id}`)
        );
    }
}

export async function update(req, res, next) {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update cannot be empty"));
    }

    try {
        const existingBorrow = await borrowService.findById(req.params.id);
        if (!existingBorrow) {
            return next(new ApiError(404, "Book borrowing record not found"));
        }

        const isMarkingAsReturned = (existingBorrow.status !== "returned" && req.body.status === "returned");

        const document = await borrowService.update(req.params.id, req.body);

        // Khâu xử lý thao tác Đã Trả (Returned)
        if (isMarkingAsReturned) {
            const expectedReturnDate = new Date(existingBorrow.return_date);
            const actualReturnDate = new Date();
            expectedReturnDate.setHours(23, 59, 59, 999);

            const user = await userService.findById(existingBorrow.user_id._id || existingBorrow.user_id);
            if (user) {
                if (actualReturnDate > expectedReturnDate) {
                    // Cập nhật phạt trừ 1 điểm, tối thiểu là 0.
                    const newPoints = Math.max(0, (user.points || 0) - 1);
                    // Đình chỉ mượn sách 2 ngày từ giờ đáo hạn đã qua: return_date + 2 days (48 giờ)
                    const suspendedUntil = new Date(expectedReturnDate.getTime() + 2 * 24 * 60 * 60 * 1000);
                    
                    await userService.update(user._id, { 
                        points: newPoints,
                        suspended_until: suspendedUntil 
                    });
                } else {
                    // Cập nhật điểm +5 nếu đúng hẹn
                    await userService.update(user._id, { points: (user.points || 0) + 5 });
                }
            }
        }

        // Khâu xử lý thao tác Gia Hạn (Renew)
        if (req.body.action === "renew") {
            const expectedReturnDate = new Date(existingBorrow.return_date);
            expectedReturnDate.setHours(23, 59, 59, 999);
            
            if (new Date() > expectedReturnDate) {
                return next(new ApiError(400, "Sách này đã hết hạn, không thể gia hạn. Vui lòng trả sách."));
            }
            
            const newReturnDate = new Date(expectedReturnDate.getTime() + 7 * 24 * 60 * 60 * 1000);
            await borrowService.update(req.params.id, { return_date: newReturnDate });
        }

        return res.json({ message: "Book borrowing record updated successfully", document });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, `Error while updating book borrowing record with id ${req.params.id}`)
        );
    }
}

export async function deleteOne(req, res, next) {
    try {

        const document = await borrowService.delete(req.params.id);

        if (!document) {
            return next(new ApiError(404, "Book borrowing record not found"));
        }

        return res.send({ message: "Book borrowing record deleted successfully" });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, `Could not delete book borrowing record with id ${req.params.id}`));
    }
}

export async function deleteAll(req, res, next) {
    try {
        const deletedCount = await borrowService.deleteAll();

        return res.json({
            message: `${deletedCount} records were deleted successfully`
        });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "An error occurred while deleting all book borrowing records"));
    }
}

export default {
    create, findAll, findOne, update, deleteOne, deleteAll,
};
