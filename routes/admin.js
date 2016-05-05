var express = require('express');
var router = express.Router();

var fs = require("fs") ;
var EnumMange = require('../enum/enum.js')
var models =require('../models/models');
var User = models.User;
var Directory = models.Directory;
var Article = models.Article;
var Project = models.Project;
var Comment = models.Comment;


router.get('/index', function(req, res, next) {
    res.render('admin/index', { title: '管理首页',session:req.session,moment:require('moment')});

});

router.get('/user', function(req, res, next) {
    if(req.session.user){
        var page = 1;  //取得page的值,注意route中的配置,可以有可以没有这个page
        var pagenum =20; //分页的条数
        var total = 0;
        User.count(function(err,count){
            total = Math.ceil(count/pagenum);
        });
        if(req.query.page > 0){
            page = parseInt(req.query.page);
        }
        User.find().sort({_id:-1}).limit(pagenum).skip(page-1)
            .exec(function(err,user){
                res.render('admin/userList', { title: '用户管理',total:total,list:user,page:page,session:req.session,moment:require('moment')});
            })
    }else{
        res.redirect('/');
    }


});
//生成首页
router.post('/setIndex',function(req,res){
    var file =  process.cwd()+'/public/index.html';   //windows
   /* var file =  '/home/koothon/duojy/public/index.html';   //linux*/
    var html = req.body.html;
    console.log(file);
    fs.writeFile(file,html,function (err) {
        if (err){
            res.end('保存出错');
        }else{
            res.end('生成成功');
        }

    }) ;
    res.end('生成成功');
})

//进入目录新增页面
router.get('/addDirectory',function(req,res){
    res.render('admin/addDirectory', { title: '新增目录'});
})
//进入目录列表
router.get('/directoryList',function(req,res){
    var page = 1;  //取得page的值,注意route中的配置,可以有可以没有这个page
    var pagenum =20; //分页的条数
    var total = 0;
    User.count(function(err,count){
        total = Math.ceil(count/pagenum);
        if(req.query.page > 0){
            page = parseInt(req.query.page);
        }
        Directory.find().sort({_id:-1}).limit(pagenum).skip(pagenum*(page-1))
            .exec(function(err,user){
                res.render('admin/directoryList', { title: '目录管理',total:total,list:user,page:page,session:req.session,moment:require('moment')});
            })
    });


})
//进入修改目录页面
router.get('/editDirectory',function(req,res){
    console.log("ID:"+req.query.directoryId);
    Directory.findOne({_id:req.query.directoryId})
        .exec(function(err,directory){
            console.log(directory);
            res.render('admin/editDirectory', { title: '修改目录',content:directory,directoryId:directory._id});
        });

});
//删除目录
router.post('/removeDirectory',function(req,res){
    console.log("ID:"+req.body.directoryId);
    Directory.findOne({_id:req.body.directoryId})
        .exec(function(err,directory){
            if(directory){

                directory.remove(function(err){
                    if(err){
                        res.send({succee:false,msg:'删除失败！'});
                    }else{
                        res.send({succee:true,msg:'删除成功！'});
                    }
                });
            }else{
                res.send({succee:false,msg:'删除失败！'});
            }
        });

});
//添加或修改目录
router.post('/saveDirectory',function(req,res){
    console.log("删除目录ID:"+req.body);
    if(req.body.directoryId){
        Directory.findOne({_id: req.body.directoryId})
            .exec(function(err,directory){
                directory.set('directoryName',req.body.directoryName);
                if(req.body.netAddress != undefined){
                    directory.set('netAddress',req.body.netAddress);
                }
                if(req.body.state == 1 || req.body.state == 0){
                    directory.set('state',req.body.state);
                }
                directory.save(function(err){
                    if(err){
                        err = 'error';
                        res.send({succee:false,msg:'存储出错！'});
                    }
                })
            })
        //修改成功
        res.send({succee:true,msg:'修改成功！'});
    }else{
        var directory = new Directory({directoryName:req.body.directoryName});
        directory.set('creationTime',new Date());
        directory.set('state',0);
        //存储出错
        directory.save(function(err){
            if(err){
                err = 'error';
                res.send({succee:false,msg:'存储出错！'});
            }
        });
        //存储成功
        res.send({succee:true,msg:'添加成功！'});
    }


})

