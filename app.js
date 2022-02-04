const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  next();
});

// mongoose.connect("mongodb://localhost:27017/data");

const articleSchema = {
  id: String,
  title: String,
  content: String,
};
const article = mongoose.model("article", articleSchema);

///////////////////////////////////////////////////Create Cover Page//////////////////////////////////////////////////////////
app.get("/", (req, res) => {
  res.send(
    "Welcome to the storytime API. Enter your Parameters to get started"
  );
});

///////////////////////////////////////////////////Requests targeting all articles//////////////////////////////////////////////////////////
app
  .route("/articles")
  .get((req, res) => {
    article.find({}, (err, articles) => {
      if (!err) {
        res.send(articles);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    const art = new article({
      title: req.body.title,
      content: req.body.content,
    });
    art.save((err) => {
      if (!err) {
        res.send("success");
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    article.deleteMany({}, (err) => {
      if (!err) {
        res.send("success");
      } else {
        res.send(err);
      }
    });
  });

///////////////////////////////////////////////////Requests targeting specific article//////////////////////////////////////////////////////////

app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    article.findOne({ title: req.params.articleTitle }, (err, result) => {
      if (result) {
        res.send(result);
      } else res.send("nothing to find");
    });
  })
  .put((req, res) => {
    article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      (err, past) => {
        if (!err) {
          res.send("Successfully Updated!");
        } else res.send(err + past);
      }
    );
  })
  .delete((req, res) => {
    article.deleteOne({ title: req.params.articleTitle }, (err) => {
      if (!err) {
        res.send("Deleted.");
      }
    });
  });

app.listen(5000, () => {
  console.log("The server is active");
});
