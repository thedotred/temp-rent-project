
const fs = require('fs');
const Handlebars = require('handlebars');
const { sendDynamicTemplateEmail } = require('../utils/sendGridEmail');
app.post("/Compile", function (req, res) {
    let source = req.body.html;
    
    var template = Handlebars.compile(source);
    var output = template({name: 'Nazmul'});
    
    fs.writeFileSync('test.html', output);
    res.type("html/plain");
    let to = [
      {"email": 'nazim2060@gmail.com'},
    ],
    templateContents = {
        "subject": `⛔️ asdsa ⛔️`
    },
    attachments = [],
    templateID = null;
    sendDynamicTemplateEmail(to, templateContents, templateID, attachments, output);
    res.send('output');
    // res.render("Index", {
    //   layout: "kendo",
    //   nav_name: '" Home"',
    //   sessionData: req.session,
    //   title: "Home",
    // });
});