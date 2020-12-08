var BootstrapSwitch = function () {
    var demos = function () {
        $('[data-switch=true]').bootstrapSwitch();
    }
    return {
        init: function() {
            demos(); 
        }
    };
}();
jQuery(document).ready(function() {    
    BootstrapSwitch.init();
});