//进入文章新增页面
router.get('/addArticle',function(req,res){

    var id = req.query.directoryId;
    res.render('admin/addArticle', { title: '新增文章',directoryId:id});
})
//进入文章列表
router.get('/articleList',function(req,res){
    var qs = {}
    var title = req.query.title;
    if(title != "" && title != undefined){
        qs.title = title;
    }

    var directoryId= req.query.directoryId;
    if(directoryId != "" && directoryId != undefined){
        qs.directoryId = directoryId;
    }
    var media_name= req.query.media_name;
    if(media_name != "" && media_name != undefined){
        qs.media_name = media_name;
    }
    var keywords= req.query.keywords;
    if(keywords != "" && keywords != undefined){
        qs.keywords = keywords;
    }
   /* var time= req.query.time;
    if(title == "" || title == undefined){
        qs.title = title;
    }*/
//console.log(qs)

    var page = 1;  //取得page的值,注意route中的配置,可以有可以没有这个page
    var pagenum =20; //分页的条数
    var total = 0;
    Article.count(function(err,count){
        total = Math.ceil(count/pagenum);
        if(req.query.page > 0){
            page = parseInt(req.query.page);
        }
        Article.find(qs).sort({_id:-1}).limit(pagenum).skip(pagenum*(page-1))
            .exec(function(err,article){
                res.render('admin/articleList', { title: '文章管理',total:total,list:article,page:page,session:req.session,moment:require('moment')});
            })
    });


})

//进入修改文章页面
router.get('/editArticle',function(req,res){
    Article.findOne({_id:req.query.articleId})
        .exec(function(err,article){
            //console.log(article);
            res.render('admin/editArticle', { title: '修改文章',article:article});
        });

});
//删除文章
router.post('/removeArticle',function(req,res){
    console.log("删除文章ID:"+req.body.articleId);
    Article.findOne({_id:req.body.articleId})
        .exec(function(err,article){
            if(article){

                article.remove(function(err){
                    if(err){
                        res.send({succee:false,msg:'删除失败！'});
                    }else{
                        res.send({succee:true,msg:'删除成功！'});
                    }
                });
            }else{
                res.send({succee:false,msg:'删除失败！'});
            }
        });

});
//添加或修改文章
router.post('/saveArticle',function(req,res){
    //console.log(req.body);
    if(req.body.articleId){
        Article.findOne({_id: req.body.articleId})
            .exec(function(err,article){
                article.set('directoryId',req.body.directoryId);
                article.set('directoryName',req.body.directoryName);
                article.set('title',req.body.title);
                article.set('media_name',req.body.media_name);
                article.set('keywords',req.body.keywords);
                article.set('imageUrl',req.body.imageUrl);
                article.set('tags',req.body.tags);
                article.set('description',req.body.description);
                article.set('content',req.body.content);
                article.set('grade',req.body.grade);
                article.save(function(err){
                    if(err){
                        err = 'error';
                        res.send({succee:false,msg:'存储出错！'});
                    }
                })
            })
        //修改成功
        res.send({succee:true,msg:'修改成功！'});
    }else{
        var article = new Article();
        article.set('directoryId',req.body.directoryId);
        article.set('directoryName',req.body.directoryName);
        article.set('title',req.body.title);
        article.set('media_name',req.body.media_name);
        article.set('keywords',req.body.keywords);
        article.set('imageUrl',req.body.imageUrl);
        article.set('tags',req.body.tags);
        article.set('description',req.body.description);
        article.set('content',req.body.content);
        article.set('time',new Date());
        article.set('grade',1);
        article.set('state',1);
        article.set("hits",0);
        //存储出错
        article.save(function(err){
            if(err){
                err = 'error';
                res.send({succee:false,msg:'存储出错！'});
            }
        });
        //存储成功
        res.send({succee:true,msg:'添加成功！'});
    }


})

