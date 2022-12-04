![file upload process](https://elasticbeanstalk-ap-southeast-1-677312808939.s3.ap-southeast-1.amazonaws.com/uploads/notes/TDRL_Banner.png)

# Rent Management System

## 🚀 Objective: 
The objective of this application is to track rent collection and expenses for each unit of an apartment. The analyse the profitability of each unit/ each apartments.

## 🎯 Goals
- [x] Manage property lists
- [x] Manage property unit lists
- [x] Manage tenant lists
- [x] Manage lease for properties
- [x] Manage regular expenses for properties
- [x] Manage job expenses for properties
- [x] Manage rent due and collection from tenants
- [x] Generate Profit/Loss statement (Property-wise)
- [] Generate Tenant statement
- [x] Generate Collection report

### Modules
1. Property module
2. Property unit module
3. Tenant module
4. Lease module
5. Ledger module
6. Job module
7. Invoice module
8. Collection module
9. Expense module

### Reports
1. Tenantwise outstanding module
2. Property-wise Profit and Loss Statement

## 🔗 Collection relationship
<div align="center">
  <img src="https://elasticbeanstalk-ap-southeast-1-677312808939.s3.ap-southeast-1.amazonaws.com/uploads/notes/Rent_Schema.jpg" alt="DB relation" width="800"/>

  *Figure 1: Relationship between collections*
</div>

___
## 📦 Dependencies
| Package|Link|Description|
| ------------- | ------------- | ------------- |
| Express.js| [express](https://www.npmjs.com/package/express)| Popular web framework for Node.JS. It makes life easy to create and run servers for Node.JS applications. |
| SendGrid| [@sendgrid/mail](https://www.npmjs.com/package/@sendgrid/mail)| To send emails using SendGrid API. Easy to setup and easy to send emails.|
| Connect Mongo| [connect-mongo](https://www.npmjs.com/package/connect-mongo)| MongoDB session store for Connect and Express|
| Handlebars| [express-handlebars](https://www.npmjs.com/package/express-handlebars)| A Handlebars view engine for Express applications. This package used to be named express3-handlebars.|
| Session| [express-session](https://www.npmjs.com/package/express-session)| Create and maintain session in NodeJS application. It is used as a middleware.|
| Moment.JS| [moment](https://www.npmjs.com/package/moment)| A JavaScript date library for parsing, validating, manipulating, and formatting dates.|
| MongoDB| [mongodb](https://www.npmjs.com/package/mongodb)| MongoDB driver to perform operations in MongoDB database|
| Mongoose| [mongoose](https://www.npmjs.com/package/mongoose)| Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.|
| Cron| [node-cron](https://www.npmjs.com/package/node-cron)| The node-cron module is tiny task scheduler in pure JavaScript for node.js based on GNU crontab. This module allows you to schedule task in node.js using full crontab syntax.|
| Socket.IO| [socket.io](https://www.npmjs.com/package/socket.io)| Socket.IO enables real-time bidirectional event-based communication|
___
## [🌐](https://thedotred.com/) | [💼](https://bd.linkedin.com/company/thedotred) | [🔗](https://www.instagram.com/thedotred/)

## 📓 Changelog