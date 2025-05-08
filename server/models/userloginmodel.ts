import mongoose, { Document, Schema } from 'mongoose';

interface UserType extends Document {
  username: string;
  password: string;
}

const userSchema = new Schema<UserType>({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model<UserType>('users', userSchema);

export default User;
