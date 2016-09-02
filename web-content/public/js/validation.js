$(document).ready(function () {

    // Create variables for the form, any text boxes and submit buttons
    var form = $('form[name="filter"]');
    var $submit = $('input[type="submit"]');
    var $text = $('input[type="text"]');

    // If a filter has been used, disable the text boxes and change button text
    if ($text.val() != '') {
        $submit.attr('value', 'Remove Filter');
        $text.prop('disabled', true);
    }

    // Handlers for events for the text boxes
    $text.on({
        keyup: function () {
            validation($(this), $submit)
        },

        blur: function () {
            validation($(this), $submit)
        }
    });
});

// Validation function, checks values entered conform with field size as specified in the html, 
// and ensuring only alpha numeric characters are used with the exeption of forward slash
function validation($obj, $submit) {

    // Create variables
    var str = $obj.val();
    var length = $obj.attr('size');

    // Check string length
    if (str.length > length) {
        onError($obj, $submit, 'Must be below ' + length + ' characters'); // Set error classes
    } else if (/[^\w\-\/]/.test(str)) { // Check for any unwanted characters
        onError($obj, $submit, 'Contains invalid characters'); // Set error classes
    } else {
        $obj.removeClass('error')
        if (!$('input[type="text"]').hasClass('error')) { // If data entered is okay remove error classes
            $('.status').text('');
            $('.status').css({ 'display': 'none' });
            $submit.prop('disabled', false); // Re-enable submit
        }
    }
}

function onError($obj, $submit, message) { 
    $obj.addClass('error');
    $('.status').text(message);
    $('.status').css({ 'display' : 'block' });
    $submit.prop('disabled', true);
}
