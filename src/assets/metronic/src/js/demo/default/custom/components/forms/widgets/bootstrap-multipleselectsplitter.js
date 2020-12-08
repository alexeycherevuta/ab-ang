var BootstrapMultipleSelectsplitter = function () {
    var demos = function () {
        $('#m_multipleselectsplitter_1, #m_multipleselectsplitter_2').multiselectsplitter();
    }
    return {
        init: function() {
            demos(); 
        }
    };
}();
jQuery(document).ready(function() {    
    BootstrapMultipleSelectsplitter.init();
});
