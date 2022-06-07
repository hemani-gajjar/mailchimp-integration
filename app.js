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
  server: process.env.DATA_CENTER,
});

// Check if able to make API calls to Mailchimp API
async function run() {
  const response = await mailchimp.ping.get();
  console.log(response);
}

run();

// Function to list all Campaigns
const listCampaigns = async () => {
  const response = await mailchimp.campaigns.list();
  console.log(response);
};

let campaignID = "1a6d524c52";

// Function to create a new Campaign
const createCampaign = async () => {
  const response = await mailchimp.campaigns.create({
    type: "plaintext",
    recipients: { list_id: process.env.AUDIENCE_ID },
    settings: {
      subject_line: "This is the Subject Line",
      from_name: process.env.FROM_NAME,
      title: "Test API Campaign",
      reply_to: process.env.EMAIL,
    },
  });
  console.log(response);
  console.log(response.id);
  campaignID = response.id; // Campaign ID of the newly created campaign
};

// createCampaign();
console.log("Campaign ID : " + campaignID);

// Get Campaign Content
const getContent = async () => {
  const response = await mailchimp.campaigns.getContent("2cea993018");
  console.log(response);
};

// getContent();

// Set content for the created Campaign
const setContent = async () => {
  const response = await mailchimp.campaigns.setContent(campaignID, {
    data: {
      message: "Some test Data",
      plain_text:
        "------ Hello There ------\n " + "This is a simple plaintext content",
    },
  });
  console.log(response);
};

// setContent();

//Submit Route
app.post("/submit", (req, res) => {
  console.log("You just made a POST request to the route /submit");

  for (let i = 1; i < req.body.array.length; i++) {
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

// Send Route
app.post("/send", (req, res) => {
  console.log("You just made a POST request at the route /send");
});

const port = process.env.PORT || 5000;
app.listen(port, console.log(`Server started on ${port}`));

// // Add a contact to an Audience (Using AUDIENCE_ID)
// async function addContact() {
//   const response = await mailchimp.lists.addListMember(
//     process.env.AUDIENCE_ID,
//     {
//       email_address: "test@getMaxListeners.com",
//       status: "subscribed",
//       merge_fields: {
//         FNAME: "Ruby",
//         LNAME: "Granger",
//       },
//     }
//   );

//   console.log(
//     `Successfully added contact as an audience member. The contact's id is ${response.id}.`
//   );
// }
