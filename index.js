const express = require('express');
const path = require('path');
const port =8000;
const app= express();
const session = require('express-session');
const authRoute = require('./routes/auth');
const connectDB = require('./db/connectdb');
const hbs = require('hbs');
app.use(express.static('public'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine','hbs');
app.use(express.static(__dirname + '/public'))

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));


app.use('/', authRoute);

connectDB()

app.listen (port, () => {
    console.log(`Server started on port ${port}`);
})