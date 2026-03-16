import User from "./user.model.js";

export const findUserById = async (id) => {
  return User.findById(id).select("-password -refreshTokens");
};

export const findUserByEmail = async (email) => {
  return User.findOne({ email: email.toLowerCase().trim() }).select("+password +refreshTokens");
};

export const createUser = async (data) => {
  return User.create(data);
};

export const updateUser = async (id, updates) => {
  return User.findByIdAndUpdate(id, updates, { new: true }).select("-password -refreshTokens");
};