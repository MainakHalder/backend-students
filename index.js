const { initializeDatabase } = require("./db/db.connection");
const Student = require("./models/students.model");
initializeDatabase();

const express = require("express");
const app = express();
app.use(express.json());

const cors = require("cors");
const corsOption = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOption));

app.get("/", (req, res) => {
  res.send("Server is working");
});

const addStudents = async (newStudent) => {
  try {
    const student = new Student(newStudent);
    const saveStudent = await student.save();
    return saveStudent;
  } catch (error) {
    console.error("Error: ", error);
  }
};

app.post("/details", async (req, res) => {
  try {
    const newStudent = await addStudents(req.body);
    res
      .status(201)
      .json({ message: "Student added successfully", student: newStudent });
  } catch (error) {
    res.status(500).json({ error: "Failed to add students." });
  }
});

const getAllStudents = async () => {
  try {
    const allStudents = await Student.find();
    return allStudents;
  } catch (error) {
    throw error;
  }
};

app.get("/details", async (req, res) => {
  try {
    const readStudents = await getAllStudents();
    if (readStudents.length) {
      res.json(readStudents);
    } else {
      res.status(404).json({ error: "Students not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get students" });
  }
});

app.put("/details/:id", async (req, res) => {
  const studentId = req.params.id;
  const updatedStudentData = req.body;

  try {
    const updatedStudent = await Student.findByIdAndDelete(
      studentId,
      updatedStudentData,
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/details/:id", async (req, res) => {
  const studentId = req.params.id;
  try {
    const deletedStudent = await Student.findByIdAndRemove(studentId);
    if (!deletedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.status(200).json({
      message: "Student deleted successfully",
      student: deletedStudent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 6200;
app.listen(PORT, () => {
  console.log("The server is running on port: ", PORT);
});
