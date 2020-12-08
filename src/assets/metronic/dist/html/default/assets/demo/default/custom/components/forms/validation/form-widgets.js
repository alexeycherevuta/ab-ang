var FormWidgets = function () {
    var validator;
    var initWidgets = function() {
        $('#m_datepicker').datepicker({
            todayHighlight: true,
            templates: {
                leftArrow: '<i class="la la-angle-left"></i>',
                rightArrow: '<i class="la la-angle-right"></i>'
            }
        });
        $('#m_datetimepicker').datetimepicker({
            pickerPosition: 'bottom-left',
            todayHighlight: true,
            autoclose: true,
            format: 'yyyy.mm.dd hh:ii'
        });
        $('#m_timepicker').timepicker({
            minuteStep: 1,
            showSeconds: true,
            showMeridian: true
        });
        $('#m_daterangepicker').daterangepicker({
            buttonClasses: 'm-btn btn',
            applyClass: 'btn-primary',
            cancelClass: 'btn-secondary'
        }, function(start, end, label) {
            var input = $('#m_daterangepicker').find('.form-control');
            input.val( start.format('YYYY/MM/DD') + ' / ' + end.format('YYYY/MM/DD'));
            validator.element(input); 
        });
        $('[data-switch=true]').bootstrapSwitch();
        $('[data-switch=true]').on('switchChange.bootstrapSwitch', function() {
            validator.element($(this)); 
        });
        $('#m_bootstrap_select').selectpicker();
        $('#m_bootstrap_select').on('changed.bs.select', function() {
            validator.element($(this)); 
        });
        $('#m_select2').select2({
            placeholder: "Select a state",
        });
        $('#m_select2').on('select2:change', function(){
            validator.element($(this)); 
        });
        var countries = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.whitespace,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: 'http:
        });
        $('#m_typeahead').typeahead(null, {
            name: 'countries',
            source: countries
        });
        $('#m_typeahead').bind('typeahead:select', function(ev, suggestion) {
            validator.element($('#m_typeahead')); 
        });
        $('#m_summernote').summernote({
            height: 150, 
        });
    }
    var initValidation = function () {
        validator = $( "#m_form_1" ).validate({
            rules: {
                date: {
                    required: true,
                    date: true 
                },
                daterange: {
                    required: true
                },
                datetime: {
                    required: true
                },
                time: {
                    required: true
                },
                select: {
                    required: true,
                    minlength: 2,
                    maxlength: 4
                },
                select2: {
                    required: true
                },
                typeahead: {
                    required: true
                },
                switch: {
                    required: true
                },
                summernote: {
                    required: true
                },
                markdown: {
                    required: true
                }
            },
            invalidHandler: function(event, validator) {             
                var alert = $('#m_form_1_msg');
                alert.removeClass('m--hide').show();
                mApp.scrollTo(alert, -200);
            },
            submitHandler: function (form) {
            }
        });       
    }
    return {
        init: function() {
            initWidgets(); 
            initValidation();
        }
    };
}();
jQuery(document).ready(function() {    
    FormWidgets.init();
});
