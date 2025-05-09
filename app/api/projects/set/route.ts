import connectMongoDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { projectID, data } = await req.json();
    if (projectID && data) {
      await connectMongoDB();
      await Project.updateOne({ _id: projectID }, { $set: { data } });
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
