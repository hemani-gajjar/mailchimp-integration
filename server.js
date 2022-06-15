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
const createCampaign = async (sub) => {
  const response = await mailchimp.campaigns.create({
    type: "regular",
    recipients: { list_id: process.env.AUDIENCE_ID },
    settings: {
      subject_line: sub,
      from_name: process.env.FROM_NAME,
      title: "Test API Campaign",
      reply_to: process.env.EMAIL,
    },
  });
  console.log(response);
  campaignID = response.id; // Campaign ID of the newly created campaign
};

// createCampaign();

// Set content for an already created Campaign
const setContent = async (htmlContent) => {
  const response = await mailchimp.campaigns.setContent(String(campaignID), {
    html: htmlContent,
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

  res.status(200).send({ statusCode: res.statusCode });
});

// Schedule Route
app.post("/schedule", (req, res) => {
  console.log("You just made a POST request to the route /schedule");
  console.log(req.body);
  // scheduleCampaign(req.body.dateTime);
});

// Schedule an email campaign (will be sent only once)
const scheduleCampaign = async (date_time) => {
  const response = await mailchimp.campaigns.schedule("campaign_id", {
    schedule_time: date_time, //"2022-05-27T12:12:14.300Z"
  });
  console.log(response);
};

//Create a RSS-driven Campaign (Can send emails on a daily, weekly or monthly basis)
const createRssCampaign = async () => {
  const response = await mailchimp.campaigns.create({
    type: "rss",
    rss_opts: {
      schedule: {
        hour: 6,
        daily_send: {
          sunday: true,
          monday: false,
          tuesday: false,
          saturday: false,
        },
        weekly_send_day: "sunday",
        monthly_send_date: "23",
      },
    },
    recipients: { list_id: process.env.AUDIENCE_ID },
    settings: {
      subject_line: "This is a Test Subject Line for a RSS-driven Campaign",
      from_name: process.env.FROM_NAME,
      title: "Test RSS Campaign",
      reply_to: process.env.EMAIL,
    },
  });
  console.log(response);
};

// Send Route
app.post("/send", (req, res) => {
  console.log("You just made a POST request at the route /send");

  const FinalSendCampaign = async () => {
    const res = await createCampaign(req.body.subject);
    const result = await setContent(req.body.content);
    const result2 = await sendCampaign();
  };

  FinalSendCampaign();
});

// Start Route
app.post("/start", (req, res) => {
  console.log("You just made a POST request to the route /start");
  console.log(req.body);
});

const port = process.env.PORT || 5000;
app.listen(port, console.log(`Server started on ${port}`));
