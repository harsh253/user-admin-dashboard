const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine' , 'ejs');

const userDataSchema = {
    username: String,
    password: String,
    email: String
}

const userData = mongoose.model("User", userDataSchema);

app.get('/', function(req,res){
    userData.find({} , function(err, foundItems){
        res.render('index',{
            users: foundItems
        });
    })
    
});

app.post('/', function(req,res){
    var delId = req.body.delBtn;
    userData.findByIdAndRemove(delId, function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Deleted User");
        }
    });
    res.redirect('/');
});

app.get('/create', function(req,res){
    res.render('user-form');
});

app.post('/create', function(req,res){
    const newUser = new userData({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    })
    newUser.save();
    res.redirect('/');
});

app.get('/:userid/:edit', function(req,res){
    var userid = req.params.userid;
    userData.find({_id : userid}, function(err, foundItems){
        res.render('edit-form',{
            data: foundItems
        });
    });
});

app.post('/:userid/:edit', function(req,res){
    var userid = req.params.userid;
    userData.updateOne({_id : userid}, {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    },  function(err){
        if(err){
            console.log(err);
        }else{
            console.log("Data updated");
        }
    });
    res.redirect('/');
});



app.listen(3000, function(){
    console.log(`Server started on port 3000`);
});
    