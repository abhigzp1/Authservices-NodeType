import { User } from "../../models/user.model";
import { hashPassword, comparePassword } from "../../utils/hash";
import { generateToken, verifyToken } from "../../utils/jwt";

export const userResolvers = {
  Query: {
    me: async (_: any, __: any, { user }: any) => {
      if (!user) throw new Error("Not authenticated");
      return await User.findById(user.id);
    }
  },
  Mutation: {
    signup: async (_: any, { email, password }: any) => {
      const hashed = await hashPassword(password);
      const user = await User.create({ email, password: hashed });
      const token = generateToken(user._id.toString());
      user.token = token;
      await user.save();
      return user;
    },
    login: async (_: any, { email, password }: any) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");

      const isValid = await comparePassword(password, user.password);
      if (!isValid) throw new Error("Invalid credentials");

      const token = generateToken(user._id.toString());
      user.token = token;
      await user.save();
      return user;
    }
  }
};
