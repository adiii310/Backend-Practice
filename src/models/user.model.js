import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trin: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    fullName: {
      type: String,
      require: true,
    },
    avatar: {
      type: String,
      require: true,
    },
    coverImage: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAcessToken = function () {
    return jwt.sign(
        {
            _id:this._id,
            userName:this.userName,
            email:this.email,
            fullName:this.fullName
        },
        process.env.SECRET_ACCESS_TOKEN,
        {
            expiresIn: process.env.EXPIRY_ACCESS_TOKEN
        }
    )
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id:this._id,
            userName:this.userName,
            email:this.email,
            fullName:this.fullName
        },
        process.env.SECRET_REFRESH_TOKEN,
        {
            expiresIn: process.env.EXPIRY_REFRESH_TOKEN
        }
    )
};


export const User = mongoose.model("User", userSchema);

