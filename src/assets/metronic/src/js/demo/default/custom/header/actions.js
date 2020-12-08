var ActionsDemo = function () {    
    return {
        init: function() {
            $('.summernote').summernote({
                height: 250, 
            });
        }
    };
}();
jQuery(document).ready(function() {
    ActionsDemo.init();
});
