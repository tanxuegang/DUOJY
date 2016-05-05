var express = require('express');
var router = express.Router();


var multiparty = require('multiparty');
var fs = require('fs');

var models =require('../models/models');
var EnumMange = require('../enum/enum.js')
var Directory = models.Directory;
var Article = models.Article;
var Project = models.Project;
var User = models.User;
var Comment = models.Comment;



//静态加载
/*router.get('/test',function(req,res){
    res.sendfile('/home/koothon/duojy/public/index.html');
});*/



/*超级管理注册*/
router.get('/manage',function(req,res){
    User.findOne({username:'admin',level:0})
        .exec(function(err,user){
            console.log(user)
            if(user){
                res.redirect('/');
            }else{
                Directory.find({state:1}).sort({creationTime:1})
                    .exec(function(err,directory){
                        res.render('manage', { title: '超级管理员',nav:directory});
                    })

            }
        })

})
/*超级管理注册*/



/* GET home page. */
router.get('/index', function(req, res, next) {

    var indexItem = {
        recommend:null,//推荐
        slideShow:null,//幻灯
        recList:null,//普通资讯
        firstRec:null,//第一条
        cyList:null,//成语
        yyList:null,//寓言
        xhList:null,//歇后语
        scList:null,//诗词
        wsList:null,//经典语录
        myList:null,//谜语大全
        comment:null,//最新评论
        cyTop:null,//图片
        yyTop:null//排行
    };
    var dire =EnumMange.Dire;
    Directory.find({state:1}).sort({creationTime:1})
        .exec(function(err,directory){

            Article.find({grade:2,state:1}).sort({hits:1}).limit(4)//推荐
                .exec(function(err,article){
                    indexItem.recommend = article;
                    Article.find({grade:0,state:1})//幻灯
                        .exec(function(err,article){
                            indexItem.slideShow = article;
                            Article.find({directoryId:dire[0].dirId,grade:1,state:1}).sort({time:-1}).limit(3).skip(1)//普通资讯
                                .exec(function(err,article){
                                    indexItem.recList = article;
                                    Article.find({directoryId:dire[0].dirId,grade:1,state:1}).sort({time:-1}).limit(1)//资讯第一条
                                        .exec(function(err,article){
                                            indexItem.firstRec = article;
                                            Article.find({directoryId:dire[1].dirId,state:1}).sort({time:-1}).limit(20)//成语
                                                .exec(function(err,article){
                                                    indexItem.cyList = article;
                                                    Article.find({directoryId:dire[2].dirId,state:1}).sort({time:-1}).limit(20)//寓言
                                                        .exec(function(err,article){
                                                            indexItem.yyList = article;
                                                            Article.find({directoryId:dire[4].dirId,state:1}).sort({time:-1}).limit(20)//经典语录
                                                                .exec(function(err,article){
                                                                    indexItem.wsList = article;
                                                                    Article.find({directoryId:dire[3].dirId,state:1}).sort({time:-1}).limit(20)//诗词
                                                                        .exec(function(err,article){
                                                                            indexItem.scList = article;
                                                                            Article.find({directoryId:dire[5].dirId,state:1}).sort({time:-1}).limit(20)//歇后语
                                                                                .exec(function(err,article){
                                                                                    indexItem.xhList = article;
                                                                                    Article.find({directoryId:dire[6].dirId,state:1}).sort({time:-1}).limit(20)//谜语大全
                                                                                        .exec(function(err,article){
                                                                                            indexItem.myList = article;
                                                                                            Article.find({"imageUrl":{$ne:''},state:1}).sort({time:-1}).limit(8)//图片推荐
                                                                                                .exec(function(err,article){
                                                                                                    indexItem.cyTop = article;
                                                                                                    var d = new Date();
                                                                                                    d.setDate(d.getDate() - 30);
                                                                                                    console.log(d)
                                                                                                    Article.find({"time":{"$gt":d},state:1}).sort({hits:-1}).limit(20)//TOP
                                                                                                        .exec(function(err,article){
                                                                                                            indexItem.yyTop = article;
                                                                                                            Comment.find().sort({date:-1}).limit(20)//评论
                                                                                                                .exec(function(err,comment){
                                                                                                                    indexItem.comment = comment;
                                                                                                                    res.render('index', { title: '朵朵学习-你身边的教育学习平台！',indexItem:indexItem,nav:directory});
                                                                                                                })


                                                                                                        })
                                                                                                })

                                                                                        })

                                                                                })

                                                                        })

                                                                })

                                                        })

                                                })





                                        })
                                })
                        })
                })
        })



});


