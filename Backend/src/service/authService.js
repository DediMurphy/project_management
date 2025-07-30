import {
  findUserByEmail,
  findUserByUsername,
  createUser,
} from "../repository/authRepository.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

export const registerUser = async ({ username, email, password, roleId }) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(password);
  const user = await createUser({
    username,
    email,
    password: hashedPassword,
    roleId,
  });

  return {
    user_id: user.user_id,
    username: user.username,
    email: user.email,
  };
};

export const loginUser = async ({ username, password }) => {
  const user = await findUserByUsername(username);
  if (!user || !(await comparePassword(password, user.password))) {
    throw new Error("Invalid credentials");
  }

  const payload = {
    user_id: user.user_id,
    role: user.role.role_name,
  };

  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return {
    user: {
      user_id: user.user_id,
      username: user.username,
      role: user.role.role_name,
    },
    accessToken,
    refreshToken,
  };
};

export const refreshTokenAccess = (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token not found");
  }

  const decode = verifyRefreshToken(refreshToken);
  const accessToken = signAccessToken({
    user_id: decode.user_id,
    role: decode.role,
  });

  return accessToken;
};
