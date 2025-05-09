import User from "@/models/User";

export const findOneUser = async (email: string) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    return false;
  }
};

export const createUser = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    await User.create({ name: username, email, password });
  } catch (error) {
    return false;
  }
};
