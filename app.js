// Importing all required modules------------------------------------------------------------------------------------

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Setting view engine and other stuff--------------------------------------------------------------------------------

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.set("view engine", "ejs");

// Connecting mongodb database and creating schema----------------------------------------------------------------------

mongoose.connect("mongodb://localhost:27017/login-data", {
    useNewUrlParser: true,
});

const loginSchema = new mongoose.Schema({
    email: String,
    password: String,
});

const tloginSchema = new mongoose.Schema({
    email: String,
    password: String,
    tID: String,
});

const sData = mongoose.model("student", loginSchema);
const tData = mongoose.model("teacher", tloginSchema);

// Creating routes -----------------------------------------------------------------------------------------------------

app.route("/")
    .get((req, res) => {
        res.render("login");
    });

app.route("/students")
    .get((req, res) => {
        res.render("student_login.ejs");
    })
    .post((req, res) => {
        const semail = req.body.semail;
        const spassword = req.body.spass;

        sData.find(function (err, info) {
            if (err) {
                console.log(err);
            } else {
                const leng = info.length;
                let found = false;
                for (i = 0; i < leng; i++) {
                    if (info[i].email === semail && info[i].password === spassword) {
                        found = true;
                        res.send("<h1>Here will be your Students panel</h1>");
                    }
                }

                if (found === false) {
                    res.render("student_login", { validity: true });
                }
            }
        });
    });

app.route('/student-register')
    .get((req, res) => {
        res.render('student_register')
    })
    .post((req, res) => {
        const newsEmail = req.body.semail;
        const newspassword = req.body.spass;

        const newStudent = new sData({
            email: newsEmail,
            password: newspassword,
        });
        newStudent.save();

        res.render("student_login-rej", { validity: true });
    })

app.route('/teachers')
    .get((req, res) => {
        res.render('teacher_login');
    })
    .post((req, res) => {
        const temail = req.body.temail;
        const tid = req.body.tid;
        const tpassword = req.body.tpass;

        tData.find(function (err, info) {
            if (err) {
                console.log(err);
            } else {
                const leng = info.length;
                let found = 0;
                for (i = 0; i < leng; i++) {
                    if (
                        info[i].email === temail &&
                        info[i].password === tpassword &&
                        info[i].tID === tid
                    ) {
                        // send teachers panel
                        found = 1;
                        res.send("<h1>Here will be your Teachers Panel");
                    }
                }
                if (found === 0) {
                    res.render("teacher_login", { validity: true });
                }
            }
        })

    })

app.route('/teacher-register')
    .get((req,res)=>{
        res.render('teacher_register')
    })
    .post((req,res) =>{
        const newsEmail = req.body.temail;
        const newspassword = req.body.tpass;
        const tID = req.body.tID;
        // console.log(newsEmail, newspassword);

        const newTeacher = new tData({
            email: newsEmail,
            password: newspassword,
            tID: tID,
        });
        newTeacher.save();

        res.render("teacher_login-rej", { validity: true });
    })

// Starting server-----------------------------------------------------------------------------------------------------


app.listen("3000", () => {
    console.log("server started");
});
