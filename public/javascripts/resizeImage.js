/**
 * Created by 99999904 on 14-4-24.
 */
(function ($) {

    $.fn.resizeimage = function () {

        var imgLoad = function (url, callback) {

            var img = new Image();

            img.src = url;

            if (img.complete) {

                callback(img.width, img.height);

            } else {

                img.onload = function () {

                    callback(img.width, img.height);

                    img.onload = null;

                };

            }
            ;

        };

        var original = {

            width: $(window).width()

        };

        return this.each(function (i, dom) {

            var image = $(this);

            imgLoad(image.attr('src'), function () {

                var img = {

                    width: image.width(),

                    height: image.height()

                }, percentage = 1;

                if (img.width < original.width) {

                    percentage = 1;

                } else {

                    percentage = (original.width) / img.width;

                }

                image.width(img.w = img.width * percentage - 30).height(img.h = img.height * percentage);

                $(window).resize(function () {

                    var w = $(this).width();

                    percentage = w / img.width > 1 ? 1 : w / img.width;

                    var newWidth = img.width * percentage - 30;

                    var newHeight = img.height * percentage;

                    image.width(newWidth).height(newHeight);

                });

            });

        });

    };

})(jQuery);

