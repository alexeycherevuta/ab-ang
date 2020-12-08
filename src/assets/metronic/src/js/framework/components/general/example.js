(function ($) {
    $.fn.mExample = function (options) {
        var example = {};
        var element = $(this);
        var Plugin = {
            run: function (options) {
                if (!element.data('example')) {                      
                    Plugin.init(options);
                    Plugin.build();
                    Plugin.setup();
                    element.data('example', example);
                } else {
                    example = element.data('example');
                }               
                return example;
            },
            init: function(options) {
                example.events = [];
                example.scrollable = element.find('.m-example__scrollable');
                example.options = $.extend(true, {}, $.fn.mExample.defaults, options);
                if (example.scrollable.length > 0) {
                    if (example.scrollable.data('data-min-height')) {
                        example.options.minHeight = example.scrollable.data('data-min-height');
                    }
                    if (example.scrollable.data('data-max-height')) {
                        example.options.maxHeight = example.scrollable.data('data-max-height');
                    }
                }                
            },
            build: function () {
                if (mUtil.isMobileDevice()) {
                } else {
                }                
            }, 
            setup: function () {
            },
            eventTrigger: function(name) {
                for (i = 0; i < example.events.length; i++) {
                    var event = example.events[i];
                    if (event.name == name) {
                        if (event.one == true) {
                            if (event.fired == false) {
                                example.events[i].fired = true;
                                return event.handler.call(this, example);
                            }
                        } else {
                            return  event.handler.call(this, example);
                        }
                    }
                }
            },
            addEvent: function(name, handler, one) {
                example.events.push({
                    name: name,
                    handler: handler,
                    one: one,
                    fired: false
                });
                Plugin.sync();
            }
        };
        Plugin.run.apply(this, [options]);
        example.on =  function (name, handler) {
            return Plugin.addEvent(name, handler);
        };
        example.one =  function (name, handler) {
            return Plugin.addEvent(name, handler, true);
        };        
        return example;
    };
    $.fn.mExample.defaults = {
    };
}(jQuery));
