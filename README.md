## Mailing List Using Mailchimp Integration

### Prerequisites

- [NodeJS](https://nodejs.org/en/)
- [npm](https://docs.npmjs.com/cli/v8/configuring-npm/install)

### Getting Started

To get a local copy up and running follow these simple steps:

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/hemani-gajjar/mailchimp-integration.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. In the project directory, you can run:
   ```sh
   npm run dev
   ```
   This command runs the app in the development mode.
   Open http://localhost:5000 to view it in the browser. The server will reload if you make edits.

### Application Functionalities

1. Add the list of users to the mailing list (named `Audience` on Mailchimp) via uploading an Excel File in the folowwing format:

- Columns Names: **First Name**, **Last Name**, **Email**.
- A Sample Example:

  | First Name | Last Name | Email                     |
  | ---------- | --------- | ------------------------- |
  | Sheldon    | Cooper    | sheldoncooper@caltech.com |
  | Ginevra    | Weasley   | ginerva@hogwarts.com      |
  | Arya       | Stark     | arya@amail.com            |
  | Harvey     | Specter   | harveyy@nyu.com           |
  | Andrew     | Bernard   | andy@cornell.com          |

2. Send an instant mail to the users in the mailing list (named `Audience` on Mailchimp)

### Configuration for Environment Variables

##### There are 5 environment variables that you need to configure:

In the project root directory, create a folder named `.env` and set the values for following variables:

1.  **AUDIENCE_ID**="`<Your_Audience_ID>`"
    You can find the `List ID` (Now named as `Audience ID`) where you wish to import the email IDs of the users from the excel sheet on Mailchimp as shown [here](https://mailchimp.com/help/find-audience-id/)

2.  **SERVER_PREFIX**="`<usX>`"
    The server prefix (In the format of us1, us2, us16 etc) can be determined from the URL shown at your Mailchimp Dashboard.
    For example, if the URL is as follows: `https://us6.admin.mailchimp.com/` In this case, the server prefix would be `us6`

3.  **API_KEY**="`<Your_API_Key>`"
    You can create an API Key for your account following the steps shown [here](https://mailchimp.com/help/about-api-keys/)

4.  **EMAIL**="`<Your_email_Id>`"
    Set the value of `EMAIL` to be the same as used for Mailchimp Account creation (Mails will be sent using this Email ID)

5.  **FROM_NAME**="`<Your_Name>`"
    Set the value of `FROM_NAME` to a name that would be displayed to the email receivers

### Built With

- [Node.js](https://nodejs.dev/)
- [Mailchimp API](https://mailchimp.com/developer/)
- [Bootstrap](https://getbootstrap.com/docs/4.0/getting-started/introduction/)
