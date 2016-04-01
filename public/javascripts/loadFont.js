/**
 * Created with JetBrains WebStorm.
 * User: 99999904
 * Date: 13-11-18
 * Time: 下午12:58
 * To change this template use File | Settings | File Templates.
 */
var fontFile = /msie/.test(navigator.userAgent.toLowerCase()) ? '../font/SentyMarukoElementary.eot'
    : '../font/SentyMarukoElementary.ttf';
var emojiFile = /msie/.test(navigator.userAgent.toLowerCase()) ? '../font/Symbola.eot'
    : '../font/Symbola.ttf';
var cssFile = /msie/.test(navigator.userAgent.toLowerCase()) ? '../stylesheets/ie8below.css'
    : '../stylesheets/nonIE.css';

$(document).ready(function () {
    $.ajax({
        url: fontFile,
        beforeSend: function (xhr) {
            xhr.overrideMimeType("application/octet-stream");
        }
    }).done(function (data) {
            $("<link />")
                .appendTo($('head'))
                .attr({type: 'text/css', rel: 'stylesheet'})
                .attr('href', cssFile);
        });

    $.ajax({
        url:emojiFile,
        beforeSend:function(xhr){
            xhr.overrideMimeType("application/octet-stream");
        }
    }).done(function(data){
            var arr=new Array();
            arr.push('&#128522;');
            /*arr.push('&#128516;');
            arr.push('&#128519;');
            arr.push('&#128515;');
            arr.push('&#127823;');
            arr.push('&#128062;');
            arr.push('&#128641;');
            arr.push('&#128175;');
            arr.push('&#128074;');
            arr.push('&#127861;');
            var num=Math.floor(Math.random()*10);*/
            $('#aTitle').append('<span style="font-family: emoji;font-weight: bold;font-size:28px;">&nbsp;'+arr[0]+'</span>');
            $('#divNewsHot>p:nth-child(2) span').hide();
            $('#divNewsHot>p:nth-child(2)').prepend('<span style="font-family:emoji;font-size:36px;">&#127017;</span>');
            $('#divAD>p:nth-child(2)').append('<span style="font-family:emoji;font-size:20px;">&#128064;</span>');
        });
});
