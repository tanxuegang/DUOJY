var express = require('express');
var router = express.Router();


var crypto = require('crypto');
var mongoose = require('mongoose');
var models =require('../models/models');
var User = models.User;
var Directory = models.Directory;

function hashPW(pwd){
  return crypto.createHash('sha256').update(pwd).digest('bass64').toString();
}

/* GET users listing. */
/*
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
*/

router.get('/modify.html', function(req, res, next) {
  console.log( req.session.user);
  if(req.session.user == undefined){
    res.redirect('/users/login');
  }
  Directory.find({state:1}).sort({creationTime:1})
      .exec(function(err,directory){
        res.render('modify', { title: '修改密码_朵朵学习',nav:directory});
      })
});


router.get('/register', function(req, res, next) {
  Directory.find({state:1}).sort({creationTime:1})
      .exec(function(err,directory){
        res.render('register', { title: '用户注册_朵朵学习',nav:directory});
      })
});

router.get('/login', function(req, res, next) {

  Directory.find({state:1}).sort({creationTime:1})
      .exec(function(err,directory){
        res.render('login', { title: '用户登录_朵朵学习',nav:directory});
      })
});


router.post('/registerUser',function(req,res,next){
  User.findOne({username:req.body.username})
      .exec(function(err,user){
        if(user){
          res.send('The user name repetition');
        }else{
          var user =new User({username:req.body.username});
          user.set('hashed_password',hashPW(req.body.password));
          user.set('email',req.body.email);
          user.set('state',1);
          if(req.body.username == "admin"){
            user.set('level',0);
          }else{
            user.set('level',1);
          }
          user.set('creationTime',new Date());
          //存储出错
          user.save(function(err){
            if(err){
              err = 'error';
            }
          });
          //存储成功
          res.send('data inited');
        }
      })

});


router.post('/loginForm',function(req,res){
  if(req.body.password == '' || req.body.username == ''){
    res.send('用户名或密码不能为空！');
  }else{
    User.findOne({username:req.body.username})
        .exec(function(err,user){
          if(!user){
            res.send('用户名不存在！');
          }else if(user.hashed_password === hashPW(req.body.password.toString())){
            req.session.regenerate(function(){
              req.session.user = user._id;
              req.session.level = user.level;
              req.session.name = user.username;
              console.log(req.session);
              if(user.level === 0){
                res.redirect('/admin/index');
              }else{
                res.redirect('/');
              }
            });


          }else{
            res.send('账号密码不正确！');
          }

        })
  };



})

router.post('/changePwd',function(req,res){
  console.log( req.session.name);
  if(req.session.name == undefined){
    res.redirect('/users/login');
  }else{
    if(req.body.jiuPassword == '' || req.body.newPassword == ''|| req.body.yanPassword == ''){
      res.send('密码不能为空！');
    }else if(req.body.newPassword  != req.body.yanPassword){
      res.send('新密码和验证密码必须相同！');
    }else {

      User.findOne({username:req.session.name})
          .exec(function(err,user){
            if(!user){
              res.send('用户名不存在！');
            }else if(user.hashed_password != hashPW(req.body.jiuPassword.toString())){
              res.send('原密码不正确！');
            }else{
              user.set('hashed_password',hashPW(req.body.newPassword.toString()));
              user.save(function(err){
                if(err){
                  err = 'error';
                  res.send({succee:false,msg:'存储出错！'});
                }else{
                  delete req.session.user;
                  res.redirect('/users/login');
                }


              });

            }

          })
    };
  }




})


module.exports = router;
