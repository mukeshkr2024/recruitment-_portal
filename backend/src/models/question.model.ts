import mongoose, { Schema, Document, Model } from 'mongoose';

interface IQuestion extends Document {
    question_id: string;
    position_id: mongoose.Types.ObjectId;
    question_text: string;
    options: mongoose.Types.ObjectId[];
}

const questionSchema: Schema<IQuestion> = new Schema({
    position_id: {
        type: Schema.Types.ObjectId,
        ref: 'JobPosition',
        required: [true, "Position ID is required"],
    },
    question_text: {
        type: String,
        required: [true, "Question text is required"],
    },
    options: [{
        type: Schema.Types.ObjectId,
        ref: 'Option',
        required: [true, "Options are required"],
    }]
}, {
    timestamps: true,
});

export const Question: Model<IQuestion> = mongoose.model<IQuestion>('Question', questionSchema);

