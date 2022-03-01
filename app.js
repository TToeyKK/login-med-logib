var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

var jwt = require('jsonwebtoken');
const secret = 'Fullstack-Login-2021'

let PORT = process.env.PORT || 3333;


app.use(cors())

// app.get("/",(req, res)=>{
//   res.json({result: "ok")
// })

// get the client
const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'admin' 
});

// const connection = mysql.createConnection({
//   host: 'databases.000webhost.com',
//   user: 'id18538306_adminswu',
//   password: 'bdSX^Y1hlr5Tu71L',
//   database: 'id18538306_admin' 
// });


const bcrypt = require('bcrypt');
const saltRounds = 10;

app.get("/",(req, res)=>{
  res.json({result:"ok"})
})

app.post('/register', jsonParser, function (req, res, next) {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {  
    // execute will internally call prepare and query
    connection.execute(
      'INSERT INTO users (email, password, fname, lname) VALUES (?,?,?,?)',
      [req.body.email, hash, req.body.fname, req.body.lname],
      function(err, results, fields) {
        if (err){
          res.json({status: 'error', message: err})
          return
      }
      res.json({status: 'OK'})
      }
    );
  });
})

app.post('/register', jsonParser, function (req, res, next) {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {  
    // execute will internally call prepare and query
    connection.execute(
      'INSERT INTO users (email, password, fname, lname) VALUES (?,?,?,?)',
      [req.body.email, hash, req.body.fname, req.body.lname],
      function(err, results, fields) {
        if (err){
          res.json({status: 'error', message: err})
          return
      }
      res.json({status: 'OK'})
      }
    );
  });
})

app.post('/login', jsonParser, function (req, res, next) {
  connection.execute(
    'SELECT * FROM users WHERE email=?',
    [req.body.email],
    function(err, users, fields) {
        if (err) {res.json({status:'error',message:err})
          return 
        }
        if (users.length == 0) {res.json({status:'error',message:'no user found'}) 
          return 
        }
        bcrypt.compare(req.body.password, users[0].password, function(err, isLogin) {
        // result == true
            if (isLogin){
              var token = jwt.sign({ email: users[0].email }, secret,{ expiresIn: '4h' });
              res.json({status:'ok',message:'เข้าสู่ระบบ (login sucess)',token})
            }else{ 
              res.json({status:'failed',message:'ไม่สามารถเข้าสู่ระบบได้ (login failed)'})
            }
        });
    }
  );  
})

// app.post('/authen', jsonParser, function (req, res, next) {
//   try{
//       const token = req.headers.authorization.split(' ')[1]
  
//       // verify a token symmetric - synchronous
//       var decoded = jwt.verify(token, secret);
//       res.json({status:'ok',decoded})
//   }
//   catch(err){
//       res.json({status:'error',message:err.message})
//   }
// })

// app.post('/authen', jsonParser, function (req, res, next){
//   try{
//     const token = req.headers.authorization.split(' ')[1]
//     var decoded = jwt.verify(token, secret);
//     res.json({status: 'ok', decoded})
//   }catch(err){
//     res.json({status: 'error',message: err.message})
//   }
// })


app.listen(PORT, () => {
  console.log('CORS-enabled web server listening on port 3333')
})