const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const path = require("path");
const fetch = require("node-fetch");
const { PassThrough } = require("stream");
const mailchimp = require("@mailchimp/mailchimp_marketing");
require("dotenv").config();

const app = express();

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

//Bodyparser Middleware
app.use(bodyParser.urlencoded({ extended: true }));

//Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Mailchimp Cofiguration
mailchimp.setConfig({
  apiKey: process.env.API_KEY,
  server: process.env.SERVER_PREFIX,
});

// Check if able to make API calls to Mailchimp API
async function run() {
  const response = await mailchimp.ping.get();
  console.log(response);
}

// List all Campaigns
const listCampaigns = async () => {
  const response = await mailchimp.campaigns.list();
  console.log(response);
};

// Get Campaign Content
const getContent = async () => {
  const response = await mailchimp.campaigns.getContent(campaignID);
  console.log(response);
};

var campaignID = "";

// Create a new Campaign
const createCampaign = async () => {
  const response = await mailchimp.campaigns.create({
    type: "regular",
    recipients: { list_id: process.env.AUDIENCE_ID },
    settings: {
      subject_line: "Test Mailchimp Campaign 📧 ",
      from_name: process.env.FROM_NAME,
      title: "Test API Email Campaign",
      reply_to: process.env.EMAIL,
    },
  });
  console.log(response);
  campaignID = response.id; // Campaign ID of the newly created campaign
};

// Set content for an already created Campaign
const setContent = async () => {
  const response = await mailchimp.campaigns.setContent(String(campaignID), {
    html: `<!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
    <link href="https://fonts.googleapis.com/css?family=Raleway" rel="stylesheet" type="text/css">
    <style>
    body {font-family: "Raleway", Arial, sans-serif}
    .w3-row img {margin-bottom: -8px}
    </style>
    </head>
    <body>

    <div class="w3-content" style="max-width:1500px">

      <header width="100%">
      <h2 class="center" style="padding:0rem 5rem 0rem 5rem; text-align:center;"> Hello There </h2>
      </header>
      </div>
     </div>

    <footer style="margin:0rem 5rem 0rem 5rem" id="about">
      <img style="display: block; margin-left: auto; margin-right: auto; margin-bottom:1.5rem" src="https://static.vecteezy.com/system/resources/thumbnails/000/358/552/small/Spring_Day_Wallpaper.jpg" width="250" height="250">

        <p style="margin:auto;width:60%; text-align:center;">Hello there. This is an email that is sent to you as part of the testing done by Hemani Gajjar. She is creating a New Campaign on Mailchimp. </p>
        <br>
        <p style="margin:auto;width:70%; text-align:center;">Thank you for being part of the testing proces!</p>

      <br>
    </footer>

    </body>
    </html>
      `,
  });
  console.log(response);
};

// Send the email campaign instantly
const sendCampaign = async () => {
  const response = await mailchimp.campaigns.send(campaignID);
  console.log("The Mail has been sent.");
};

//Submit Route
app.post("/submit", (req, res) => {
  console.log("You just made a POST request to the route /submit");

  for (
    let i = 1;
    req.body.array != undefined && i < req.body.array.length;
    i++
  ) {
    if (req.body.array[i].length == 0) {
      continue;
    } else {
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
        `https://${process.env.SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${process.env.AUDIENCE_ID}`,
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

// Send Route
app.post("/send", (req, res) => {
  console.log("You just made a POST request at the route /send");

  const FinalSendCampaign = async () => {
    const res = await createCampaign();
    const result = await setContent();
    const result2 = await sendCampaign();
  };

  FinalSendCampaign();
});

const port = process.env.PORT || 5000;
app.listen(port, console.log(`Server started on ${port}`));
