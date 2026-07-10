const express = require("express");
const mysql = require("mysql2");

const app = express();

// Allow Express to read form data
app.use(express.urlencoded({
    extended: false
}));

// Allow Express to access files inside public folder
app.use(express.static("public"));

// Set EJS as the view engine
app.set("view engine", "ejs");


// --------------------------------------------------
// Database connection
// --------------------------------------------------

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Xing123123@@@",
    database: "c237_studentlistapp"
});

connection.connect((err) => {

    if (err) {

        console.log(err);

    } else {

        console.log("Connected to MySQL database");

    }

});


// --------------------------------------------------
// READ: Display all students
// --------------------------------------------------

app.get("/", (req, res) => {

    const sql = "SELECT * FROM student";

    connection.query(sql, (error, results) => {

        if (error) {

            console.log(error);

            return res.send(error);

        }

        res.render("index", {
            students: results
        });

    });

});


// --------------------------------------------------
// READ: Display one student
// --------------------------------------------------

app.get("/student/:id", (req, res) => {

    const id = req.params.id;

    const sql =
        "SELECT * FROM student WHERE studentId = ?";

    connection.query(
        sql,
        [id],
        (error, results) => {

            if (error) {

                console.log(error);

                return res.send(error);

            }

            if (results.length > 0) {

                res.render("student", {
                    student: results[0]
                });

            } else {

                res.send("Student not found");

            }

        }
    );

});


// --------------------------------------------------
// CREATE: Display Add Student page
// --------------------------------------------------

app.get("/addStudent", (req, res) => {

    res.render("addStudent");

});


// --------------------------------------------------
// CREATE: Add new student
// --------------------------------------------------

app.post("/addStudent", (req, res) => {

    const {
        name,
        dob,
        contact,
        image
    } = req.body;

    const sql = `
        INSERT INTO student
        (name, dob, contact, image)
        VALUES (?, ?, ?, ?)
    `;

    connection.query(
        sql,
        [
            name,
            dob,
            contact,
            image
        ],
        (error, results) => {

            if (error) {

                console.log(error);

                return res.send(error);

            }

            res.redirect("/");

        }
    );

});


// --------------------------------------------------
// UPDATE: Display Edit Student page
// --------------------------------------------------

app.get("/editStudent/:id", (req, res) => {

    const studentId = req.params.id;

    const sql =
        "SELECT * FROM student WHERE studentId = ?";

    connection.query(
        sql,
        [studentId],
        (error, results) => {

            if (error) {

                console.error(
                    "Database query error:",
                    error
                );

                return res.send(
                    "Error retrieving student"
                );

            }

            if (results.length > 0) {

                res.render("editStudent", {
                    student: results[0]
                });

            } else {

                res.send("Student not found");

            }

        }
    );

});


// --------------------------------------------------
// UPDATE: Update student in database
// --------------------------------------------------

app.post("/editStudent/:id", (req, res) => {

    const studentId = req.params.id;

    const {
        name,
        dob,
        contact,
        image
    } = req.body;

    const sql = `
        UPDATE student
        SET
            name = ?,
            dob = ?,
            contact = ?,
            image = ?
        WHERE studentId = ?
    `;

    connection.query(
        sql,
        [
            name,
            dob,
            contact,
            image,
            studentId
        ],
        (error, results) => {

            if (error) {

                console.error(
                    "Error updating student:",
                    error
                );

                return res.send(
                    "Error updating student"
                );

            }

            res.redirect("/");

        }
    );

});


// --------------------------------------------------
// DELETE: Delete student from database
// --------------------------------------------------

app.get("/deleteStudent/:id", (req, res) => {

    const studentId = req.params.id;

    const sql =
        "DELETE FROM student WHERE studentId = ?";

    connection.query(
        sql,
        [studentId],
        (error, results) => {

            if (error) {

                console.error(
                    "Error deleting student:",
                    error
                );

                return res.send(
                    "Error deleting student"
                );

            }

            res.redirect("/");

        }
    );

});


// --------------------------------------------------
// Start server
// --------------------------------------------------

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});