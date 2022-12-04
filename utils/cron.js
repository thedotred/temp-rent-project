const cron = require('node-cron'),
moment = require('moment');

const notificationModel = require('../models/Notification/notificationModel');

cron.schedule('* * * * *', async () => {
    console.log('running every 30 mins');
    let hourNow = moment().hour(),
    dateNow = moment().date();
    
    let notifications = await notificationModel.find({$or: 
        [
            {'parameter.hour': hourNow}, 
            {'parameter.date': dateNow}
        ]
    });
    console.log(notifications);
});