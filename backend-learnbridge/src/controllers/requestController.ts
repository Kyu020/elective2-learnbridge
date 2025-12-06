import { Request, Response } from "express";
import RequestModel from "../models/Request";
import User from "../models/User";

export const sendRequest = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const studentId = user.studentId;

    const { tutorId, sessionDate, duration, price, subject, comment } = req.body;

    if (!studentId) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    if (!tutorId) {
      return res.status(400).json({ message: "Tutor unavailable or not registered" });
    }

    if (!sessionDate || !duration || !price) {
      return res.status(400).json({ message: "Missing required session details" });
    }

    // Prevent duplicate pending requests
    const existingPending = await RequestModel.findOne({
      studentId,
      tutorId,
      status: "pending"
    });

    if (existingPending) {
      return res.status(400).json({
        message: "You already have a pending request with this tutor"
      });
    }

    const newRequest = new RequestModel({
      tutorId,
      studentId,
      sessionDate,
      duration,
      price,
      subject,
      comment,
      status: "pending",
    });

    await newRequest.save();

    const studentData = await User.findOne(
      { studentId },
      "username email program specialization profilePicture"
    ).lean();
    
    // Convert to plain object and ensure all fields are present
    const studentInfo = studentData ? {
      username: studentData.username || "",
      name: studentData.username || "", // Map username to name for frontend compatibility
      email: studentData.email || "",
      program: studentData.program || "",
      specialization: studentData.specialization || "",
      profilePicture: studentData.profilePicture || null
    } : null;

    return res.status(201).json({
      message: "Request sent successfully",
      body: { ...newRequest.toObject(), studentInfo }
    });

  } catch (err: any) {
    console.error("❌ Send Request error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getTutorRequests = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user?.studentId)
      return res.status(400).json({ message: "Invalid or missing token" });

    if (!user?.isTutor)
      return res.status(403).json({ message: "Unauthorized: Not a Tutor" });

    const requests = await RequestModel.find({ tutorId: user.studentId }).sort({ createdAt: -1 });

    if (requests.length === 0){
      return res.status(200).json({ message:"No Records Found" })
    }

    const enrichedRequests = await Promise.all(
      requests.map(async (reqItem: any) => {
        const studentData = await User.findOne(
          { studentId: reqItem.studentId },
          "username email program specialization profilePicture"
        ).lean();
        
        // Convert to plain object and ensure all fields are present
        const studentInfo = studentData ? {
          username: studentData.username || "",
          name: studentData.username || "", // Map username to name for frontend compatibility
          email: studentData.email || "",
          program: studentData.program || "",
          specialization: studentData.specialization || "",
          profilePicture: studentData.profilePicture || null
        } : null;
      
        return { ...reqItem.toObject(), studentInfo };
      })
    );

    res.status(200).json({
      message: "Requests fetched successfully",
      body: enrichedRequests,
    });

  } catch (err) {
    console.error("❌ Get Requests error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStudentRequests = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user?.studentId)
      return res.status(400).json({ message: "Invalid or missing token" });

    const requests = await RequestModel.find({ studentId: user.studentId }).sort({ createdAt: -1 });

    if (requests.length === 0){
      return res.status(200).json({ message:"No Records Found" })
    }

    const enrichedRequests = await Promise.all(
      requests.map(async (reqItem: any) => {
        const tutorData = await User.findOne(
          { studentId: reqItem.tutorId },
          "username email program specialization profilePicture"
        ).lean();
        
        // Convert to plain object and ensure all fields are present
        const tutorInfo = tutorData ? {
          username: tutorData.username || "",
          name: tutorData.username || "", // Map username to name for frontend compatibility
          email: tutorData.email || "",
          program: tutorData.program || "",
          specialization: tutorData.specialization || "",
          profilePicture: tutorData.profilePicture || null
        } : null;

        return { ...reqItem.toObject(), tutorInfo };
      })
    );

    res.status(200).json({
      message: "Student requests fetched successfully",
      body: enrichedRequests,
    });

  } catch (err) {
    console.error("❌ Get Student Requests error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateRequestStatus = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const { status, tutorComment } = req.body;

    if (!user?.isTutor) {
      return res.status(403).json({ message: "Unauthorized: Tutor role required" });
    }

    const updated = await RequestModel.findOneAndUpdate(
      { _id: id, tutorId: user.studentId },
      {
        status,
        tutorComment,
        tutorSeen: true,
        studentSeen: false
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Request not found or unauthorized" });
    }

    // Enrich with student info
    const studentData = await User.findOne(
      { studentId: updated.studentId },
      "username email program specialization profilePicture"
    ).lean();
    
    const tutorData = await User.findOne(
      { studentId: updated.tutorId },
      "username email program specialization profilePicture"
    ).lean();
    
    // Convert to plain objects and ensure all fields are present
    const studentInfo = studentData ? {
      username: studentData.username || "",
      name: studentData.username || "", // Map username to name for frontend compatibility
      email: studentData.email || "",
      program: studentData.program || "",
      specialization: studentData.specialization || "",
      profilePicture: studentData.profilePicture || null
    } : null;
    
    const tutorInfo = tutorData ? {
      username: tutorData.username || "",
      name: tutorData.username || "", // Map username to name for frontend compatibility
      email: tutorData.email || "",
      program: tutorData.program || "",
      specialization: tutorData.specialization || "",
      profilePicture: tutorData.profilePicture || null
    } : null;

    const enrichedRequest = {
      ...updated.toObject(),
      studentInfo,
      tutorInfo
    };

    return res.status(200).json({
      message: "Request status updated successfully",
      body: enrichedRequest
    });

  } catch (err: any) {
    console.error("❌ Update Request Status error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
