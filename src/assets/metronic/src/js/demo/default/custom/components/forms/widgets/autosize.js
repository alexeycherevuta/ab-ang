var Autosize = function () {
    var demos = function () {
        var demo1 = $('#m_autosize_1');
        var demo2 = $('#m_autosize_2');
        autosize(demo1);
        autosize(demo2);
        autosize.update(demo2);
    }
    return {
        init: function() {
            demos(); 
        }
    };
}();
jQuery(document).ready(function() {    
    Autosize.init();
});
