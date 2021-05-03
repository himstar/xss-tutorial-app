const express = require("express");
const session = require("express-session");
const fs = require("fs");
const sanitizer = require("sanitizer");

const port = 3000;
const app = express();

let reviews = [];
// app.use(function(req, res, next) {
//   res.setHeader("Content-Security-Policy", "script-src 'self';");
//   res.setHeader("Content-Security-Policy", "script-src 'self' 'nonce-abc';");
//   next();
// });
app.use(express.static("public"));
app.use(
  session({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: false
    }
  })
);
app.get("/empty", function(req, res) {
  let reviewLength = reviews.length;
  reviews = [];
  reviewLength > 0 ? res.send("Data erased!") : res.send("Already erased!");
});
app.get("/", function(req, res) {
  if (req.query.newReview) {
    //let sanitizeComment = sanitizer.sanitize(req.query.newReview);
    //reviews.push(sanitizeComment)
    //sanitizeComment.length > 0 ? reviews.push(sanitizeComment) : null;
    reviews.push(req.query.newReview);
  }
  const formattedReviews = reviews
    .map(review => `<div><dt>User</dt><dd>${review}</dd></div>`)
    .join(" ");
  const template = fs.readFileSync("./templates/index.html", "utf8");
  const view = template.replace("$reviews$", formattedReviews);
  res.send(view);
});

app.listen(port, () =>
  console.log(`The server is listening at http://localhost:${port}`)
);
