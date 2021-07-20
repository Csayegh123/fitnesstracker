const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/fitnesstracker",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);


//render html routes
app.get("/exercise", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/exercise.html"));
});

app.get("/stats", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/stats.html"));
});

//API routs to get data
app.get("/api/workouts", (req, res) => {
  db.Workout.find({})
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

app.get("/api/workouts/range", ({}, res) => {
  db.Workout.find({})
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

app.post("/api/workouts/", (req, res) => {
  db.Workout.create(req.body)
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

app.put("/api/workouts/:id", (req, res) => {
  db.Workout.findByIdAndUpdate({ _id: req.params.id }, { exercises: req.body })
    .aggregate([
      {
        $addFields: {
          totalDuration: { $sum: "$duration" },
        },
      },
    ])
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});