/**
 * Created with JetBrains WebStorm.
 * User: 99999904
 * Date: 13-11-14
 * Time: 上午9:58
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function(){
    $('[placeholder][type=text]').focus(function() {
        var input = $(this);
        if (input.val() == input.attr('placeholder')) {
            input.val('');
            input.removeClass('placeholder');
        }
    }).blur(function() {
            var input = $(this);
            if (input.val() == '' || input.val() == input.attr('placeholder')) {
                input.addClass('placeholder');
                input.val(input.attr('placeholder'));
            }
        }).blur().parents('form').submit(function() {
            $(this).find('[placeholder]').each(function() {
                var input = $(this);
                if (input.val() == input.attr('placeholder')) {
                    input.val('');
                }
            })
        });
    // On DOM ready, hide the real password
    $('#real_pass').hide();

// Show the fake pass (because JS is enabled)
    $('#fake_pass').show();

// On focus of the fake password field
    $('#fake_pass').focus(function(){
        $(this).hide(); //  hide the fake password input text
        $('#real_pass').show().removeClass().addClass('form-control').css('font-family','微软雅黑').focus(); // and show the real password input password
    });

// On blur of the real pass
    $('#real_pass').blur(function(){
        if($(this).val() == ""){ // if the value is empty,
            $(this).hide(); // hide the real password field
            $('#fake_pass').show().removeClass().addClass('form-control'); // show the fake password
        }
        // otherwise, a password has been entered,
        // so do nothing (leave the real password showing)
    });
});
