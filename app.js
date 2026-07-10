const express = require("express");
const mysql = require("mysql2");
const multer = require("multer");

const app = express();

// --------------------------------------------------
// Express settings
// --------------------------------------------------

app.use(express.urlencoded({
    extended: false
}));

app.use(express.static("public"));

app.set("view engine", "ejs");

// --------------------------------------------------
// Multer settings
// Uploaded images will be saved in public/images
// --------------------------------------------------

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage
});

// --------------------------------------------------
// MySQL connection
// --------------------------------------------------

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Xing123123@@@",
    database: "c237_studentlistapp"
});

connection.connect((err) => {
    if (err) {
        console.error(
            "Error connecting to MySQL:",
            err
        );

        return;
    }

    console.log(
        "Connected to MySQL database"
    );
});

// --------------------------------------------------
// READ: Display all students
// --------------------------------------------------

app.get("/", (req, res) => {
    const sql = "SELECT * FROM student";

    connection.query(
        sql,
        (error, results) => {
            if (error) {
                console.error(error);
                return res.send(error);
            }

            res.render("index", {
                students: results
            });
        }
    );
});

// --------------------------------------------------
// READ: Display one student
// --------------------------------------------------

app.get("/student/:id", (req, res) => {
    const studentId = req.params.id;

    const sql =
        "SELECT * FROM student WHERE studentId = ?";

    connection.query(
        sql,
        [studentId],
        (error, results) => {
            if (error) {
                console.error(error);
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
// CREATE: Add new student with uploaded image
// --------------------------------------------------

app.post(
    "/addStudent",
    upload.single("image"),
    (req, res) => {
        const {
            name,
            dob,
            contact
        } = req.body;

        let image = null;

        if (req.file) {
            image = req.file.filename;
        }

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
                    console.error(
                        "Error adding student:",
                        error
                    );

                    return res.send(
                        "Error adding student"
                    );
                }

                res.redirect("/");
            }
        );
    }
);

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
                console.error(error);

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
// UPDATE: Update student and optional image
// --------------------------------------------------

app.post(
    "/editStudent/:id",
    upload.single("image"),
    (req, res) => {
        const studentId = req.params.id;

        const {
            name,
            dob,
            contact,
            currentImage
        } = req.body;

        let image = currentImage;

        if (req.file) {
            image = req.file.filename;
        }

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
    }
);

// --------------------------------------------------
// DELETE: Delete student
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