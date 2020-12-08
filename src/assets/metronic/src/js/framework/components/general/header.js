(function($) {
    $.fn.mHeader = function(options) {
        var header = this;
        var element = $(this);
        var Plugin = {
            run: function(options) { 
                if (element.data('header')) {
                    header = element.data('header');                
                } else {
                    Plugin.init(options);
                    Plugin.reset();
                    Plugin.build();
                    element.data('header', header);
                } 
                return header;
            },
            init: function(options) {                
                header.options = $.extend(true, {}, $.fn.mHeader.defaults, options);
            },
            build: function() {
                Plugin.toggle();                   
            },
            toggle: function() {
                var lastScrollTop = 0;
                if (header.options.minimize.mobile === false && header.options.minimize.desktop === false) {
                    return;
                }          
                $(window).scroll(function() {
                    var offset = 0;
                    if (mUtil.isInResponsiveRange('desktop')) {
                        offset = header.options.offset.desktop;
                        on = header.options.minimize.desktop.on;
                        off = header.options.minimize.desktop.off;
                    } else if (mUtil.isInResponsiveRange('tablet-and-mobile')) {
                        offset = header.options.offset.mobile;
                        on = header.options.minimize.mobile.on;
                        off = header.options.minimize.mobile.off;
                    }
                    var st = $(this).scrollTop();
                    if (header.options.classic) {
                        if (st > offset){ 
                            $("body").addClass(on);
                            $("body").removeClass(off);
                        } else { 
                            $("body").addClass(off);
                            $("body").removeClass(on);
                        }
                    } else {
                        if (st > offset && lastScrollTop < st){ 
                            $("body").addClass(on);
                            $("body").removeClass(off);
                        } else { 
                            $("body").addClass(off);
                            $("body").removeClass(on);
                        }
                        lastScrollTop = st;
                    }
                });
            },
            reset: function() {
            }
        };
        Plugin.run.apply(header, [options]);
        header.publicMethod = function() {
        };
        return header;
    };
    $.fn.mHeader.defaults = {
        classic: false,
        offset: {
            mobile: 150,
            desktop: 200        
        },
        minimize: {
            mobile: false,
            desktop: false
        }
    }; 
}(jQuery));
