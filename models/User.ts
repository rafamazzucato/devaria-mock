import mongoose, {Schema} from 'mongoose';

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    role: {type: String, default: 'USER'},
    password: {type: String, required: true},
    isActive: {type: Boolean, default: true}
});

export const UserModel = mongoose.models.users 
    || mongoose.model('users', UserSchema);