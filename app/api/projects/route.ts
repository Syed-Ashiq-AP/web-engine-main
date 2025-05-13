import connectMongoDB from "@/lib/mongodb";
import Project from "@/models/Project";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { email, name } = await req.json();
    if (email && name) {
      await connectMongoDB();
      const user = await User.findOne({ email });
      if (!user)
        return NextResponse.json(
          { message: "Missign user", success: false },
          { status: 500 }
        );

      await Project.create({ userID: user._id, name, data: {} });
      return NextResponse.json(
        { message: "Created", success: true },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { message: "Missign fields", success: false },
        { status: 500 }
      );
    }
  } catch (e) {
    return NextResponse.json({ message: e, success: false }, { status: 500 });
  }
};
