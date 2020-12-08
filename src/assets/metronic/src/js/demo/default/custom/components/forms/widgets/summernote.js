var SummernoteDemo = function () {    
    var demos = function () {
        $('.summernote').summernote({
            height: 150, 
        });
    }
    return {
        init: function() {
            demos(); 
        }
    };
}();
jQuery(document).ready(function() {
    SummernoteDemo.init();
});
