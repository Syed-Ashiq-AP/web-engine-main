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
  password?: string
) => {
  try {
    const user: { name: string; email: string; password?: string } = {
      name: username,
      email,
    };
    if (password) user.password = password;
    await User.create(user);
  } catch (error) {
    return false;
  }
};
