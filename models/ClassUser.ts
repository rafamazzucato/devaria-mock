import mongoose, {Schema} from 'mongoose';

const ClassUserSchema = new Schema({
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users'},
    class: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'classes'},
    planType: {type: String, required: true},
    paymentType: {type: String, required: true},
    lastBill: {type: Date, required: false},
    lastNotification: {type: Date, required: false},
    lastLowStatusNotification: {type: Date, required: false},
    lastSchedule: {type: String, required: false},
    currentPercentage: {type: Number, default: 0.0}
});

export const ClassUserModel = mongoose.models.classesUsers 
    || mongoose.model('classesUsers', ClassUserSchema);