let sgMail = require('@sendgrid/mail'),
fs = require('fs'),
{ SENDGRID_API_KEY } = require('../configurations/config');

// SendGrid API
sgMail.setApiKey(SENDGRID_API_KEY);

// Dynamic Template Mail
function sendDynamicTemplateEmail(to, templateContents, templateID , attachments, content){
    /* Parameter formats
        "to" is array of JSON objects
        "templateContents" is JSON object
        "subject" is string
        "templateID" is string
        to: [
            {"email": "ifile123@gmail.com"},
            {"email": "paradiso.boy@gmail.com"}
        ]

        templateContents: {
            "username": "nazim2060",
            "password": "alam"
        }

        attachments: [
            {
                content: attachment,
                filename: "attachment.pdf",
                type: "application/pdf",
                disposition: "attachment"
            }
        ]
     */

    let msg = {};
    if (templateID){
        msg = {
            "personalizations": [
                {
                  "to": to,
                  "dynamic_template_data": templateContents
                }
              ],
              "from": {
                "email": "info@thedotred.com",
                "name": "DOT RED SUPPORT"
              },
              "attachments": attachments,
              "template_id": templateID      
        }
        msg.template_id = templateID;
    } else {
        msg = {
            to: to,
            "from": {
                "email": "info@thedotred.com",
                "name": "DOT RED SUPPORT"
            }, // Use the email address or domain you verified above
            subject: 'Sending with Twilio SendGrid is Fun',
            html: content
        }
    }
    sgMail
    .send(msg)
    .then(() => {
        console.log('Mail sent');
    }, error => {
        console.log(error.response);
        console.error(error);
        if (error.response) {
            console.error(error.response.body)
        }
    });
};

module.exports = {sendDynamicTemplateEmail};