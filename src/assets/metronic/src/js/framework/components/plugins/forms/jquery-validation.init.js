jQuery.validator.setDefaults({
	errorElement: 'div', 
    errorClass: 'form-control-feedback', 
    focusInvalid: false, 
    ignore: "",  
    errorPlacement: function(error, element) { 
    	var group = $(element).closest('.form-group');
        var help = group.find('.m-form__help');
        if (help.length > 0) {
            help.before(error); 
        } else {
            $(element).after(error);
        }
    },
    highlight: function(element) { 
    	$(element).closest('.form-group').addClass('has-danger'); 
        if ($(element).hasClass('form-control')) {
        }
    },
    unhighlight: function(element) { 
        $(element).closest('.form-group').removeClass('has-danger'); 
    },
    success: function(label, element) {
    	$(label).closest('.form-group').addClass('has-success').removeClass('has-danger'); 
        $(label).closest('.form-group').find('.form-control-feedback').remove();
    }
});
