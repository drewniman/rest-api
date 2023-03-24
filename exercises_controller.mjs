import 'dotenv/config';
import express from 'express';
import asyncHandler from 'express-async-handler';
import * as exercises from './exercises_model.mjs';
import validator from 'validator';

const app = express();

const PORT = process.env.PORT;

app.use(express.json());

/**
*
* @param {string} date
* Return true if the date format is MM-DD-YY where MM, DD and YY are 2 digit integers
*/
function isDateValid(date) {
    // Test using a regular expression. 
    // To learn about regular expressions see Chapter 6 of the text book
    const format = /^\d\d-\d\d-\d\d$/;
    return format.test(date);
}

function isBodyValid(req) {
    // Check if request body meets specifications
    let valid = true;
    // Check if any properties are missing
    if (req.body.name === undefined || 
        req.body.reps === undefined ||
        req.body.weight === undefined ||
        req.body.unit === undefined ||
        req.body.date === undefined) {
            valid = false
    }
    
    if (typeof req.body.name !== 'string' || req.body.name.length === 0) {
        valid = false;
    }

    if (typeof req.body.reps !== "number" || req.body.reps <= 0) {
        valid = false;
    }

    if (typeof req.body.weight !== "number" || req.body.weight <= 0) {
        valid = false;
    }

    if (typeof req.body.unit !== "string") {
        valid = false;
    }

    if (req.body.unit !== "lbs" && req.body.unit !== "kgs") {
        valid = false;
    }

    if (!isDateValid(req.body.date)) {
        valid = false;
    }

    return valid;
}

// POST route handler
app.post("/exercises", asyncHandler(async (req, res) => {
    // // validate request
    if (!isBodyValid(req)) {
        res.status(400).json({Error: "Invalid request"});
    } else {
        const exercise = await exercises.createExercise(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date);
        res.status(201).json(exercise);
    }
}));



// GET (read one) route handler
app.get("/exercises/:_id", asyncHandler( async (req, res) => {
    const exerciseId = req.params._id;
    const exercise = await exercises.findExerciseById(exerciseId);
    if (exercise !== null) {
        res.json(exercise);
    } else {
        res.status(404).json({ Error: "Not found"});
    }
}));

// GET (read all) route handler
app.get("/exercises", asyncHandler(async (req, res) => {
    const exercise = await exercises.findExercises();
    res.send(exercise);
}));

// PUT route handler
app.put("/exercises/:_id", asyncHandler(async (req, res) => {
    // validate request
    if (!isBodyValid(req)) {
        res.status(400).json({Error: "Invalid request"});
    } else {
        const numUpdated = await exercises.replaceExercise(req.params._id, req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date);
        if (numUpdated === 1) {
            res.json({_id: req.params._id, name: req.body.name, reps: req.body.reps, weight: req.body.weight, unit: req.body.unit, date: req.body.date});
        } else {
            res.status(404).json({Error: "Not found"});
        }
    }
}));

// DELETE route handler
app.delete("/exercises/:_id", asyncHandler(async (req, res) => {
    const deletedCount = await exercises.deleteExercise(req.params._id);
    if (deletedCount === 1) {
        res.status(204).send();
    } else {
        res.status(404).json({Error: "Resource not found"});
    }
}));


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});