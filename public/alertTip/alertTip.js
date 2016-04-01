/**
 * Created with JetBrains WebStorm.
 * User: 99999904
 * Date: 13-11-18
 * Time: 下午1:24
 * To change this template use File | Settings | File Templates.
 */
//setTimeout(showBTW, 1000);
function showBTW(){
    $("body").append('<div class="bottom_pop_window"><div class="title">网站进度<a href="#" onclick="return closeBTW();" class="close">关闭</a></div>'+
        '<div id="popContent"><p>已经注册用户的同学可以上传头像了，先登录会员，在页面右上角 点击您的登录名——>个人设置</p><p>界面跳转后重新增加对ie8的支持--2014/4/24</p><p>增加对手机的支持--2014/4/24</p></div></div>');
    $(".bottom_pop_window").css("bottom",-140).animate({ bottom : 10 });
}

function closeBTW(){
    $(".bottom_pop_window").hide();
    return false;
}
function getCookie(c_name)
{
    if (document.cookie.length>0)
    {
        c_start=document.cookie.indexOf(c_name + "=");
        if (c_start!=-1)
        {
            c_start=c_start + c_name.length+1 ;
            c_end=document.cookie.indexOf(";",c_start);
            if (c_end==-1) c_end=document.cookie.length;
            return unescape(document.cookie.substring(c_start,c_end));
        }
    }
    return "";
}

function setCookie(c_name,value,expireHours)
{
    var exdate=new Date();
    exdate.setHours(exdate.getHours()+expireHours);
    document.cookie=c_name+ "=" +escape(value)+
        ((expireHours==null) ? "" : ";expires="+exdate.toGMTString());
}

function checkCookie()
{
    name=getCookie('alertInterval');
    if (name!=null && name!="")
    {}
    else
    {
        showBTW();
        setCookie('alertInterval','yici',2);
    }
}
//checkCookie();
