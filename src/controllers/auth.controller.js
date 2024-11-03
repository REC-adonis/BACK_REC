import prisma from "../prisma.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookies.js";
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendEmailResetSucces } from "../mailtrap/email.js";

export const signup = async (req, res)=>{
    const {email, name, password} = req.body;

    try {
        if(!email || !password || !name){
            throw new Error("All fields are required");
        }

        const existingUser = await prisma.user.findFirst({where: {email}});
        if(existingUser){ return res.status(400).json({succes: false, message: "User already exists"}); }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const user = await prisma.user.create({
            data:{
                name,
                email,
                password: hashedPassword,
                verificationToken,
                verificationTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000)
            }
        });
        generateTokenAndSetCookie(res, user.user_id);
        await sendVerificationEmail(user.email, verificationToken);
        res.status(200).json({
			    success: true,
			    message: "Email verified successfully",
			    user: {
				    ...user._doc,
				    password: undefined,
			    },
		    });
    } catch (error) {
        res.status(400).json({succes: false, message: error.message});
    }
}

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: {
          verificationToken: code,
          verificationTokenExpiresAt: { gt: new Date() },
        },
      });
  
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired verification code",
        });
      }
  
      const updatedUser = await prisma.user.update({
        where: { user_id: user.user_id },
        data: {
          isVerified: true,
          verificationToken: null,
          verificationTokenExpiresAt: null,
        },
      });
      
  
      await sendWelcomeEmail(user.email, user.name);
  
      return res.status(200).json({
        success: true,
        message: "Email verified successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An error occurred during verification",
        error: error.message,
      });
    }
}
  
export const login = async (req, res)=>{
    const {email, password} = req.body;
    try {
      const user = await prisma.user.findUnique({where : {email: email,}});
      if(!user){
        res.status.json({succes: false, message:"Invalid credentials"});
      }
      const isPasswordValid = await bcryptjs.compare(password, user.password);
      if(!isPasswordValid){
        return res.status(400).json({success: false, message: "Invalid credentials"});
      }

      generateTokenAndSetCookie(res, user.user_id);

      //update last login
      await prisma.user.update({
        where:{
          user_id:user.user_id
        },
        data:{
          last_login: new Date(),
        }
      });

      const { password: _, ...userWithoutPassword } = user;
      res.status(200).json({
        success: true,
        message: "Logged in successfully",
        user: userWithoutPassword,
      });
    } catch (error) {
      console.log("Error in login",error);
      res.status(400).json({succes: false, message: error.message})
    }
}

export const logout = async (req, res)=>{
    res.clearCookie("token");
    res.status(200).json({succes: true, message: "Logged out successfully"});
}

export const forgotPassword = async (req, res) =>{
  const {email} = req.body;
  try {
    const user = await prisma.user.findUnique({where : {email: email,}});
    if(!user){
      return res.status(404).json({succes: false, message: "User not found"});
    }
    const resetToken = crypto.randomBytes(20).toString("hex");

    await prisma.user.update({
      where : {
        email: email
      },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
      }
    });

    await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
    return res.status(200).json({succes: true, message: "Password reset link sent to your email"});
  } catch (error) {
    console.log(error);
    res.status(404).json({succes: false, message: error.message});
  }
}

export const resetPassword = async (req, res) =>{
  const {token} = req.params;
  const {password} = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpiresAt: { gt: new Date() },
      },
    });
    if(!user){
      return res.status(400).json({succes: false, message: "Invalid or expired token"});
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    await prisma.user.update({
      where: { user_id: user.user_id },
      data:{
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpiresAt: null,
      }
    });

    await sendEmailResetSucces(user.email);

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({succes: false, message: error.message});
  }
}

export const checkAuth = async (req, res) =>{
 try {
  const user = await prisma.user.findUnique({
    where: {
      user_id: req.user_id,
    },
    select: {
      password: false, // Excluye el campo password
      user_id: true, // Incluye otros campos que deseas devolver
      email: true,
      name: true,
      last_login: true,
      isVerified: true,
    },
  });
  if(!user) return res.status(400).json({succes: false, message: "User not found"});

  res.status(200).json({succes: true, user})
 } catch (error) {
  console.log("Error in CheckAuth", error);
  res.status(400).json({succes:false, message:error.message});
 } 
}