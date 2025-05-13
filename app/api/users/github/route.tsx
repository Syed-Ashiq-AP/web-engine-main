import { createUser, findOneUser } from "@/queries/users";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { email, name } = await request.json();
    if (!email || !name)
      return NextResponse.json({ message: "Fileds are empty", success: false });
    const userDocument = await findOneUser(email);
    if (!userDocument) {
      await createUser(name, email);
      return NextResponse.json({ message: "Created!", success: true });
    }
    return NextResponse.json({ message: "Already exists", success: true });
  } catch (error) {
    console.log(error);
  }
};
