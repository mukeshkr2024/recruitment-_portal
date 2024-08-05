import mongoose, { Document, Model, Schema } from 'mongoose';

interface IOption extends Document {
    option_text: string;
    question_id: mongoose.Types.ObjectId;
    is_correct: boolean;
}

const optionSchema: Schema<IOption> = new Schema({
    option_text: {
        type: String,
        required: [true, "Option text is required"],
    },
    question_id: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
        required: [true, "Question ID is required"],
    },
    is_correct: {
        type: Boolean,
        required: [true, "Is correct flag is required"],
        default: false,
    }
}, {
    timestamps: true,
});

export const Option: Model<IOption> = mongoose.model<IOption>('Option', optionSchema);

