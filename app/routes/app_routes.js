var ObjectID = require("mongodb").ObjectID;

module.exports = function(app, db) {
  /*
APP POST
*/

  app.post("/add_veteran", (req, res) => {
    const newVeteran = {
      lastName: req.body.lastName,
      otherNames: req.body.otherNames,
      email: req.body.email,
      phone: req.body.phone,
      nugaYears: req.body.nugaYears,
      jerseyPositions: req.body.jerseyPositions,
      password: req.body.password,
      passwordHint: req.body.passwordHint,
      recentPhoto: req.body.recentPhoto,
      throwbackPhotos: req.body.throwbackPhotos
    };

    db.collection("veterans").insertOne(newVeteran, (err, result) => {
      if (err) {
        res.send({ error: "An error has occurred" });
      } else {
        res.send(result.ops[0]);
      }
    });
  });

  app.post("/submit_feedback", (req, res) => {
    const newFeedback = {
      message: req.body.message,
      userId: req.body.userId
    };

    db.collection("feedback").insertOne(newFeedback, (err, result) => {
      if (err) {
        res.send({ error: "An error has occurred" });
      } else {
        res.send(result.ops[0]);
      }
    });
  });

  app.post("/submit_contact_message", (req, res) => {
    const newContactMessage = {
      message: req.body.message,
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email
    };

    db.collection("contact").insertOne(newContactMessage, (err, result) => {
      if (err) {
        res.send({ error: "An error has occurred" });
      } else {
        res.send(result.ops[0]);
      }
    });
  });

  app.post("/update_veteran", (req, res) => {
    const updatedVeteran = {
      _id: ObjectID(req.body._id),
      lastName: req.body.lastName,
      otherNames: req.body.otherNames,
      email: req.body.email,
      phone: req.body.phone,
      nugaYears: req.body.nugaYears,
      jerseyPositions: req.body.jerseyPositions,
      password: req.body.password,
      passwordHint: req.body.passwordHint,
      recentPhoto: req.body.recentPhoto,
      throwbackPhotos: req.body.throwbackPhotos
    };
    console.log(updatedVeteran._id);

    db.collection("veterans").findOneAndReplace(
      { _id: updatedVeteran._id },
      updatedVeteran,
      (err, result) => {
        if (err) {
          console.log(err);
          res.send({ error: "An error has occurred" });
        } else {
          console.log(result);
          res.send(result.value);
        }
      }
    );
  });

  app.post("/delete_veteran", (req, res) => {
    const vetId = ObjectID(req.body._id);
    const vetPassword = req.body.password;
    db.collection("veterans").deleteOne(
      { _id: vetId, password: vetPassword },
      (err, result) => {
        if (err) {
          console.log(err);
          res.send({ error: "An error has occurred" });
        } else {
          console.log(result);
          res.send(result.result);
        }
      }
    );
  });

  /*
END OF APP POST
*/

  /*
BEGINNING OF APP GET
*/

  app.get("/get_veterans", (req, res) => {
    db.collection("veterans")
      .find({})
      .toArray((err, item) => {
        if (err) console.log(err);
        res.send(item);
      });
  });

  app.get("/get_veteran_by_id", (req, res) => {
    const vetId = ObjectID(req.query.vetId);
    db.collection("veterans")
      .find({ _id: vetId })
      .limit(1)
      .toArray((err, item) => {
        if (err) {
          console.log(err);
          res.sendStatus(404);
        } else {
          console.log(item);
          res.send(item);
        }
      });
  });

  app.get("/search_veteran", (req, res) => {
    const searchQuery = req.query.query;
    db.collection("veterans")
      .find({ nugaYears: searchQuery })
      .toArray((err, item) => {
        if (err) {
          console.log(err);
          res.sendStatus(404);
        } else {
          console.log(item);
          res.send(item);
        }
      });
  });

  app.get("/get_veteran", (req, res) => {
    const email = req.query.email;
    const password = req.query.password;
    db.collection("veterans")
      .find({ email })
      .limit(1)
      .toArray((err, item) => {
        if (err) {
          res.sendStatus(500);
        } else {
          if (item.length <= 0) {
            res.sendStatus(204);
          } else {
            const vet = item[0];
            if (vet.password === password) {
              res.status(200).send(item);
            } else {
              res.status(206).send(vet.passwordHint);
            }
          }
        }
      });
  });

  app.get("/get_veteran_id", (req, res) => {
    const email = req.query.email;
    const password = req.query.password;
    db.collection("veterans")
      .find({ email })
      .project({ _id: 1, password: 1, passwordHint: 1 })
      .limit(1)
      .toArray((err, item) => {
        if (err) {
          res.sendStatus(500);
        } else {
          if (item.length <= 0) {
            res.sendStatus(204);
          } else {
            const vet = item[0];
            if (vet.password === password) {
              res.status(200).send(item);
            } else {
              res.status(206).send(vet.passwordHint);
            }
          }
        }
      });
  });

  /*END OF APP GET
   */
};