//进入项目添加页面
router.get('/addProject',function(req,res){
    var site = EnumMange.Site
    var classify = EnumMange.Classify
    res.render('admin/addProject', { title: '新增项目',site:site,classify:classify});
})
//进入修改项目页面
router.get('/editProject',function(req,res){
    var site = EnumMange.Site
    var classify = EnumMange.Classify
    Project.findOne({_id:req.query.projectId})
        .exec(function(err,project){
            res.render('admin/editProject', { title: '修改项目',project:project,site:site,classify:classify});
        });

});
//添加或修改项目
router.post('/saveProject',function(req,res){
    //console.log(req.body);
    if(req.body.projectId){
        Project.findOne({_id: req.body.projectId})
            .exec(function(err,project){
                project.set('site',req.body.site);
                project.set('classify',req.body.classify);
                project.set('name',req.body.name);
                project.set('presentation',req.body.presentation);
                project.set('keywords',req.body.keywords);
                project.set('pic',req.body.pic);
                project.set('course',req.body.course);
                project.set('team',req.body.team);
                project.save(function(err){
                    if(err){
                        err = 'error';
                        res.send({succee:false,msg:'存储出错！'});
                    }
                })
            })
        //修改成功
        res.send({succee:true,msg:'修改成功！'});
    }else{
        var project = new Project();
        project.set('site',req.body.site);
        project.set('classify',req.body.classify);
        project.set('name',req.body.name);
        project.set('presentation',req.body.presentation);
        project.set('pic',req.body.pic);
        project.set('course',req.body.course);
        project.set('team',req.body.team);
        project.set('date',new Date());
        project.set('state',1);
        project.set('hits',0);
        //存储出错
        project.save(function(err){
            if(err){
                err = 'error';
                res.send({succee:false,msg:'存储出错！'});
            }
        });
        //存储成功
        res.send({succee:true,msg:'添加成功！'});
    }


})

//进入文章列表
router.get('/projectList',function(req,res){
    var page = 1;  //取得page的值,注意route中的配置,可以有可以没有这个page
    var pagenum =20; //分页的条数
    var total = 0;
    Project.count(function(err,count){
        total = Math.ceil(count/pagenum);
        if(req.query.page > 0){
            page = parseInt(req.query.page);
        }
        Project.find().sort({_id:-1}).limit(pagenum).skip(pagenum*(page-1))
            .exec(function(err,project){
                res.render('admin/projectList', { title: '项目管理',total:total,list:project,page:page,session:req.session,moment:require('moment')});
            })
    });


})

//进入评论列表
router.get('/commentList',function(req,res){
    var page = 1;  //取得page的值,注意route中的配置,可以有可以没有这个page
    var pagenum =20; //分页的条数
    var total = 0;
    Comment.count(function(err,count){
        total = Math.ceil(count/pagenum);
        if(req.query.page > 0){
            page = parseInt(req.query.page);
        }
        Comment.find().sort({_id:-1}).limit(pagenum).skip(pagenum*(page-1))
            .exec(function(err,project){
                res.render('admin/commentList', { title: '评论管理',total:total,list:project,page:page,session:req.session,moment:require('moment')});
            })
    });


})

//删除评论
router.post('/removeComment',function(req,res){
    console.log("删除评论ID:"+req.body.commentId);
    Comment.findOne({_id:req.body.commentId})
        .exec(function(err,comment){
            if(comment){

                comment.remove(function(err){
                    if(err){
                        res.send({succee:false,msg:'删除失败！'});
                    }else{
                        res.send({succee:true,msg:'删除成功！'});
                    }
                });
            }else{
                res.send({succee:false,msg:'删除失败！'});
            }
        });

});




//采集成语页面
/*
router.get('/cy',function(req,res){
    res.render('admin/cyCJ', { title: 'CJ'});
})
*/



module.exports = router;
