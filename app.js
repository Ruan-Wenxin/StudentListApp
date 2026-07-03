const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.urlencoded({ extended: false }));


app.use(express.static("public"));


app.set("view engine", "ejs");

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

app.get("/", (req, res) => {

    const sql = "SELECT * FROM student";

    connection.query(sql, (error, results) => {

        if (error) {
            console.log(error);
            res.send(error);
        } else {

            res.render("index", {
                students: results
            });

        }

    });

});


app.get("/student/:id", (req, res) => {

    const id = req.params.id;

    const sql = "SELECT * FROM student WHERE studentId=?";

    connection.query(sql, [id], (error, results) => {

        if (error) {

            console.log(error);

            res.send(error);

        } else {

            res.render("student", {

                student: results[0]

            });

        }

    });

});


app.get("/addStudent", (req, res) => {

    res.render("addStudent");

});


app.post("/addStudent", (req, res) => {

    const { name, dob, contact, image } = req.body;

    const sql =
        "INSERT INTO student (name,dob,contact,image) VALUES (?,?,?,?)";

    connection.query(

        sql,

        [name, dob, contact, image],

        (error, results) => {

            if (error) {

                console.log(error);

                res.send(error);

            } else {

                res.redirect("/");

            }

        }

    );

});



const PORT = 3000;

app.listen(PORT, () => {

    console.log(`Server running at http://localhost:${PORT}`);

});