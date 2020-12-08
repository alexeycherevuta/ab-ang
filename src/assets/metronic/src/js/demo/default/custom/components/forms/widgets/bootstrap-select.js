var BootstrapSelect = function () {
    var demos = function () {
        $('.m_selectpicker').selectpicker();
    }
    return {
        init: function() {
            demos(); 
        }
    };
}();
jQuery(document).ready(function() {    
    BootstrapSelect.init();
});
