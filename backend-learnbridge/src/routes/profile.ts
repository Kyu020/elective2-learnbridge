import { Router } from "express"
import { createProfile, getProfile, updateProfile } from "../controllers/profileController"
import { verifyToken, checkBlacklistedToken } from "../middleware/authMiddleware";

const router = Router();

router.get("getprofile/:userid", verifyToken, checkBlacklistedToken, getProfile)
router.post("createprofile", verifyToken, checkBlacklistedToken, createProfile)
router.put("updateprofile", verifyToken, checkBlacklistedToken, updateProfile)