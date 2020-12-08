(function($) {
    $.fn.mQuicksearch = function(options) {
        var qs = this;
        var element = $(this);
        var Plugin = {
            run: function(options) {
                if (!element.data('qs')) {
                    Plugin.init(options);
                    Plugin.build();                   
                    element.data('qs', qs);
                } else {
                    qs = element.data('qs'); 
                }
                return qs;
            },
            init: function(options) {
                qs.options = $.extend(true, {}, $.fn.mQuicksearch.defaults, options);
                qs.form = element.find('form');
                qs.input = $(qs.options.input);
                qs.iconClose = $(qs.options.iconClose);
                if (qs.options.type == 'default') {
                    qs.iconSearch = $(qs.options.iconSearch);
                    qs.iconCancel = $(qs.options.iconCancel);
                }               
                qs.dropdown = element.mDropdown({mobileOverlay: false});
                qs.cancelTimeout;
                qs.processing = false;
            }, 
            build: function() {
                qs.input.keyup(Plugin.handleSearch);
                if (qs.options.type == 'default') {
                    qs.input.focus(Plugin.showDropdown);
                    qs.iconCancel.click(Plugin.handleCancel);
                    qs.iconSearch.click(function() {
                        if (mUtil.isInResponsiveRange('tablet-and-mobile')) {
                            $('body').addClass('m-header-search--mobile-expanded');
                            qs.input.focus();
                        }
                    });
                    qs.iconClose.click(function() {
                        if (mUtil.isInResponsiveRange('tablet-and-mobile')) {
                            $('body').removeClass('m-header-search--mobile-expanded');
                            Plugin.closeDropdown();
                        }
                    });
                } else if (qs.options.type == 'dropdown') {
                    qs.dropdown.on('afterShow', function() {
                        qs.input.focus();
                    });
                    qs.iconClose.click(Plugin.closeDropdown);
                }               
            },
            handleSearch: function(e) { 
                var query = qs.input.val();
                if (query.length === 0) {
                    qs.dropdown.hide();
                    Plugin.handleCancelIconVisibility('on');
                    Plugin.closeDropdown();
                    element.removeClass(qs.options.hasResultClass);
                }
                if (query.length < qs.options.minLength || qs.processing == true) {
                    return;
                }
                qs.processing = true;
                qs.form.addClass(qs.options.spinner);
                Plugin.handleCancelIconVisibility('off');
                $.ajax({
                    url: qs.options.source,
                    data: {query: query},
                    dataType: 'html',
                    success: function(res) {
                        qs.processing = false;
                        qs.form.removeClass(qs.options.spinner);
                        Plugin.handleCancelIconVisibility('on');
                        qs.dropdown.setContent(res).show();
                        element.addClass(qs.options.hasResultClass);    
                    },
                    error: function(res) {
                        qs.processing = false;
                        qs.form.removeClass(qs.options.spinner);
                        Plugin.handleCancelIconVisibility('on');
                        qs.dropdown.setContent(qs.options.templates.error.apply(qs, res)).show();  
                        element.addClass(qs.options.hasResultClass);   
                    }
                });
            }, 
            handleCancelIconVisibility: function(status) {
                if (qs.options.type == 'dropdown') {
                    return;
                }
                if (status == 'on') {
                    if (qs.input.val().length === 0) {                       
                        qs.iconCancel.css('visibility', 'hidden');
                        qs.iconClose.css('visibility', 'hidden');
                    } else {
                        clearTimeout(qs.cancelTimeout);
                        qs.cancelTimeout = setTimeout(function() {
                            qs.iconCancel.css('visibility', 'visible');
                            qs.iconClose.css('visibility', 'visible');
                        }, 500);                        
                    }
                } else {
                    qs.iconCancel.css('visibility', 'hidden');
                    qs.iconClose.css('visibility', 'hidden');
                }
            },
            handleCancel: function(e) {
                qs.input.val('');
                qs.iconCancel.css('visibility', 'hidden');
                element.removeClass(qs.options.hasResultClass);   
                Plugin.closeDropdown();
            },
            closeDropdown: function() {
                qs.dropdown.hide();
            },
            showDropdown: function(e) { 
                if (qs.dropdown.isShown() == false && qs.input.val().length > qs.options.minLength && qs.processing == false) {
                    qs.dropdown.show();
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        };
        Plugin.run.apply(qs, [options]);
        qs.test = function(time) {
        };
        return qs;
    };
    $.fn.mQuicksearch.defaults = {
    	minLength: 1,
        maxHeight: 300,
    };
}(jQuery));
