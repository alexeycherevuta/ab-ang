(function ($) {
    $.fn.mMessenger = function (options) {
        var messenger = {};
        var element = $(this);
        var Plugin = {
            run: function (options) {
                if (!element.data('messenger')) {                      
                    Plugin.init(options);
                    Plugin.build();
                    Plugin.setup();
                    element.data('messenger', messenger);
                } else {
                    messenger = element.data('messenger');
                }               
                return messenger;
            },
            init: function(options) {
                messenger.events = [];
                messenger.scrollable = element.find('.m-messenger__scrollable');
                messenger.options = $.extend(true, {}, $.fn.mMessenger.defaults, options);
                if (messenger.scrollable.length > 0) {
                    if (messenger.scrollable.data('data-min-height')) {
                        messenger.options.minHeight = messenger.scrollable.data('data-min-height');
                    }
                    if (messenger.scrollable.data('data-max-height')) {
                        messenger.options.maxHeight = messenger.scrollable.data('data-max-height');
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
                for (i = 0; i < messenger.events.length; i++) {
                    var event = messenger.events[i];
                    if (event.name == name) {
                        if (event.one == true) {
                            if (event.fired == false) {
                                messenger.events[i].fired = true;
                                return event.handler.call(this, messenger);
                            }
                        } else {
                            return  event.handler.call(this, messenger);
                        }
                    }
                }
            },
            addEvent: function(name, handler, one) {
                messenger.events.push({
                    name: name,
                    handler: handler,
                    one: one,
                    fired: false
                });
                Plugin.sync();
            }
        };
        Plugin.run.apply(this, [options]);
        messenger.on =  function (name, handler) {
            return Plugin.addEvent(name, handler);
        };
        messenger.one =  function (name, handler) {
            return Plugin.addEvent(name, handler, true);
        };        
        return messenger;
    };
    $.fn.mMessenger.defaults = {
    };
}(jQuery));
