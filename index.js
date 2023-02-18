const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Parsing incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Defining the Mongoose schema
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    course: { type: String, required: true },
    email: { type: String, required: true },
    id: { type: Number, required: true },
});
const Student = mongoose.model('Student', studentSchema);

// Connecting to MongoDB database
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Defining routes
app.get('/students/:id', (req, res) => {
    const { id } = req.params;
    console.log('id:', id);
    try {
        const idNumber = parseInt(id);
        if (isNaN(idNumber)) {
            throw new Error();
        }
        Student.findOne({ id: idNumber }, (err, student) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal server error' });
            } else if (!student) {
                res.status(404).json({ error: 'Student not found' });
            } else {
                console.log('student:', student);
                res.json(student);
            }
        });
    } catch (err) {
        res.status(400).json({ error: 'Invalid ID format' });
    }
});




app.post('/students', (req, res) => {
    const { name, age, course, email, id } = req.body;
    const student = new Student({ name, age, course, email, id });
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
