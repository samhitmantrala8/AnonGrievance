import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    username: String,
    text: String,
}, { timestamps: true });

const messageSchema = new mongoose.Schema({
    username: String,
    description: String,
    media: String,
    upvotes: {
        type: [String],  // Make it an array of strings
        default: [],
    },
    downvotes: {
        type: [String],  // Make it an array of strings
        default: [],
    },
    comments: [commentSchema],
}, { timestamps: true });

// Set TTL index on createdAt field
messageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 48 * 60 * 60 });  // 48 hours * 60 minutes * 60 seconds

const Message = mongoose.model('Message', messageSchema);

export default Message;
