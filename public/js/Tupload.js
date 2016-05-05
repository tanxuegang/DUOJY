/**
 * Created by Tanxg on 2016/4/14.
 */
(function($){
    $.fn.uploader = function(opts){

        var defaults = {
            fileTypeExts:'',//允许上传的文件类型，填写mime类型
            url:'',//文件提交的地址
            auto:false,//自动上传
            buttonText:'上传文件',//上传按钮上的文字
            imgName:'',//目标Input
            onUploadStart:function(){},//上传开始时的动作
            onInit:function(){}//初始化时的动作
        }

        var option = $.extend(defaults,opts);
        var formHtml = '<form method="post" id="uploadForm" data="'+defaults.imgName+'" action="'+defaults.url+'" target="upload_iframe" enctype="multipart/form-data"><input name="inputFile" id="inputFile" type="file" style="display: none" multiple="multiple"><input name="btnUp" id="btnUp" type="button" value="上传"></form><iframe style="display: none" id="upload_iframe" name="upload_iframe">flag</iframe>'
        var html = '<a href="javascript:void(0);" id="fileText">'+defaults.buttonText+'</a>'
        //初始化文件对象

        var _this = $('body');
        this.html(html);
        _this.append(formHtml);


        var fileText = _this.find('#fileText');
        var btnFile = _this.find('#btnUp');
        var inputFile = _this.find('#inputFile');
        var upForm = _this.find('#uploadForm');
        var Iframe = _this.find("#upload_iframe");

        if(defaults.auto){
            btnFile.hide();
        }

        fileText.live('click',function(){
            inputFile.click();
        });

        inputFile.live('change',function(){
            option.onUploadStart();
            if(inputFile.val() == ""){
                alert("请选择你要上传的文件！");
                return;
            }
            upForm.submit();
        });

        /*btnFile.live('click',function(){
            option.onUploadStart();
            if(inputFile.val() == ""){
                alert("请选择你要上传的文件！");
                return;
            }
            upForm.submit();
        });*/






    }

})(jQuery)
