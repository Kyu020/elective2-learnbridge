import { Request, Response } from "express";
import Tutor from "../models/Tutor";
import User from "../models/User";

export const createTutorProfile = async (req: Request, res: Response) => {
    try {
    const user = (req as any).user;
    const studentId = user.studentId;
    const name = user.username;

    const { bio, subjects, hourlyRate, availability, credentials } = req.body;

    const existingProfile = await Tutor.findOne({ studentId });
    if (existingProfile) {
        return res.status(400).json({ message: "You've already created a tutor profile" });
    }

    const tutor = new Tutor({
        studentId,
        name,
        bio,
        subjects,
        hourlyRate,
        availability,
        credentials,
    });

    await tutor.save();

    return res.status(200).json({
        message: "Tutor profile created successfully",
        tutor,
    });

    } catch (err) {
    console.error("❌ Create Tutor Profile error:", err);
    res.status(500).json({ message: "Server error" });
    }
};

export const updateTutorProfile = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const studentId = user.studentId;

        const { bio, subjects, hourlyRate, availability, credentials } = req.body;

        // Check if tutor profile exists
        const tutor = await Tutor.findOne({ studentId });
        if (!tutor) {
            return res.status(404).json({ message: "Tutor profile not found" });
        }

        // Update only fields that exist in the request body
        if (bio !== undefined) tutor.bio = bio;
        if (subjects !== undefined) tutor.subjects = subjects;
        if (hourlyRate !== undefined) tutor.hourlyRate = hourlyRate;
        if (availability !== undefined) tutor.availability = availability;
        if (credentials !== undefined) tutor.credentials = credentials;

        await tutor.save();

        return res.status(200).json({
            message: "Tutor profile updated successfully",
            updatedProfile: tutor,
        });

    } catch (err) {
        console.error("❌ Update Tutor Profile error:", err);
        res.status(500).json({ message: "Server error" });
    }
};


export const toggleTutorMode = async (req: Request, res: Response) => {
    try {
    const studentId = (req as any).user.studentId;

    const userRecord = await User.findOne({ studentId });
    if (!userRecord) {
        return res.status(404).json({ message: "User not found" });
    }

    userRecord.isTutor = !userRecord.isTutor;
    await userRecord.save();

    return res.status(200).json({
        message: `Tutor mode for ${userRecord.username} is ${userRecord.isTutor ? "enabled" : "disabled"}`,
        isTutor: userRecord.isTutor,
    });

    } catch (err) {
    console.error("❌ Toggle Tutor Mode error:", err);
    res.status(500).json({ message: "Server error" });
    }
};

export const getAllTutorProfile = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        const currentStudentId = user.studentId;

        // Fetch all active tutors and select studentId only
        const activeTutors = await User.find({ isTutor: true }).select("studentId");

        // Filter out any users with missing studentId
        const activeTutorIds = activeTutors
            .map(u => u.studentId)
            .filter(id => id !== undefined && id !== null);

        // Ensure the array is not empty before querying Tutor
        if (!activeTutorIds.length) {
            return res.status(404).json({ message: "No active tutors found at the moment" });
        }

        // Fetch tutors whose studentId is in activeTutorIds but not the current user
        const tutors = await Tutor.find({
            studentId: { $in: activeTutorIds, $ne: currentStudentId }
        }).sort({ createdAt: -1 });

        if (!tutors.length) {
            return res.status(404).json({ message: "No active tutors found at the moment" });
        }

        return res.status(200).json({
            message: "Active tutors fetched successfully",
            tutors,
        });

    } catch (err: any) {
        console.error("❌ Get Tutor Profiles error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


export const getTutorProfile = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.params;

        const tutor = await Tutor.findOne({ studentId });

        if (!tutor) {
            return res.status(404).json({ message: "Tutor not found" });
        }

        return res.status(200).json({
            message: "Tutor profile fetched successfully",
            data: tutor,
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const verifyMyTutorProfile = async (req: Request, res: Response) => {
    try {
    const user = (req as any).user;
    const studentId = user.studentId;

    const tutorProfile = await Tutor.findOne({ studentId });

    if (!tutorProfile) {
        return res.status(200).json({ message: "No tutor profile found for this user" });
    }

    return res.status(200).json({
        message: "You have a tutor profile",
        tutorProfile,
    });

    } catch (err) {
    console.error("❌ Verify My Tutor Profile error:", err);
    res.status(500).json({ message: "Server error" });
    }
};
