(function($) {
    $.fn.mScrollTop = function(options) {
        var scrollTop = this;
        var element = $(this);
        var Plugin = {
            run: function (options) {
                if (!element.data('scrollTop')) {                      
                    Plugin.init(options);
                    Plugin.build();
                    element.data('scrollTop', scrollTop);
                } else {
                    scrollTop = element.data('scrollTop');
                }               
                return scrollTop;
            },
            init: function(options) {
                scrollTop.element = element;    
                scrollTop.events = [];
                scrollTop.options = $.extend(true, {}, $.fn.mScrollTop.defaults, options);
            },
            build: function() {
                if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
                    $(window).bind("touchend touchcancel touchleave", function() {
                        Plugin.handle();
                    });
                } else {
                    $(window).scroll(function() {
                        Plugin.handle();
                    });
                }
                element.on('click', Plugin.scroll);
            },
            sync: function () {
                $(element).data('scrollTop', scrollTop);
            }, 
            handle: function() {
                var pos = $(window).scrollTop(); 
                if (pos > scrollTop.options.offset) {
                    $("body").addClass('m-scroll-top--shown');
                } else {
                    $("body").removeClass('m-scroll-top--shown');
                }
            },
            scroll: function(e) {
                e.preventDefault();
                $("html, body").animate({
                    scrollTop: 0
                }, scrollTop.options.speed);
            },
            eventTrigger: function(name) {
                for (i = 0; i < scrollTop.events.length; i++) {
                    var event = scrollTop.events[i];
                    if (event.name == name) {
                        if (event.one == true) {
                            if (event.fired == false) {
                                scrollTop.events[i].fired = true;
                                return event.handler.call(this, scrollTop);
                            }
                        } else {
                            return  event.handler.call(this, scrollTop);
                        }
                    }
                }
            },
            addEvent: function(name, handler, one) {
                scrollTop.events.push({
                    name: name,
                    handler: handler,
                    one: one,
                    fired: false
                });
                Plugin.sync();
            }
        };
        var the = this;
        Plugin.run.apply(this, [options]);
        scrollTop.on =  function (name, handler) {
            return Plugin.addEvent(name, handler);
        };
        scrollTop.one =  function (name, handler) {
            return Plugin.addEvent(name, handler, true);
        };   
        return scrollTop;
    };
    $.fn.mScrollTop.defaults = {
        offset: 300,
        speed: 600
    }; 
}(jQuery));
