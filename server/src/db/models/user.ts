import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // firstname: {
    //   type: String,
    //   required: true
    // },
    // lastname: {
    //   type: String,
    //   required: true
    // },
    email: {
      type: String,
      required: true,
      index: { unique: true }
    },
    password: {
      type: String,
      required: true
    },
    // telephone: {
    //   type: String,
    //   required: true
    // },
    count: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
