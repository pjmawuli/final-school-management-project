const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Parsing incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Defining Mongoose schema
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    class: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
const Student = mongoose.model('Student', studentSchema);

// Defining routes
app.get('/students/:id', (req, res) => {
    const { id } = req.params;
    Student.findById(id, (err, student) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        } else if (!student) {
            res.status(404).json({ error: 'Student not found' });
        } else {
            res.json(student);
        }
    });
});

app.post('/students', (req, res) => {
    const { name, age, class: studentClass, email } = req.body;
    const student = new Student({ name, age, class: studentClass, email });
    student.save((err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(student);
        }
    });
});

// Starting the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
