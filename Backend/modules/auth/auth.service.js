import { findUserByEmail, createUser, updateUser } from "../users/user.service.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const hashPassword = async (password) => {
  return bcrypt.hash(password, 12);
};

export const comparePassword = async (plain, hashed) => {
  return bcrypt.compare(plain, hashed);
};

export const issueTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m" }
  );
  const refreshToken = jwt.sign(
    { id: userId, role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d" }
  );
  return { accessToken, refreshToken };
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

export const registerUser = async ({ name, email, password }) => {
  const hashed = await hashPassword(password);
  return createUser({
    name,
    email,
    password: hashed,
    role: "applicant",
    loginAttempts: 0,
    isLocked: false,
  });
};

export const getUserByEmail = async (email) => {
  return findUserByEmail(email);
};

export const updateUserTokens = async (userId, refreshTokens) => {
  return updateUser(userId, { refreshTokens });
};