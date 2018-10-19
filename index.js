// call express
var express = require('express')
var exphbs = require('express-handlebars');
var app = express();

//flash setup

let flash = require('express-flash');
let session = require('express-session');



var bodyParser = require('body-parser');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json())

app.use(flash());

app.use(session({
  secret: "<add a secret string here>",
  resave: false,
  saveUninitialized: true
}));


var postgres = require('pg')
const Pool = postgres.Pool

let useSSL = false;
if (process.env.DATABASE_URL) {
  useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/reg_num'

const pool = new Pool({
  connectionString,
  ssl: useSSL
})





app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: {
    selectedTag: function() {
      if (this.selected) {
        return 'selected'
      }
    }
  }

}));

app.set('view engine', 'handlebars');



const Reg = require('./registration_numbers.js');
const registration = Reg(pool)



app.get('/', async function(req, res, next) {
try {
  let regs =   await registration.mapReg();
  let dropValues = await registration.dropDown(req.params.tag);

  console.log(regs, dropValues)
  res.render('registration', {
    regPlate: await registration.mapReg(),
    dropDown:await registration.dropDown(req.params.tag)
  })
} catch (err) {
   next(err)
}


});

app.post('/reg', async function(req, res, next) {

  try {

    if(await registration.addRegistration(req.body.regInput)){
      
    req.flash('valid', 'Succesfully added registration');


    }else{
    req.flash('invalid', 'Please Enter A valid Registration');

    }
    res.render('registration', {regPlate: await registration.mapReg()})
  }
    catch (err) {
     return next()
   }

});

app.get('/filter/:tag', async function(req, res, next) {

  try {
    let filteredReg = await registration.filterReg(req.params.tag);
    let dropDown = await registration.dropDown(req.params.tag)
   

    res.render('registration', {
      regPlate: filteredReg,
      dropDown:dropDown
    })

  } catch (err) {
    return next()
  }

});

app.get('/reset', async function(req, res, next) {

  try {
    await registration.regDelete()
    res.redirect('/')

  } catch (err) {
    return next()
  }
});



let PORT = process.env.PORT || 3006;

app.listen(PORT, function() {
  console.log('App starting on port', PORT);
});
