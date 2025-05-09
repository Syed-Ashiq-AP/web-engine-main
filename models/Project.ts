import mongoose, { Schema, model } from "mongoose";
export interface ProjectDocument {
  _id: string;
  userID: string;
  name: string;
  data: any;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<ProjectDocument>(
  {
    userID: {
      type: String,
      required: [true, "userID is required"],
    },
    data: {
      type: Schema.Types.Mixed,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

const Project =
  mongoose.models?.Project || model<ProjectDocument>("Project", ProjectSchema);
export default Project;
