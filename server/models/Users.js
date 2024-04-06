import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    emailKey: { type: String, required: true },
    emailIv: { type: String, required: true },
    passwordKey: { type: String, required: true },
    passwordIv: { type: String, required: true },
});

userSchema.pre('remove', async function(next) {
    await Message.deleteMany({ username: this.username });
    next();
});

const User = mongoose.model('User', userSchema);

export default User;
