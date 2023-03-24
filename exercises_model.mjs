import mongoose from 'mongoose';
const {Schema} = mongoose;
import 'dotenv/config';

mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);

const db = mongoose.connection;

// Define schema
const exerciseSchema = new Schema({
    name: {type: String, required: true},
    reps: {type: Number, required: true},
    weight: {type: Number, required: true},
    unit: {type: String, required: true},
    date: {type: String, required: true}
});

// Create model from schema
const Exercise = mongoose.model("Exercise", exerciseSchema);

// Create
const createExercise = async (name, reps, weight, unit, date) => {
    const exercise = new Exercise({ name: name, reps: reps, weight: weight, unit: unit, date: date });
    return exercise.save();
};

// Retrieve (one)
const findExerciseById = async (_id) => {
    const query = await Exercise.findById(_id);
    return query;
};


// Retrieve (all)
const findExercises = async () => {
    const query = await Exercise.find({});
    return query;
};


// Update
const replaceExercise = async (_id, name, reps, weight, unit, date) => {
    const result = await Exercise.updateOne({ _id: _id}, {name: name, reps: reps, weight: weight, unit: unit, date: date});
    return result.matchedCount;
};

// Delete
const deleteExercise = async (_id) => {
    const result = await Exercise.deleteOne({_id: _id});
    return result.deletedCount;
};


db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

export { createExercise, findExerciseById, findExercises, replaceExercise, deleteExercise }