router.get('/:page/list_:directoryId.html', function(req, res, next) {

    var directoryId = req.param('directoryId');
    var page = req.param('page');
    var d = new Date();
    d.setDate(d.getDate() - 30);
    //console.log(d)
    if(directoryId){
        var pagenum =10; //分页的条数
        var total = 0;
        Directory.find({state:1}).sort({creationTime:1})
            .exec(function(err,directory){
                Article.count({directoryId:directoryId,state:1},function(err,count){
                    total = Math.ceil(count/pagenum);
                    if(req.query.page > 0){
                        page = parseInt(req.query.page);
                    }
                    /*if(req.query.pagenum){
                     pagenum = req.query.pagenum;
                     }*/
                    Article.find({directoryId:directoryId,state:1}).sort({_id:-1}).limit(pagenum).skip(pagenum*(page-1))
                        .exec(function(err,artice){
                            var listItem;
                            listItem={item:artice,total:total,page:page,pagenum:pagenum,directoryId:directoryId};

                            Article.find({"time":{"$gt":d},directoryId:directoryId,state:1}).sort({hits:-1}).limit(10)
                                .exec(function(err,top){
                                    Article.find({"time":{"$gt":d},state:1}).sort({hits:-1}).limit(15)
                                        .exec(function(err,topTags){
                                            res.render('list', { title: artice[0].directoryName+'第'+page+'页'+'列表_朵朵学习',navId:directoryId,list:listItem,moment:require('moment'),nav:directory,top:top,topTags:topTags});
                                        });
                                });



                        });
                });
            })


    }else{
        res.redirect('/');
    }



});


router.get('/detail_:detailId.html', function(req, res, next) {
    var detaild = req.param('detailId');
    var d = new Date();
    d.setDate(d.getDate() - 30);
    //console.log(d)
    if(detaild){
        Directory.find({state:1}).sort({creationTime:1}).exec(function(err,directory){
            Article.findOne({_id:detaild}).exec(function(err,article){
                Article.find({"time":{"$gt":d},directoryId:article.directoryId,state:1}).sort({hits:-1}).limit(10).exec(function(err,top){
                    Article.find({"time":{"$gt":d},state:1}).sort({hits:-1}).limit(15).exec(function(err,topTags){
                        Comment.find({articleId:detaild}).sort({date:-1}).exec(function(err,comment){
                            Article.count({directoryId:article.directoryId,state:1},function(err,count){
                                var x = parseInt(Math.random() * count);
                                Article.find({directoryId:article.directoryId,state:1}).limit(10).skip(x).exec(function(err,cn){
                                    Article.find({directoryId:article.directoryId,state:1}).sort({_id:-1}).limit(10).exec(function(err,xg){
                                        res.render('detail', { title: article.title +"_"+article.directoryName+ '_朵朵学习',navId:article.directoryId,article:article,cn:cn,xg:xg,moment:require('moment'),nav:directory,top:top,topTags:topTags,comment:comment});
                                    })
                                })
                            });
                        })

                    });

                });
                });

            })
    }else{
        res.redirect('/');
    }


});

router.post('/AddHits', function(req, res, next) {
    //console.log(req.body.detailId)
    Article.findOne({_id:req.body.detailId}).exec(function(err,article) {
        article.set('hits', article.hits + 1)//读取时点击+1
        article.save(function (err) {
            res.send('hits +1');

        })
    });

});



router.get("/search",function(req,res,next){
    var page = 1;  //取得page的值,注意route中的配置,可以有可以没有这个page
    var pagenum =10; //分页的条数
    var total = 0;
    var search_word = req.query.word;
    //console.log(search_word);
    var d = new Date();
    d.setDate(d.getDate() - 30);
    //console.log(d)
    if(search_word == "" || search_word == undefined){
        res.redirect('/');
    }else{
        Directory.find({state:1}).sort({creationTime:1})
            .exec(function(err,directory){
                directory.forEach(function(key){
                    //console.log(key.netAddress)
                    if(search_word == key.directoryName){
                        res.redirect(key.netAddress);
                    }
                })
                //模糊查询
                var qs=new RegExp(search_word);

                Article.count({title:qs,state:1},function(err,count) {
                    total = Math.ceil(count / pagenum);
                    if (req.query.page > 0) {
                        page = parseInt(req.query.page);
                    }
                    Article.find({title:qs,state:1}).sort({hits:-1}).limit(100).exec(function(err,artice){
                        var listItem;
                        listItem={item:artice,total:total,page:page,pagenum:pagenum};

                        Article.find({"time":{"$gt":d},state:1}).sort({hits:-1}).limit(15)
                            .exec(function(err,topTags){
                                res.render('search', { title:'"'+search_word+'"搜索结果_朵朵学习',list:listItem,moment:require('moment'),nav:directory,topTags:topTags,searchWord:search_word});

                            });

                    })
                });

            });
    }

})


router.get('/404.html',function(req,res){
    Directory.find({state:1}).sort({creationTime:1})
        .exec(function(err,directory){
            res.render('404', { title: '对不起，您的地址找不到了！_朵朵学习',nav:directory});

        })

})



router.get('/sitemap',function(req,res){
    /*Directory.find({state:1}).sort({creationTime:1})
        .exec(function(err,directory){

            Article.find({state:1}).sort({_id:-1})
                .exec(function(err,article){
                    res.render('sitemap', { title: 'sitemap',moment:require('moment'),directory:directory,article:article});
                });

        })*/

    Article.find({directoryId:'56ef711cbdee5bb005d446eb',state:1}).sort({_id:-1})
        .exec(function(err,article){
            res.render('sitemap', { title: 'sitemap',moment:require('moment'),article:article});
        });

})


