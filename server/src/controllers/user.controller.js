import { User } from "../models/user.model.js";

const registerUser = async (req, res) => {
    const { name, email, password, phoneNumber, address } = req.body;

    if (!name || !email || !password || !phoneNumber || !address) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const newUser = await User.create({
            name,
            email,
            password,
            phoneNumber,
            address,
        });

        const user = await User.findById(newUser._id).select("-password");

        if (!user) {
            return res.status(500).json({
                success: false,
                message: "User registration failed",
            });
        }

        const token = user.generateAuthToken();

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });

        res.status(200).json({
            success: true,
            message: "User registered successfully",
            data: user,
            token,
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required",
        });
    }

    try {
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = user.generateAuthToken();

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                address: user.address,
            },
            token,
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const logoutUser = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });

    res.status(200).json({
        success: true,
        message: "User logged out successfully",
    });
};

const getCurrentUser = async (req, res) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "User not authenticated",
        });
    }

    res.status(200).json({
        success: true,
        data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            address: user.address,
        },
    });
};

export { registerUser, loginUser, logoutUser, getCurrentUser };
