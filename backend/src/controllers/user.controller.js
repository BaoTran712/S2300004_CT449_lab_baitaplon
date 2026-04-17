import UserService from "../services/user.service.js";
import ApiError from "../api-error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const userService = new UserService();
dotenv.config();

export async function create(req, res, next) {
    if (!req.body?.username || !req.body?.password) {
        return next(new ApiError(400, "Username or password cannot be empty"));
    }
    try {
        const existingUser = await userService.findByUsername(req.body.username);
        if (existingUser) {
            return next(new ApiError(409, "Username already exists"));
        }

        await userService.create(req.body);

        return res.status(201).json({ message: "User record created successfully" });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "Error while creating user record"));
    }
}

export async function findAll(req, res, next) {
    let documents = [];
    try {
        const { name } = req.query;
        if (name) {
            documents = await userService.findByName(name);
        } else {
            documents = await userService.find({});
        }
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "An error occurred while retrieving the list of user records"));
    }
    return res.json(documents);
}

export async function findOne(req, res, next) {
    try {
        const document = await userService.findById(req.params.id);
        if (!document) {
            return next(new ApiError(404, "User record not found"));
        }
        return res.json(document);
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, `Error retrieving user record with id ${req.params.id}`));
    }
}

export async function update(req, res, next) {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update cannot be empty"));
    }

    try {
        const existingUser = await userService.findByUsername(req.body.username);
        if (existingUser) {
            return next(new ApiError(409, "Username already exists"));
        }

        const document = await userService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "User record not found"));
        }
        return res.json({ message: "User record updated successfully" });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, `Error updating user record with id ${req.params.id}`));
    }
}

export async function deleteOne(req, res, next) {
    try {
        const document = await userService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "User record not found"));
        }
        return res.send({ message: "User record deleted successfully" });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, `Could not delete user record with id ${req.params.id}`));
    }
}

export async function deleteAll(req, res, next) {
    try {
        const deleteCount = await userService.deleteAll();
        return res.send({
            message: `${deleteCount} user records were deleted successfully`,
        });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "An error occurred while deleting all user records"));
    }
}

export async function login(req, res, next) {
    if (!req.body?.username || !req.body?.password) {
        return next(new ApiError(400, "Username or password cannot be empty"));
    }

    try {
        const user = await userService.findByUsername(req.body.username);
        if (!user) {
            return next(new ApiError(404, "User not found"));
        }

        const passwordIsMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordIsMatch) {
            return next(new ApiError(401, "Invalid password"));
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).send({
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
                avatar: user.avatar,
            }
        });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "An error occurred while login"));
    }
}

export async function payFines(req, res, next) {
    try {
        const document = await userService.update(req.params.id, { fines: 0 });
        if (!document) {
            return next(new ApiError(404, "User record not found"));
        }
        return res.json({ message: "Fines paid successfully", document });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, `Error while paying fines for user ${req.params.id}`));
    }
}

export async function spinWheel(req, res, next) {
    try {
        const user = await userService.findById(req.params.id);
        if (!user) {
            return next(new ApiError(404, "User not found"));
        }

        if (user.points < 30) {
            return next(new ApiError(400, "Bạn không đủ điểm để thực hiện lượt xoay này (Cần 30 điểm)"));
        }

        const prizes = [
            "Móc khóa Ebookshelf", 
            "Thẻ kẹp sách (Bookmark)", 
            "Bút dạ quang", 
            "Sổ tay kiến thức", 
            "Huy hiệu độc bản",
            "Chúc bạn may mắn lần sau"
        ];
        
        const randomIndex = Math.floor(Math.random() * prizes.length);
        const reward = prizes[randomIndex];

        // Trừ điểm và thêm quà (nếu không phải là ô hụt)
        const updateData = { points: user.points - 30 };
        if (reward !== "Chúc bạn may mắn lần sau") {
            updateData.$push = { rewards: reward };
            // Note: userService.update might need to handle $push or I should do it manually if it doesn't support $set only. 
            // My recent view of user.service.js shows it uses $set. 
            // I'll update it to handle the push properly if needed or just do a manual update here with the model if the service is restricted.
        }

        // To keep it simple with existing service which use $set:
        const currentRewards = [...user.rewards];
        if (reward !== "Chúc bạn may mắn lần sau") {
            currentRewards.push(reward);
        }
        
        await userService.update(user._id, { 
            points: user.points - 30,
            rewards: currentRewards
        });

        return res.json({ 
            message: "Spin completed", 
            reward,
            pointsLeft: user.points - 30 
        });
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, "Lỗi hệ thống khi quay thưởng"));
    }
}

export default {
    create, findAll, findOne, update, deleteOne, deleteAll, login, payFines, spinWheel
};