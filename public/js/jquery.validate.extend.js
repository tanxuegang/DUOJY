jQuery.extend(jQuery.validator.messages, {
    required: "必填字段",
    remote: "请修正该字段",
    email: "请输入正确格式的电子邮件",
    url: "请输入合法的网址",
    date: "请输入合法的日期",
    dateISO: "请输入合法的日期 (ISO).",
    number: "请输入合法的数字",
    digits: "只能输入整数",
    creditcard: "请输入合法的信用卡号",
    equalTo: "请再次输入相同的值",
    accept: "请输入拥有合法后缀名的字符串",
    money: "请输入正确的金额格式",
    maxlength: jQuery.validator.format("请输入一个长度最多是 {0} 的字符串"),
    minlength: jQuery.validator.format("请输入一个长度最少是 {0} 的字符串"),
    rangelength: jQuery.validator.format("请输入一个长度介于 {0} 和 {1} 之间的字符串"),
    range: jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
    max: jQuery.validator.format("请输入一个最大为 {0} 的值"),
    min: jQuery.validator.format("请输入一个最小为 {0} 的值"),
    notIllegalCharacter:"请输入正确的内容",
    isPhone:"请输入正确的电话号码",
    isMultiPhone:"请输入正确的电话号码",
    isChar:"请填写正确的中文, 字母或者数字"
});


$.validator.setDefaults({focusInvalid:true, focusCleanup:true});

$.validator.setDefaults({
    errorPlacement: function (error, element) {
        try {
            if( element.hasClass( 'new-error' ) ){
                error.addClass('new-error-placement').insertAfter( element ).wrap('<div class="f-prompt new-f-prompt"></div>');
            }else{
                $(element).wrap("<i style='position: relative;font-style:normal;display: inline-block; float:left'></i>");
                element.after(error);
                element.addClass();
                var Labtop =element.height();
                error.css("top", Labtop + 10);
            }            
//            var Lableft =0;
//            error.css("left", Lableft);
//            if(Labtop < "28"){
//                error.css("top", "28px");
//            }else{
//                error.css("top", Labtop);
//            };
        } catch(e) {
            $(element).focus();
        }
    }
});


//增加身份证验证
function isIdCardNo(num) {
    num = num.toUpperCase();
    var factorArr = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1);
    var parityBit = new Array("1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2");
    var varArray = new Array();
    var intValue;
    var lngProduct = 0;
    var intCheckDigit;
    var intStrLen = num.length;
    var idNumber = num;
    // initialize
    if ((intStrLen != 15) && (intStrLen != 18)) {
        return false;
    }
    // check and set value
    for (i = 0; i < intStrLen; i++) {
        varArray[i] = idNumber.charAt(i);
        if ((varArray[i] < '0' || varArray[i] > '9') && (i != 17)) {
            return false;
        } else if (i < 17) {
            varArray[i] = varArray[i] * factorArr[i];
        }
    }
    if (intStrLen == 18) {
        //check date
        var date8 = idNumber.substring(6, 14);
        if (isDate8(date8) == false) {
            return false;
        }
        // calculate the sum of the products
        for (i = 0; i < 17; i++) {
            lngProduct = lngProduct + varArray[i];
        }
        // calculate the check digit
        intCheckDigit = parityBit[lngProduct % 11];
        // check last digit
        if (varArray[17] != intCheckDigit) {
            return false;
        }
    }
    else {        //length is 15
        //check date
        var date6 = idNumber.substring(6, 12);
        if (isDate6(date6) == false) {
            return false;
        }
    }
    return true;
}
function isDate6(sDate) {
    if (!/^[0-9]{6}$/.test(sDate)) {
        return false;
    }
    var myDate = new Date();
    var nowyear = myDate.getFullYear();
    var year, month, day;
    year = sDate.substring(0, 4);
    month = sDate.substring(4, 6);
    console.info(nowyear + "--22-" + year);
    if (year > nowyear)return false
    if (year < 1700 || year > 2500) return false
    if (month < 1 || month > 12) return false
    return true
}

function isDate8(sDate) {
    if (!/^[0-9]{8}$/.test(sDate)) {
        return false;
    }
    var myDate = new Date();
    var nowyear = myDate.getFullYear();

    var year, month, day;
    year = sDate.substring(0, 4);
    month = sDate.substring(4, 6);
    day = sDate.substring(6, 8);
    var iaMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    console.info(nowyear + "---" + year);
    if (year > nowyear)return false
    if (year < 1700 || year > 2500) return false
    if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) iaMonthDays[1] = 29;
    if (month < 1 || month > 12) return false
    if (day < 1 || day > iaMonthDays[month - 1]) return false
    return true
}
//身份证验证
jQuery.validator.addMethod("isIdCardNo", function (value, element) {
    return this.optional(element) || isIdCardNo(value);
}, "请正确输入您的身份证号码");
//电话号码
jQuery.validator.addMethod("isMobile", function (value, element) {
    var length = value.length;
    return this.optional(element) || length == 11 && /^1[3-8]\d{9}$/.test(value);
}, "请填写正确的手机号码");

