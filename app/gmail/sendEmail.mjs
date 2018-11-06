require('module-alias/register'); // module aliases
/**
 * Used to send emails through
 * an already authorized gmail account
 */
const path = require('path');
const fs = require('fs');
const {google} = require('googleapis');
const credentials = require('@config/gmail_credentials.json');
const util = require('util');

// If modifying these scopes, delete token.json.
const TOKEN_PATH = path.join(__dirname, './token.json');

const readfile = util.promisify(fs.readFile);

const makeBody = function makeBody(to, from, subject, message) {
    const str = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
        "MIME-Version: 1.0\n",
        "Content-Transfer-Encoding: 7bit\n",
        "to: ", to, "\n",
        "from: ", from, "\n",
        "subject: ", subject, "\n\n",
        message
    ].join('');

    return new Buffer.from(str).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');
};

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 */
const authorize = async function authorize() {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    let token;
    try {
        token = await readfile(TOKEN_PATH);
    } catch(err) {
        console.log('The token was not found for this application. Please run authorizeApp.js');
        console.log(err);
        return false;
    }

    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
};

const sendMail = async (sender, address, subject, message) => {
    const auth = await authorize();
    if (!auth) {
        return false;
    }
    const gmail = google.gmail({version: 'v1', auth});
    const base64EncodedEmail = makeBody(sender, address, subject, message);

    // Use a Promise here since util.promisify causes issue with scope for gmail.users.messages.send
    const result = await new Promise(resolve => {
        gmail.users.messages.send({
            auth: auth,
            userId: 'me',
            resource: {
                raw: base64EncodedEmail
            }
        }, (err, response) => {
            if (err) {
                console.log(err, response);
            }
            resolve(response.status === 200);
        });
    });

    return result || false;
};

module.exports = sendMail;
