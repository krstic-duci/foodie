import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // TODO: add later
    // lastname: {
    //   type: String,
    //   required: true
    // },
    // telephone: {
    //   type: String || Number,
    //   required: true
    // },
    firstName: {
      type: String,
      default: ""
    },
    email: {
      type: String,
      required: true,
      index: { unique: true }
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
