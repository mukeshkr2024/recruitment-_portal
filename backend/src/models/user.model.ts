import mongoose, { Schema, Document, Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, "Email is not valid"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
        type: String,
        enum: ["admin", "applicant"],
        required: [true, "Role is required"],
        default: "applicant",
    }
}, {
    timestamps: true,
});

// Pre-save middleware to hash the password
userSchema.pre<IUser>("save", async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

