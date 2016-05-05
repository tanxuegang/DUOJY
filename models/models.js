/**
 * Created by tanxg520 on 2015/12/18.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var _User = new Schema({
    email:String,
    username:String,
    hashed_password:String,
    state:Number,
    level:Number,//0为超级管理员，1为普通用户
    creationTime:Date
});

var _Directory = new Schema({
    directoryName:String,//目录名称
/*    pingyin:String,//目录拼音*/
    netAddress:String,//跳转地址
    creationTime:Date,//创建时间
    state:Number//状态 （0为未使用，1为已使用）
});


var _Article = new Schema({
    directoryId:String,//目录ID
    directoryName:String,//目录名称
    keywords:String,//关键字
    imageUrl:String,//图片
    tags:String,//标记
    description:String,//描述
    title:String,//标题
    time:Date,//时间
    media_name:String,//作者
    content:String,//内容
    hits:Number,//点击量
    grade:Number,//等级 (0为幻灯，1为普通信息,2为推荐)
    state:Number//状态 （0为删除状态，1为正常）
});

var _Project = new Schema({
    site:String,//地点
    classify:String,//分类
    date:Date,//时间
    state:Number,//状态
    name:String,//名称
    description:String,//描述
    presentation:String,//介绍
    pic:String,//截图
    course:String,//历程
    team:String,//团队
    hits:Number//点击量
})

var _Comment = new Schema({
    articleId:String,//文章ID
    articleTitle:String,//文章标题
    date:Date,//评论时间
    name:String,//发表人
    content:String//发表内容

})
//后台账号管理（暂时前台注册的admin为后台管理账号）
/*var _Admin = new Schema({
    username:String,
    hashed_password:String,
    grade:Number
});*/
exports.User = mongoose.model('user',_User);
exports.Directory = mongoose.model('directory',_Directory);
exports.Article = mongoose.model('article',_Article);
exports.Project = mongoose.model('project',_Project);
exports.Comment = mongoose.model('comment',_Comment);
/*
exports.Admin = mongoose.model('admin',_Admin);*/
