import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
         
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exist with this email.',
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile:{
                profilePhoto:cloudResponse.secure_url,
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
         (error);
    }
}
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
					expiresIn: "1d",
				});

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
         (error);
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
         (error);
    }
}





export const updateProfile = async (req, res) => {
	try {
		const { fullname, email, phoneNumber, bio, skills } = req.body;

		// Handle profile picture and resume upload
		const profilePicture = req.files?.profilePicture?.[0];
		const resume = req.files?.resume?.[0];

		let profilePictureUrl = null;
		let resumeUrl = null;

		if (profilePicture) {
			const fileUri = getDataUri(profilePicture);
			const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
			profilePictureUrl = cloudResponse.secure_url; // Save the cloudinary URL
		}

		if (resume) {
			const fileUri = getDataUri(resume);
			const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
			resumeUrl = cloudResponse.secure_url; // Save the cloudinary URL for resume
		}

		// Convert skills to an array if it's provided
		let skillsArray = [];
		if (skills) {
			skillsArray = skills.split(",").map((skill) => skill.trim());
		}

		// Get the authenticated user ID from the request (middleware authentication)
		const userId = req.user.id;

		let user = await User.findById(userId);

		if (!user) {
			return res.status(400).json({
				message: "User not found.",
				success: false,
			});
		}

		// Update user profile fields if the data is provided
		if (fullname) user.fullname = fullname;
		if (email) user.email = email;
		if (phoneNumber) user.phoneNumber = phoneNumber;
		if (bio) user.profile.bio = bio;
		if (skills) user.profile.skills = skillsArray;

		// Update profile picture and resume if they were uploaded
		if (profilePictureUrl) {
			user.profile.profilePicture = profilePictureUrl; // Save the profile picture URL
		}

		if (resumeUrl) {
			user.profile.resume = resumeUrl; // Save the resume URL
			user.profile.resumeOriginalName = resume.originalname; // Save the original file name
		}

		// Save the updated user data
		await user.save();

		// Create a sanitized user object to return
		const updatedUser = {
			_id: user._id,
			fullname: user.fullname,
			email: user.email,
			phoneNumber: user.phoneNumber,
			role: user.role,
			profile: user.profile,
		};

		return res.status(200).json({
			message: "Profile updated successfully.",
			user: updatedUser,
			success: true,
		});
	} catch (error) {
		console.error("Error updating profile:", error);
		return res.status(500).json({
			message: "An error occurred while updating the profile.",
			success: false,
		});
	}
};
