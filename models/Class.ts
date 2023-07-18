import mongoose, {Schema} from 'mongoose';

const ClassSchema = new Schema({
    name: {type: String, required: true},
    start: {type: Date, required: true},
    finish: {type: Date, required: true}
});

export const ClassModel = mongoose.models.classes 
    || mongoose.model('classes', ClassSchema);