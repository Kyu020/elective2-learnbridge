import { Request, Response } from "express";
import { getDriveInstance } from "../services/GoogleDriveService";
import Upload from "../models/Upload";
import fs from "fs";    

export const uploadFile = async ( req: Request, res: Response ) => {
  try {
    const file = req.file as Express.Multer.File;
    const { title, program } = req.body;
    const drive = getDriveInstance();

    const user = (req as any).user;
    const uploader = user.username;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const fileMetadata = { 
      name: file.originalname,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID as string],
    };

    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.path),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, webViewLink, name, parents",
    });

    const driveFile = response.data;

    await drive.permissions.create({
      fileId: driveFile.id as string,
      requestBody: { role: "reader", type: "anyone" },
    });

    const publicLink = `https://drive.google.com/file/d/${driveFile.id}/view`;

    fs.unlinkSync(file.path);

    const newUpload = new Upload({
        title,
        program,
        uploader,
        googleDriveFileId: driveFile.id,
        googleDriveLink: publicLink,
    });

    await newUpload.save();

    res.status(201).json({
        message: "File uploaded successfully",
        resource: newUpload
    })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed", error: err });
  }
}

export const getFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resource = await Upload.findById(id);

    if (!resource) {
      return res.status(404).json({ message: "File not found" });
    }

    res.status(200).json({
      message: "File fetched successfully", 
      resource
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch resource", error: err });
  }
};

export const getAllFile = async (req: Request, res: Response) => {
  try {
    const resources = await Upload.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Files fetched successfully", 
      resources
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch resources", error: err });
  }
};

