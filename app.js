const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const path = require("path");
const fetch = require("node-fetch");
const { PassThrough } = require("stream");
require("dotenv").config();

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// console.log(process.env.API_KEY);
// console.log(process.env.DATA_CENTER);
// console.log(process.env.AUDIENCE_ID);

//Bodyparser Middleware
app.use(bodyParser.urlencoded({ extended: true }));

//Static Folder
app.use(express.static(path.join(__dirname, "public")));

//Submit Route
app.post("/submit", (req, res) => {
  console.log("You just made a POST request to the route /submit");
  console.log(req.body.array);
  res.send("Hello there");

  for (let i = 1; i < req.body.array.length; i++) {
    if (req.body.array[i].length == 0) {
      continue;
    } else {
      console.log(req.body.array[i][2]);
      console.log(req.body.array[i][0]);
      console.log(req.body.array[i][1]);

      const email = req.body.array[i][2];
      const firstName = req.body.array[i][0];
      const lastName = req.body.array[i][1];

      // Construct req Data
      const data = {
        members: [
          {
            email_address: email,
            status: "subscribed",
            merge_fields: {
              FNAME: firstName,
              LNAME: lastName,
            },
          },
        ],
      };

      const postData = JSON.stringify(data);
      fetch(
        `https://${process.env.DATA_CENTER}.api.mailchimp.com/3.0/lists/${process.env.AUDIENCE_ID}`,
        {
          method: "POST",
          headers: {
            Authorization: `auth ${process.env.API_KEY}`,
          },
          body: postData,
        }
      )
        .then(
          res.statusCode === 200 ? console.log("Success") : console.log("Fail")
        )
        .catch((err) => console.log(err));
    }
  }
});

const port = process.env.PORT || 5000;

app.listen(port, console.log(`Server started on ${port}`));
