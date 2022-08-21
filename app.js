// Importing all required modules------------------------------------------------------------------------------------
"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Setting view engine and other stuff--------------------------------------------------------------------------------

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.set("view engine", "ejs");

// Connecting mongodb database and creating schema----------------------------------------------------------------------

mongoose.connect("mongodb://localhost:27017/Exam-Portal", {
  useNewUrlParser: true,
});

const examsScheduled = new mongoose.Schema({
  class: Number,
  total: Number,
});

const loginSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  class: Number,
  examsGiven: Number,
});

const subjectMarks = new mongoose.Schema({
  name: String,
  email: String,
  hindi: Number,
  english: Number,
  maths: Number,
  physics: Number,
  chemistry: Number,
  biology: Number,
  history: Number,
  geography: Number,
  civics: Number,
  economics: Number,
  computer: Number,
  pED: Number,
});

const tloginSchema = new mongoose.Schema({
  name: String,
  email: String,
  school: String,
  password: String,
  tID: String,
});

const sData = mongoose.model("student", loginSchema);
const marksSubject = mongoose.model("Subject Marks", subjectMarks);
const tData = mongoose.model("teacher", tloginSchema);
const exams = mongoose.model("Exams-scheduled", examsScheduled);

const exam = new exams({
  class: 11,
  total: 3,
});
// exam.save();

// Creating routes -----------------------------------------------------------------------------------------------------

let slogin = { value: false, email: "" };

app.get("/dashboard-student-data", (req, res) => {
  let nexamsGiven;
  let examsScheduledData;
  let nname;
  let sclass;
  let nmarks;
  sData.find(async function (err, info) {
    if (err) {
      console.log(err);
    } else {
      const leng = info.length;
      for (let i = 0; i < leng; i++) {
        if (info[i].email === slogin.email) {
          nexamsGiven = info[i].examsGiven;
          sclass = info[i].class;
          nname = info[i].name;
        }
      }
    }
  });
  exams.find(function (err, info) {
    if (err) {
      console.log(err);
    } else {
      const leng = info.length;
      examsScheduledData = info[0].total;
    }
  });
  marksSubject.find(function (err, info) {
    if (err) {
      console.log(err);
    } else {
      const leng = info.length;
      for (let i = 0; i < leng; i++) {
        if (info[i].email === slogin.email) {
          nmarks = info[i];
        }
      }
    }
  });
  setTimeout(() => {
    res.send({
        name: nname,
        class: sclass,
        email: slogin.email,
        examsGiven: nexamsGiven,
        examsScheduled: examsScheduledData,
        marks: nmarks,
      });
    
  }, 1000);
  
});

app.route("/getstudentdata").get((req, res) => {
  if (slogin.email === "") {
    res.send("Invalid Request");
  } else {
  }
});

app.route("/dashboard-student").get((req, res) => {
  if (slogin.value === true) {
    // res.send(`<h1>this is students dashboard, hello ${slogin.email}</h1>`)

    res.render("student-dashboard", { email: slogin.email });
    slogin.value = false;
  } else {
    res.redirect("/students");
  }
});

app.route("/").get((req, res) => {
  slogin = { value: false, email: "" };
  res.render("login");
});

app
  .route("/students")
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
        for (let i = 0; i < leng; i++) {
          if (info[i].email === semail && info[i].password === spassword) {
            found = true;
            res.send({ login: "success" });
            slogin.value = true;
            slogin.email = semail;
          }
        }

        if (found === false) {
          res.send({ login: "failed" });
        }
      }
    });
  });

app
  .route("/student-register")

  .get((req, res) => {
    // slogin.value = false;
    res.render("student_register");
  })
  .post((req, res) => {
    const newsname = req.body.sname;
    const newsEmail = req.body.semail;
    const newsclass = req.body.class;
    const newspassword = req.body.spass;
    // console.log(newsEmail, newspassword)

    const newStudent = new sData({
      name: newsname,
      email: newsEmail,
      password: newspassword,
      class: newsclass,
      examsGiven: 0,
    });

    const newStudentSubject = new marksSubject({
      name: newsname,
      email: newsEmail,
      hindi: "",
      english: "",
      maths: "",
      physics: "",
      chemistry: "",
      biology: "",
      history: "",
      geography: "",
      civics: "",
      economics: "",
      computer: "",
      pED: "",
    });
    newStudentSubject.save();
    newStudent.save();
    res.send({ registered: "success" });
  });

app
  .route("/teachers")
  .get((req, res) => {
    // slogin.value = false;
    res.render("teacher_login");
  })
  .post((req, res) => {
    const temail = req.body.temail;
    const tid = req.body.tid;
    const tpass = req.body.tpass;

    tData.find(function (err, info) {
      if (err) {
        console.log(err);
      } else {
        const leng = info.length;
        let found = 0;

        for (let i = 0; i < leng; i++) {
          if (
            info[i].email === temail &&
            info[i].password === tpass &&
            info[i].tID === tid
          ) {
            // send teachers panel
            found = 1;
            res.send({ login: "success" });
          }
        }
        if (found === 0) {
          res.send({ login: "failed" });
        }
      }
    });
  });

app
  .route("/teacher-register")
  .get((req, res) => {
    // slogin.value = false;
    res.render("teacher_register");
  })
  .post((req, res) => {
    const id = Math.floor(Math.random() * (99999 - 100 + 1)) + 100;
    const newtname = req.body.tname;
    const newtEmail = req.body.temail;
    const newtschool = req.body.tschool;
    const newtpassword = req.body.tpass;
    const tID = id;
    // console.log(newsEmail, newspassword);

    const newTeacher = new tData({
      name: newtname,
      email: newtEmail,
      school: newtschool,
      password: newtpassword,
      tID: tID,
    });
    newTeacher.save();
    setTimeout(() => {
      res.send({ registered: "success" });
    }, 100);
  });

app.route("/*").get((req, res) => {
  // slogin.value = false;
  res.send("<h1>Sorry Page Not Found</h1>");
});

// Starting server-----------------------------------------------------------------------------------------------------

app.listen("3000", () => {
  console.log("server started");
});
