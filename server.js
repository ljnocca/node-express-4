const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
// express is a ueseulf library
// midleware lets your configure how express application works (like a 3rd party add-on)
// http route handlers (url, function which express sends back)

// HandleBars - templating engine lets you render HTML in a dynamic way. inject values, create re-usable markup (header/footer, etc)
// hbs - module that's a wrapper for Handlebars that allows us to use it as an Express view engine

const port = process.env.PORT || 3000;
// now for heroku app it gets the PORT number from process.env. if it's not available locally (aka localhost, use port 3000)
var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// middleware that logs date & req method & url and appends to server.log file
app.use((req, resp, next) => {
  var now = new Date().toString();

  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err)=> {
    if (err) {
      console.log('unable to append to server.log');
    }
  });

  next();
});

// since you don't call NEXT this means once you get to this template you can't move on
// app.use((req, resp, next) => {
//   resp.render('maintenance.hbs')
// });

app.use(express.static(__dirname + '/public'));

// HELPER FUNCTIONS
hbs.registerHelper('getCurrentYear', ()=>{
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text)=>{
  return text.toUpperCase();
});

// render diff routes...
app.get('/', (req, resp) => {
  // resp.send('<h1>Hello Express!<h1>');
  resp.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to this page!'
  })
});

app.get('/about', (req, resp) => {
  resp.render('about.hbs', {
    pageTitle: 'About Page',
  })
});

app.get('/projects', (req, resp) => {
  resp.render('projects.hbs', {
    pageTitle: 'Projects'
  })
});

app.get('/bad', (req, resp) => {
  resp.send({
    errorMessage: 'Error handling request'
  })
});

// binds application to a port on our machine
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
