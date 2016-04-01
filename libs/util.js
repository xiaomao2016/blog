//var xss = require('xss');

/*exports.getItemCreateTime = function (objectId) {
    var str = objectId.toString().slice(0, 8);
    var time = parseInt(str, 16) * 1000;
    var date = new Date(time);
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
};*/
exports.getItemCreateTime = function(objectId){
    var str = objectId.toString().slice(0,8);
    var time = parseInt(str,16) * 1000;
    return new Date(time);
}
exports.getDate=function(date) {
    var Y = date.getFullYear();
    var M = date.getMonth()+1;
    if (M < 10) M = '0' + M;
    var D = date.getDate();
    if (D < 10) D = '0' + D;
    var h = date.getHours();
    if (h < 10) h = '0' + h;
    var m = date.getMinutes();
    if (m < 10) m = '0' + m;
    var s = date.getSeconds();
    if (s < 10) s = '0' + s;
    return (Y+'-'+M+'-'+D+' '+h+':'+m+':'+s);
}
exports.format_date = function (date, friendly) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    if (friendly) {
        var now = new Date();
        //var mseconds = -(date.getTime() - now.getTime()-8*60*60*1000);
        var mseconds = -(date.getTime() - now.getTime() - 8 * 60 * 60 * 1000);//对应appfog时间
        var time_std = [ 1000, 60 * 1000, 60 * 60 * 1000, 24 * 60 * 60 * 1000 ];
        if (mseconds < time_std[3]) {
            if (mseconds > 0 && mseconds < time_std[1]) {
                return Math.floor(mseconds / time_std[0]).toString() + ' 秒前';
            }
            if (mseconds > time_std[1] && mseconds < time_std[2]) {
                return Math.floor(mseconds / time_std[1]).toString() + ' 分钟前';
            }
            if (mseconds > time_std[2]) {
                return Math.floor(mseconds / time_std[2]).toString() + ' 小时前';
            }
        }
    }

    //month = ((month < 10) ? '0' : '') + month;
    //day = ((day < 10) ? '0' : '') + day;
    hour = ((hour < 10) ? '0' : '') + hour;
    minute = ((minute < 10) ? '0' : '') + minute;
    second = ((second < 10) ? '0' : '') + second;

    var thisYear = new Date().getFullYear();
    year = (thisYear === year) ? '' : (year + '-');
    return year + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function (html) {
    var codeSpan = /(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm;
    var codeBlock = /(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g;
    var spans = [];
    var blocks = [];
    var text = String(html).replace(/\r\n/g, '\n')
        .replace('/\r/g', '\n');

    text = '\n\n' + text + '\n\n';

    text = text.replace(codeSpan, function (code) {
        spans.push(code);
        return '`span`';
    });

    text += '~0';

    return text.replace(codeBlock, function (whole, code, nextChar) {
        blocks.push(code);
        return '\n\tblock' + nextChar;
    })
        .replace(/&(?!\w+;)/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/`span`/g, function () {
            return spans.shift();
        })
        .replace(/\n\tblock/g, function () {
            return blocks.shift();
        })
        .replace(/~0$/, '')
        .replace(/^\n\n/, '')
        .replace(/\n\n$/, '');
};

/**
 * XSS模块配置
 */
var xssOptions = {
    whiteList: {
        h1: [],
        h2: [],
        h3: [],
        h4: [],
        h5: [],
        h6: [],
        hr: [],
        span: [],
        strong: [],
        b: [],
        i: [],
        br: [],
        p: [],
        pre: ['class'],
        code: [],
        a: ['target', 'href', 'title'],
        img: ['src', 'alt', 'title'],
        div: [],
        table: ['width', 'border'],
        tr: [],
        td: ['width', 'colspan'],
        th: ['width', 'colspan'],
        tbody: [],
        thead: [],
        ul: [],
        li: [],
        ol: [],
        dl: [],
        dt: [],
        em: [],
        cite: [],
        section: [],
        header: [],
        footer: [],
        blockquote: [],
        audio: ['autoplay', 'controls', 'loop', 'preload', 'src'],
        video: ['autoplay', 'controls', 'loop', 'preload', 'src', 'height', 'width']
    }
};

//本周第一天
exports.getWeekFirstDay = function () {
    var Nowdate = new Date();
    var WeekFirstDay = new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000 - (Nowdate.getHours() * 1000 * 60 * 60) - (Nowdate.getMinutes() * 1000 * 60) - (Nowdate.getSeconds() * 1000));
    return WeekFirstDay.getTime();
}
//本周最后一天
exports.getWeekLastDay = function () {
    var Nowdate = new Date();
    var WeekFirstDay = new Date(Nowdate - (Nowdate.getDay() - 1) * 86400000 - (Nowdate.getHours() * 1000 * 60 * 60) - (Nowdate.getMinutes() * 1000 * 60) - (Nowdate.getSeconds() * 1000));
    var WeekLastDay = new Date((WeekFirstDay / 1000 + 6 * 86400) * 1000);
    return WeekLastDay.getTime();
}
//本月第一天
exports.getMonthFirstDay = function () {
    var Nowdate = new Date();
    var MonthFirstDay = new Date(Nowdate.getYear(), Nowdate.getMonth(), 1);
    return MonthFirstDay.getTime();
}
//本月最后一天
exports.getMonthLastDay = function () {
    var Nowdate = new Date();
    var MonthNextFirstDay = new Date(Nowdate.getYear(), Nowdate.getMonth() + 1, 1);
    var MonthLastDay = new Date(MonthNextFirstDay - 86400000);
    return MonthLastDay.getTime();
}

/**
 * 过滤XSS攻击代码
 *
 * @param {string} html
 * @return {string}
 */
/*exports.xss = function (html) {
 return xss(html, xssOptions);
 };*/
