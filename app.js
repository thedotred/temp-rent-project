const express = require('express'),
path = require('path'),
mongoose = require('mongoose'),
session = require('express-session'),
MongoStore = require('connect-mongo'),
handlebars = require('express-handlebars').create({
  layoutsDir: path.join(__dirname, 'views/layouts'),
  helpers: require("./views/helpers/handlebars.js").helpers,
  defaultLayout: 'main',
  partialsDir: [path.join(__dirname, 'views/partials')]
}),
{ MONGOURL } = require('./configurations/config');

//Middleware
const middleware = require("./middlewares/index");

//Mongoose
const uri = process.env.MONGOURL || MONGOURL;

//Create express server
const app = express();

//Create Socket io server
var http = require("http").createServer(app);
var io = require("./utils/socket").init(http);
var eventEmitter = require("./utils/events").init();

//Setting views
app.set("views", path.join(__dirname, "views"));

//Setting port number
app.set("port", process.env.PORT || 3000);

//Setting our app to use handlebars view engine
app.set("view engine", "handlebars");

//Setting handlebars configuration
app.engine("handlebars", handlebars.engine);

//Setting body parser
app.use(express.json());
app.use(express.urlencoded({
    limit: '100mb',
    extended: false
}));

// // CORS Section
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
//     next();
// });

//Serves static files
app.use(express.static(path.join(__dirname, "public")));

//Express Session
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: uri,
        ttl: 24 * 60 * 60 * 24 // = 24 hours
    }),
    secret: "Boilerplate",
    resave: true,
    saveUninitialized: false,
  })
);

//Controllers
let property_api_controller = require('./controllers/PropertyController/propertyApiController'),
property_controller = require('./controllers/PropertyController/propertyController'),
unit_api_controller = require('./controllers/UnitController/unitApiController'),
unit_controller = require('./controllers/UnitController/unitController'),
tenant_api_controller = require('./controllers/TenantController/tenantApiController'),
tenant_controller = require("./controllers/TenantController/tenantController"),
ledger_api_controller = require('./controllers/LedgerController/ledgerApiController'),
ledger_controller = require('./controllers/LedgerController/ledgerController'),
invoice_api_controller = require("./controllers/InvoiceController/invoiceApiController"),
invoice_controller = require('./controllers/InvoiceController/invoiceController'),
expense_api_controller = require('./controllers/ExpenseController/expenseApiController'),
expense_controller = require('./controllers/ExpenseController/expenseController'),
job_api_controller = require('./controllers/JobController/jobApiController'),
job_controller = require('./controllers/JobController/jobController'),
collection_api_controller = require('./controllers/CollectionController/collectionApiController'),
collection_controller = require('./controllers/CollectionController/collectionController'),
report_controller = require('./controllers/ReportController/reportController'),
report_api_controller = require('./controllers/ReportController/reportApiController');

//scoket.io connection
io.on("connection", (socket) => {
  socket.on("take it", (data) => {
    io.emit("get it", data);
  });
});

//Middleware
app.use((req, res, next) => {
  if (!res.locals.partials) res.locals.partials = {};
  res.locals.partials.data = req.session.maskedNavigationPolicy;
  next();
});

//Index Page
app.get("/", function (req, res) {
  res.render("Index", {
    layout: "kendo",
    nav_name: '" Dashboard"',
    sessionData: req.session,
    title: "Dashboard",
  });
});

//Index Page
app.get("/Login", function (req, res) {
  res.render("Login", {
    layout: null,
    nav_name: '" Home"',
    sessionData: req.session,
    title: "Home",
  });
});

// Report Page
app.use('/api/report', report_api_controller);
app.use('/Report', report_controller);

// Collection Page
app.use('/api/collection', collection_api_controller);
app.use('/Collection', collection_controller);

// Job Page
app.use('/api/job', job_api_controller);
app.use('/Job', job_controller);

// Expense Page
app.use('/api/expense', expense_api_controller);
app.use('/Expense', expense_controller);

// Invoice Page
app.use('/api/invoice', invoice_api_controller);
app.use('/Invoice', invoice_controller);

// Ledger Page
app.use('/api/ledger', ledger_api_controller);
app.use('/Ledger', ledger_controller);

// Tenant Page
app.use('/api/tenant', tenant_api_controller);
app.use('/Tenant', tenant_controller);

// Unite Page
app.use('/api/unit', unit_api_controller);
app.use('/Unit', unit_controller);

// Property Page
app.use('/api/property', property_api_controller);
app.use('/Property', property_controller);

//Custom 404 page
app.use((req, res) => {
  res.type("text/plain");
  res.status(404);
  res.send("404 - Not Found");
});

//Custom 500 page
app.use((err, req, res, next) => {
  res.type("text/plain");
  res.status(500);
  res.send(__dirname + " and " + err.stack);
});

//Listen to port
let server = http.listen(app.get('port'), function () {
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('Express server listening on port ' + server.address().port);
    console.log('Connected to ' + MONGOURL);
});
