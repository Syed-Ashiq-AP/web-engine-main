import connectMongoDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userID = searchParams.get("id");
    await connectMongoDB();
    const projects = await Project.find({ userID });
    if (projects) {
      return NextResponse.json(
        { projects: JSON.stringify(projects), success: true },
        { status: 201 }
      );
    }
    return NextResponse.json(
      { message: "failed", success: false },
      { status: 500 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error, success: false },
      { status: 500 }
    );
  }
};
