import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      index: { unique: true }
    },
    password: {
      type: String,
      required: true
    },
    telephone: {
      type: String || Number,
      required: true
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
