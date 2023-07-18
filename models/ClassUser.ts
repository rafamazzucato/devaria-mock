import mongoose, {Schema, ObjectId} from 'mongoose';

const ClassUserSchema = new Schema({
    userId: {type: ObjectId, required: true},
    classId: {type: ObjectId, required: true},
    planType: {type: String, required: true},
    paymentType: {type: String, required: true},
    lastBill: {type: Date, required: false},
    lastNotification: {type: Date, required: false},
    lastSchedule: {type: String, required: false},
    currentPercentage: {type: Number, default: 0.0}
});

export const ClassUserModel = mongoose.models.classesUsers 
    || mongoose.model('classesUsers', ClassUserSchema);