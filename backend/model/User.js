import mongoose from "mongoose";
import { uniqueNamesGenerator, adjectives } from "unique-names-generator";

// Club and adjective lists
const club = ['SES', 'Epsilon', 'Renaissance', 'IIT', 'Bhilai', 'CGPA', 'Swara', 'Fintech', 'IITian', 'Beathacker', 'Drishya', 'Ingenuity',
    'Goals', 'DesignX', 'Ed1', 'Ed2', 'Kanhar', 'Indravati', 'Gopad', 'Mess', 'CSE', 'Mechanical', 'College', '10CG', '9CG', 'LowCGPA'
];

const moreAdjective = [...adjectives,
    'topper', 'king', 'queen', 'prince', 'princess',
    'warrior', 'saviour', 'guru', 'legend', 'glitchy',
    'coder', 'ninja', 'wizard', 'chaotic', 'silent', 'alpha'
];

// TEMPORARY HOLDER for model to prevent circular use
let User;

const generateCampusID = async () => {
    const newId = uniqueNamesGenerator({
        dictionaries: [club, moreAdjective],
        length: 2,
        separator: '_',
        style: "capital"
    });

    const existingUser = await User.findOne({ campusId: newId });
    if (existingUser) {
        return generateCampusID(); // recursively try again
    }
    return newId;
};

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true, // Clerk user ID
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    firstName: {
        type: String,
        default: '',
    },
    lastName: {
        type: String,
        default: '',
    },
    imageUrl: {
        type: String,
        default: '',
    },
    isOnline: { type: Boolean, default: false },
    campusId: {
        type: String,
        unique: true,
        default: null
    }
}, { timestamps: true });

// Make sure campusId is generated before validation
userSchema.pre('validate', async function (next) {
    if (!this.campusId) {
        this.campusId = await generateCampusID();
    }
    next();
});

// Create and assign model AFTER defining schema
User = mongoose.model('User', userSchema);
export default User;
