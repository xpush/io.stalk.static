$(document).ready(function() {
	$('#contact-form').submit(function(event) {

		if (event.preventDefault) { event.preventDefault(); } else { event.returnValue = false; } 

		var contackServer = 'http://stalk.io:8000/message';
	
		var buttonWidth=$('#contact-form button').width();

		var buttonCopy = $('#contact-form button').html(),
			errorMessage = $('#contact-form button').data('error-message'),
			sendingMessage = $('#contact-form button').data('sending-message'),
			okMessage = $('#contact-form button').data('ok-message'),
			hasError = false;

		$('#contact-form button').width(buttonWidth);
		$('#contact-form .error-message').remove();

		$('.requiredField').each(function() {
			if($.trim($(this).val()) == '') {
				var errorText = $(this).data('error-empty');
				$(this).parent().append('<span class="error-message">'+errorText+'.</span>');
				$(this).addClass('inputError');
				hasError = true;
			} else if($(this).is("input[type='email']") || $(this).attr('name')==='email') {
				var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
				if(!emailReg.test($.trim($(this).val()))) {
					var invalidEmail = $(this).data('error-invalid');
					$(this).parent().append('<span class="error-message">'+invalidEmail+'.</span>');
					$(this).addClass('inputError');
					hasError = true;
				}
			}
		});

		if(hasError) {
			$('#contact-form button').html('<i class="icon-remove"></i>'+errorMessage);
			setTimeout(function(){
				$('#contact-form button').html(buttonCopy);
				$('#contact-form button').width('auto');
			},2000);
		}
		else {
			$('#contact-form button').html('<i class="icon-refresh icon-spin"></i>'+sendingMessage);

			var formInput = $(this).serialize();
			jQuery.support.cors = true;
                        $.ajax({
                          url: contackServer,
                          data : formInput,
                          cache: false,
			  dataType: ($.browser.msie) ? "html" : "json",
                          success: function(data) {

				$('#contact-form button').html('<i class="icon-ok"></i>'+okMessage);
                                setTimeout(function(){
                                        $('#contact-form button').html(buttonCopy);
                                        $('#contact-form button').width('auto');
                                },3000);
                                $('#contact-form #contact-message').val('');
                                $('#contact-form #contact-mail').val('');
                                $('#contact-form #contact-name').val('');

                          },
			  error: function(a, b, c) {
				$('#contact-form button').html('<i class="icon-remove"></i>'+b+'! '+c);
				setTimeout(function(){
					$('#contact-form button').html(buttonCopy);
					$('#contact-form button').width('auto');
				},2000);
			  },
                          type : 'POST' 
                        }); 
		}
	});
});