/* 上传*/
router.post('/file/uploading', function(req, res, next){
    //生成multiparty对象，并配置上传目标路径
    var form = new multiparty.Form({uploadDir: process.cwd()+'/public/imgs/'});
    //上传完成后处理
    form.parse(req, function(err, fields, files) {
        var filesTmp = JSON.stringify(files,null,2);

        if(err){
            console.log('parse error: ' + err);
        } else {
            console.log('parse files: ' + filesTmp);
            var inputFile = files.inputFile[0];
            var uploadedPath = inputFile.path;
            /*var dstPath = './public/imgs/' + inputFile.originalFilename;
            //重命名为真实文件名
            fs.rename(dstPath, uploadedPath, function(err) {
                console.log("err")

                if(err){
                    console.log('rename error: ' + err);
                } else {
                    console.log('rename ok');
                }
            });*/
        }
        res.render('upload', {files: uploadedPath});

    });
});




router.post('/comment',function(req,res){
    var result = {
        msg:"信息有误，评论失败！",
        state:false,
        data:null
    }
    console.log(req.body.name)
    if(req.body.name == undefined || req.body.content == undefined || req.body.articleId == undefined || req.body.articleTitle == undefined){
        res.send(result);
    }else{
        var comment = new Comment({name:req.body.name});
        comment.set("content", req.body.content);
        comment.set("date",new Date());
        comment.set("articleId",req.body.articleId);
        comment.set("articleTitle",req.body.articleTitle);
        comment.save(function(err){
            if(err){
                res.send(result);
            }else{
                result.msg = "发表成功！";
                result.state = true;
                result.data = req.body;
                res.send(result);
            }

        })
    }
})










/*________________以下为angularJS使用________________*/
//获取目录列表
router.get('/directoryList',function(req,res){
  Directory.find({state:1})
      .exec(function(err,directory){
        //console.log(directory);
        res.json(directory);
      });


})
//获取信息列表
router.post('/newsList',function(req,res){
    var num =10; //分页的条数
    console.log(req.body.directoryId)
    Article.find({directoryId:req.body.directoryId})
        .exec(function(err,directory){
            //console.log(directory);
            res.json(directory);
        });


})

//首页获取信息列表
router.post('/O2OList',function(req,res){
    var num =10; //分页的条数
    Article.find({directoryId:req.body.directoryId,grade:req.body.grade,state:1}).limit(num)
        .exec(function(err,directory){
            //console.log(directory);
            res.json(directory);
        });


})

//获取信息详情
router.get('/detail',function(req,res){
    if(req.query.detailId){
        Article.findOne({_id:req.query.detailId,state:1})
            .exec(function(err,article){
                console.log(article);
                article.set('hits',article.hits+1)//读取时点击+1
                article.save(function(err){
                    if(err){
                        res.msg = '点击+1时，失败';
                    }
                    console.log(article);
                    res.json(article);
                })

            });
    }else{
        res.render('error', {
            message: err.message,
            error: {}
        });
    }



})





//------------------------------------------
//首页项目列表
router.post('/projectList',function(req,res) {
    var num =10; //分页的条数
    Project.find({state:1}).sort({hits:-1}).limit(num)
        .exec(function(err,project){
            res.json(project);
        });
});
//进入详情页面
router.get('/projectDetail.html', function(req, res, next) {
    if (req.session.user) {
        res.render('projectDetail', { title: '项目详情',session:req.session});
    }else{
        res.render('projectDetail', { title: '项目详情'});
    }

});
//进入项目列表
router.get('/projectList.html', function(req, res, next) {
    if (req.session.user) {
        res.render('projectList', { title: '项目列表',session:req.session});
    }else{
        res.render('projectList', { title: '项目列表'});
    }

});
//详情数据
router.get('/projectDetail', function(req, res, next) {
    if(req.query.projectId){
        Project.findOne({_id:req.query.projectId,state:1})
            .exec(function(err,project){
                console.log(project);
                project.set('hits',project.hits+1)//读取时点击+1
                project.save(function(err){
                    if(err){
                        res.msg = '点击+1时，失败';
                    }
                    res.json(project);
                })

            });
    }else{
        res.render('error', {
            message: err.message,
            error: {}
        });
    }

});

//首页项目详情数据
router.get('/project',function(req,res){
    if(req.query.projectId){
        Project.findOne({_id:req.query.projectId,state:1})
            .exec(function(err,project){
                //console.log(article);
                project.set('hits',article.hits+1)//读取时点击+1
                project.save(function(err){
                    if(err){
                        res.msg = '点击+1时，失败';
                    }
                    res.json(project);
                })

            });
    }else{
        res.render('error', {
            message: err.message,
            error: {}
        });
    }



})




module.exports = router;
