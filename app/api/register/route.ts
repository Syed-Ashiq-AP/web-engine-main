import { hashPassword } from "@/lib/hash";
import connectMongoDB from "@/lib/mongodb";
import { createUser, findOneUser } from "@/queries/users";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { username, email, password } = await req.json();
    const hashedPassword = await hashPassword(password);
    const user = await findOneUser(email);
    if (user) {
      return NextResponse.json(
        { message: "Email is already registered", success: false },
        { status: 201 }
      );
    }
    await connectMongoDB();
    await createUser(username, email, hashedPassword);
    return NextResponse.json(
      { message: "Created", success: true },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error, success: false },
      { status: 500 }
    );
  }
};
