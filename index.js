const express = require('express');
const path = require('path');
const port =8000;
const app= express();
const authRoute = require('./routes/auth');
const connectDB = require('./db/connectdb');
const session = require('express-session');
const mongoDBSession = require('connect-mongodb-session')(session);
const nocache = require("nocache");
const hbs = require('hbs');
app.use(express.static('public'));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine','hbs');
app.use(express.static(__dirname + '/public'))

app.use(express.json());
app.use(express.urlencoded({extended:true}));







connectDB();


const store  = new mongoDBSession({
  uri: 'mongodb://localhost:27017/userManagementSystem',
  collection: 'sessions'
});

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  store: store
}));

app.use(nocache())

app.use('/', authRoute);

app.listen (port, () => {
    console.log(`Server started on port ${port}`);
})