var express = require('express');
var router = express.Router();
var User = require('../models/user');
var path = require('path'); 
var Quote = require('../models/quotesCollection');
var Subject = require('../models/subjectChoiceList');


//put code in separate files
var logOutCtrl = require('./logout');
router.route('/logout').get(logOutCtrl.getLogOut);



 //GET route for reading data
//  router.get('/', function (req, res, next) {
//   console.log("test");
//   // return res.sendFile(path.join(__dirname + '/templateLogReg/index.html'));
//  });




//POST route for updating data
router.post('/', function (req, res, next) {
  console.log("test");
   if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.username, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } 
      else {
        req.session.userId = user._id;
        console.log(__dirname);
        return res.redirect('/subjectChoose');
      }
    });
  } 
  else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
  
})

//GET route after registering
//for now nothing is happeing here
router.get('/profile', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          var ss = "";
        Quote.find().exec((error, _quote) =>{
          if (error) {
            return next(error)
          }else{
            for(var i=0; i<_quote.length; i++){
               ss += "<h3>" + "user: " + _quote[i].user + ",   quote: " + _quote[i].quote + "</h3>";
            }
            var s = "<form action='/quotes' method='POST'>" +
            "<input type='text' placeholder='" + user.username + "' name='name'>" +
            "<input type='text' placeholder='quote' name='quote'>" +
            "<button type='submit'>Submit</button>" +
          "</form>"; 
          var final = ss + s; 
          return res.send(final);
            
          }
        })
         
        }
      }
    });
});

//qutoes are being saved here...
router.post('/quotes', (req, res) =>{

  if (req.body.quote_by && req.body.quote_msg) {
    User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } 
      else if(user === null){
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        }
      })
    var quoteData = {
      quoteMsg: req.body.quote_msg,
      quoteBy: req.body.quote_by,
      userId: req.session.userId
    }

    Quote.create(quoteData,  (error, _quote) =>{
      if (error) {
        return next(error)
      } 
      else {
        return res.redirect('/blah')
      }
    })

  }
  else{
    return res.send("provide all the necessary information");
  }
})
// GET for logout logout
// router.get('/logout', function (req, res, next) {
//   if (req.session) {
//     // delete session object
//     req.session.destroy(function (err) {
//       if (err) {
//         return next(err);
//       } else {
//         return res.redirect('/');
//       }
//     });
//   }
// });


router.get('/blah',  (req, res, next)=> {
  console.log(req.session.userId);
  User.findById(req.session.userId)
  .exec(function (error, user) {
    if (error) {
      //return next(error);
      console.log(error);
    } 
    else if(user === null){
        var err = new Error('Not authorized! Go back!');
        err.status = 400;
        return next(err);
      }
    else{     
    Quote.find().exec((error, quotefromDB) =>{
    if (error) console.log(error);
    
    res.render('ejsIndex', {quotes: quotefromDB})
    //res.render('ejsIndex');
    
  })
}

})
})


//subject choose
router.get('/subjectChoose',  (req, res, next)=> {
  console.log(req.session.userId);
  User.findById(req.session.userId)
  .exec(function (error, user) {
    if (error) {
      //return next(error);
      console.log(error);
    } 
    else if(user === null){
        var err = new Error('Not authorized! Go back!');
        err.status = 400;
        return next(err);
      }
    else{     
    
    
   // res.render('ejsIndex', {quotes: quotefromDB})
    res.render('ejsFavoriteList');
  
}
})
})


router.post('/favorite_list_submit', (req, res)=>{
  
  for(var i=0; i<req.body.subject.length; i++){
    var subjectData = {
      subjectName: req.body.subject[i],
      userId: req.session.userId 
    }
    Subject.create(subjectData, function (error, subjectCallBack) {
      if (error) {
        //return next(error);
        console.log(error);
      } 
    });  
  }

  return res.redirect('/blah'); 
  
})

router.put('/quotes', (req, res) => {
  Quote.findOneAndUpdate(
    {quoteBy: 'test'},
   {
    $set: {
      quoteBy: req.body.name,
      quoteMsg: req.body.quote
    }
  },
   {
    sort: {_id: -1},
    upsert: true
  }, 
  (err, result) => {
    if (err) return res.send(err)
    res.send(result);
  })
})

module.exports = router;