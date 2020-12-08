(function($) {
    $.fn.mToggle = function(options) {
        var toggle = this;
        var element = $(this);
        var Plugin = {
            run: function (options) {
                if (!element.data('toggle')) {                      
                    Plugin.init(options);
                    Plugin.build();
                    element.data('toggle', toggle);
                } else {
                    toggle = element.data('toggle');
                }               
                return toggle;
            },
            init: function(options) {
                toggle.element = element;    
                toggle.events = [];
                toggle.options = $.extend(true, {}, $.fn.mToggle.defaults, options);
                toggle.target = $(toggle.options.target);
                toggle.targetState = toggle.options.targetState;
                toggle.togglerState = toggle.options.togglerState;
                toggle.state = mUtil.hasClasses(toggle.target, toggle.targetState) ? 'on' : 'off';
            },
            build: function() {
                element.on('click', Plugin.toggle);
            },
            sync: function () {
                $(element).data('toggle', toggle);
            }, 
            toggle: function() {
                if (toggle.state == 'off') {
                    Plugin.on();
                } else {
                    Plugin.off();
                }
            },
            on: function() {
                Plugin.eventTrigger('beforeOn');
                toggle.target.addClass(toggle.targetState);
                if (toggle.togglerState) {
                    element.addClass(toggle.togglerState);
                }
                toggle.state = 'on';
                Plugin.eventTrigger('afterOn');
                return toggle;
            },
            off: function() {
                Plugin.eventTrigger('beforeOff');
                toggle.target.removeClass(toggle.targetState);
                if (toggle.togglerState) {
                    element.removeClass(toggle.togglerState);
                }
                toggle.state = 'off';
                Plugin.eventTrigger('afterOff');
                return toggle;
            },
            eventTrigger: function(name) {
                for (i = 0; i < toggle.events.length; i++) {
                    var event = toggle.events[i];
                    if (event.name == name) {
                        if (event.one == true) {
                            if (event.fired == false) {
                                toggle.events[i].fired = true;
                                return event.handler.call(this, toggle);
                            }
                        } else {
                            return  event.handler.call(this, toggle);
                        }
                    }
                }
            },
            addEvent: function(name, handler, one) {
                toggle.events.push({
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
        toggle.on =  function (name, handler) {
            return Plugin.addEvent(name, handler);
        };
        toggle.one =  function (name, handler) {
            return Plugin.addEvent(name, handler, true);
        };   
        return toggle;
    };
    $.fn.mToggle.defaults = {
        togglerState: '',
        targetState: ''
    }; 
}(jQuery));
