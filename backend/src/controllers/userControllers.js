import { User } from "../models/userModel.js";
import { Meeting } from "../models/meetingModel.js";
import httpStatus from "http-status";
import bcrypt, { hash } from "bcrypt";
import crypto from "crypto";
const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "provide information please" });
    }
    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res
                .status(httpStatus.NOT_FOUND)
                .json({ message: "user not found" });
        }
        let isCorrectPassword = await bcrypt.compare(password, user.password);
        if (isCorrectPassword) {
            let token = crypto.randomBytes(20).toString("hex");
            user.token = token;
            await user.save();
            return res
                .status(httpStatus.OK)
                .json({ message: "Login successful", token: token });
        } else {
            return res
                .status(httpStatus.UNAUTHORIZED)
                .json({ message: "invalid password" });
        }
    } catch (e) {
        console.log(" ERROR 👉", e);
        return res.status(500).json({ message: `something wents wrong ${e}` });
    }
};

const register = async (req, res) => {
    const { name, username, password } = req.body;

    try {
        const existUser = await User.findOne({ username });
        if (existUser) {
            return res
                .status(httpStatus.FOUND)
                .json({ message: "user already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name: name,
            username: username,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(httpStatus.CREATED).json({ message: "user was created" });
    } catch (e) {
        console.log("REGISTER ERROR 👉", e);
        res.json({ message: "something wents wrong" });
    }
};
const getUserHistory = async (req, res) => {
    const { token } = req.query;

    try {
        if (!token) {
            return res.status(400).json({ message: "Token missing" });
        }

        const user = await User.findOne({ token });

        if (!user) {
            return res
                .status(404)
                .json({ message: "User not found or invalid token" });
        }

        const meetings = await Meeting.find({ user_id: user.username });

        return res.status(200).json(meetings);
    } catch (e) {
        console.log("History Error 👉", e);
        return res.status(500).json({ message: `Something went wrong ${e}` });
    }
};

const addToHistory = async (req, res) => {
    const { token, meeting_code } = req.body;

    try {
        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({ message: "Invalid token" });
        }

        const newMeeting = new Meeting({
            user_id: user.username,
            meetingCode: meeting_code,
        });

        await newMeeting.save();

        res.status(httpStatus.CREATED).json({
            message: "Added code to history",
        });
    } catch (e) {
        console.log("Add History Error 👉", e);
        res.status(500).json({ message: `Something went wrong ${e}` });
    }
};
export { login, register, getUserHistory, addToHistory };