//短信验证码
jQuery.validator.addMethod("isVerifCode", function (value, element) {
    var length = value.length;
    return this.optional(element) || length == 6 && /^\d{6}$/.test(value);
}, "请填写正确的验证码");
//验证是否是企业
jQuery.validator.addMethod("isCompany", function (value, element) {
    var length = value.length;
    return this.optional(element) || /^[\u4E00-\u9FA5]+$/.test(value);
}, "请填写正确的企业名称");

/**
 * 验证是中文, 字母, 数字
 */
jQuery.validator.addMethod("isChar", function (value, element) {
    var length = value.length;
    return this.optional(element) || /^[\u4E00-\u9FA50-9a-zA-Z]+$/.test(value);
}, "请填写正确的中文, 字母或者数字!");

//验证真实姓名
jQuery.validator.addMethod("isRealName", function (value, element) {
    var length = value.length;
    return this.optional(element) || /^[\u4E00-\u9FA5+.]{2,10}$/.test(value) && !/^[\u4E00-\u9FA5+.]{2,10}[.]$/.test(value) && !/^[.][\u4E00-\u9FA5+.]{2,10}$/.test(value)
}, "请填写正确的名字");

//验证钱
jQuery.validator.addMethod("money", function (value, element) {
    var money = /^([1-9][0-9]+|[0-9])(\.\d{1,2})?$/
    return money.test(value);
}, "请输入正确的金额");

//验证电话号码
jQuery.validator.addMethod("isPhone", function (value, element) {
    var phone = /((^\d{11}$)|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/
    return phone.test(value);
}, "请输入正确的电话号码");


//验证多个电话号码
jQuery.validator.addMethod("isMultiPhone", function (value, element) {
    var phone = /^(((\d{11})|((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})))([；、;，、,]?))+$/
    return phone.test(value);
}, "请输入正确的电话号码");

// 联系电话号码验证
jQuery.validator.addMethod("isPlane", function(value, element) {
    var tel = /^(\d{3,4}-)\d{7,9}$/g;
    return this.optional(element) || (tel.test(value));
}, "请正确填写您的联系电话。");
// 联系电话(手机/皆可)验证
jQuery.validator.addMethod("isTel", function(value,element) {
    var length = value.length;
    var mobile = /^1[3-8]\d{9}$/ ;
    console.info(length);
    var tel = /^(\d{3,4}-)\d{7,9}$/g;
    return this.optional(element) || tel.test(value) || (length==11 && mobile.test(value));
}, "请正确填写您的联系方式");



//不是非法字符
jQuery.validator.addMethod("notIllegalCharacter", function (value, element) {
    var char = /^[^><\/\\;&]*$/
    return char.test(value);
}, "请输入正确的内容");

//验证是否是工商注册号码
jQuery.validator.addMethod("isBusinessReg", function (value, element) {

    return this.optional(element) || reg(value);
}, "请填写正确的工商注册号码");
function reg(value) {

    if(!/^\d{15}$/.test(value)){
        return false;
    }

    var ss = value.substring(0, 14);

    var p;
    var max;
    for (var j = 1; j <= 14; j++) {
        if (j == 1) {
            p = 10;
        }

        var a1 = ss[j - 1];
        var s1 = parseInt(p % 11) + parseInt(a1);
        var s2;
        if (s1 % 10 == 0) {
            s2 = 10;
        } else {
            s2 = s1 % 10;
        }
        p = s2 * 2;
        if (j == 14) {
			var yu = parseInt(p%11);
					 amax =11-yu;
        }
		
    }
    var v = value.substring(14, 15);
    if (v == amax) {
        return true;
    }
    return false;
}

jQuery.validator.addMethod("diliMethod", function(value, element, param){
    var me = param;
//    var t = eval(me + "('"+value+"',"+element.id+")");
    var t = window[me].call(this, value, element);

    if(t != true) {
        $.validator.messages["diliMethod"] = t;
        return false;
    }
    return true;
});


jQuery.validator.addMethod("diliPattern", function(value, element, param){
    var params = param.split("/,");
    var pa = eval(params[0]+"/");
    var msg = params[1];
    var t = pa.test(value);
    if(t == false) {
        $.validator.messages["diliPattern"] = msg !== undefined ? msg : $.validator.messages[msg];
    }
    return t;
});