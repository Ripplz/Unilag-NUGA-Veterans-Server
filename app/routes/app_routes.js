module.exports = function(app, db) {
  /*
APP POST
*/

  app.post("/add_veteran", (req, res) => {
    const newVeteran = {
      lastName: req.body.lastName,
      otherNames: req.body.otherNames,
      nugaYears: req.body.nugaYears,
      jerseyPositions: req.body.jerseyPositions,
      password: req.body.password,
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

  app.get("/get_veteran", (req, res) => {
    const password = req.query.password;
    db.collection("veterans")
      .find({ password: password })
      .toArray((err, item) => {
        if (err) {
          console.log(err);
          res.sendStatus(401);
        } else {
          console.log(item);
          res.send(item);
        }
      });
  });

  /*END OF APP GET
   */
};
