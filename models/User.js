const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    w_id: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        trim: true,
    },
    college: {
        type: String,
        trim: true,
    },
    phoneNumber: {
        type: String,
    },
    dob: {
        type: Date,
    },
    profile_completed : {
        type : Boolean,
        default :false
    },
    active_field : {
        type : String ,
        trim :true
    },
    field_confirmation_state : {
        type : String,
        enum: ['asked','confirmation']
    },
    chats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
      }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User', userSchema);

module.exports = {User}
