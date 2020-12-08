var BootstrapTimepicker = function () {
    var demos = function () {
        $('#m_timepicker_1, #m_timepicker_1_modal').timepicker();
        $('#m_timepicker_2, #m_timepicker_2_modal').timepicker({
            minuteStep: 1,
            showSeconds: true,
            showMeridian: false,
            snapToStep: true
        });
        $('#m_timepicker_3, #m_timepicker_3_modal').timepicker({
            defaultTime: '11:45:20 AM',
            minuteStep: 1,
            showSeconds: true,
            showMeridian: true
        });
        $('#m_timepicker_4, #m_timepicker_4_modal').timepicker({
            defaultTime: '10:30:20 AM',           
            minuteStep: 1,
            showSeconds: true,
            showMeridian: true
        });
        $('#m_timepicker_1_validate, #m_timepicker_2_validate, #m_timepicker_3_validate').timepicker({
            minuteStep: 1,
            showSeconds: true,
            showMeridian: false,
            snapToStep: true
        });
    }
    return {
        init: function() {
            demos(); 
        }
    };
}();
jQuery(document).ready(function() {    
    BootstrapTimepicker.init();
});
