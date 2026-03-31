import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required for creating a user account"],
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please provide a valid email address"],
        unique: [true, "Email is already in use"]
    },
    name: {
        type: String,
        required: [true, "Name is required for creating a user account"],
    },
    password: {
        type: String,
        required: [true, "Password is required for creating a user account"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false // this will prevent the password from being returned in queries by default
    }
}, {
    timestamps: true
});

// for hashing the password
userSchema.pre('save', async function() {

    if (!this.isModified('password')) {
        return;
    }

    const hash = await bcrypt.hash(this.password, 10);

    this.password = hash;

    return;
});


// method for comparing passwords
userSchema.methods.comparePassword = async function(password) {
    // this didn't get this.password so we changed the userModal.findOne() methods due to password being a select=false type field
    return await bcrypt.compare(password, this.password);
}


const userModal = mongoose.model("user", userSchema);

export default userModal;