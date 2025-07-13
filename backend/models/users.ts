import { Schema, model, Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  isAdmin: boolean;
  googleId?: string;
  provider?: 'local' | 'google';
  isVerified?: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  password: { type: String, required: false },
  isAdmin: { type: Boolean, default: false },
  googleId: { type: String, sparse: true },
  provider: { type: String, enum: ['local', 'google'], default: 'local' },
  isVerified: { type: Boolean, default: false },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  emailVerificationToken: { type: String },
  emailVerificationExpires: { type: Date },
},
  {
    timestamps: true,
  });

UserSchema.index({ email: 1, provider: 1 }, { unique: true });

const UserModel = model<IUser>("users", UserSchema);

export default UserModel;
