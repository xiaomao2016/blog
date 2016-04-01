/**
 * Created with JetBrains WebStorm.
 * User: 99999904
 * Date: 13-10-14
 * Time: 下午2:03
 * To change this template use File | Settings | File Templates.
 */
var mailer = require('nodemailer');
var transport=mailer.createTransport({
    host:"smtp.163.com",
    port:25,
    auth: {
        user: "xiaozhan20130815@163.com",
        pass: "123abc"
    }
});
var SITE_ROOT_URL = 'http://localhost:3000';
//var SITE_ROOT_URL = 'http://xiao2013.ap01.aws.af.cm';
/**
 * 发送激活通知邮件
 * @param {String} who 接收人的邮件地址
 * @param {String} token 重置用的token字符串
 * @param {String} name 接收人的用户名
 * @param {String} email 接受人的邮件地址
 */
exports.sendActiveMail = function (who, token, name) {
    var html='<p>您好：<p/>' +
        '<p>我们收到您在筱站的注册信息，请点击下面的链接来激活帐户：</p>' +
        '<a href="' + SITE_ROOT_URL + '/active_account?key=' + token + '&name=' + name + '">激活链接</a>' +
        '<p>若您没有在筱站填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
        '<p>筱站谨上。</p>';
    var mailOptions = {
        from: "xiaozhan20130815@163.com", // sender address
        to:who, // list of receivers
        subject: "筱站帐户激活", // Subject line
        //text: "Hello world ✔", // plaintext body
        html: html // html body
    }
    transport.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + info.response );
        }
    });
};


