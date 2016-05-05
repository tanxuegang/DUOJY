/**
 * Created by Tanxg on 2016/3/16.
 */
$(function(){
    $(".tab3-tab ul li").eq(0).addClass("on");
    $(".tab3-tab ul li").click(function(){
        var i = $(".tab3-tab ul li").index(this);
        $(".tab3-tab ul li").removeClass("on");
        $(".tab3-tab ul li").eq(i).addClass("on");
        $(".tab3-tabcon ul li").hide();
        $(".tab3-tabcon ul li").eq(i).show();
    });
});