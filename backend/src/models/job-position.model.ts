import mongoose, { Schema, Document, Model, Mongoose } from 'mongoose';

interface IJobPosition extends Document {
    title: string;
    description: string;
    requirements: string;
    questions: mongoose.Types.ObjectId[];
    applicants: mongoose.Types.ObjectId[];
}

const jobPositionSchema: Schema<IJobPosition> = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    questions: [
        {
            type: Schema.ObjectId,
            ref: "Questions"
        }
    ],
    applicants: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
}, {
    timestamps: true,
});

export const JobPosition: Model<IJobPosition> = mongoose.model<IJobPosition>('JobPosition', jobPositionSchema);

