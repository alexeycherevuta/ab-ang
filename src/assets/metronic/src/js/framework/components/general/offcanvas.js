(function($) {
    $.fn.mOffcanvas = function(options) {
        var offcanvas = this;
        var element = $(this);
        var Plugin = {
            run: function (options) {
                if (!element.data('offcanvas')) {                      
                    Plugin.init(options);
                    Plugin.build();
                    element.data('offcanvas', offcanvas);
                } else {
                    offcanvas = element.data('offcanvas');
                }               
                return offcanvas;
            },
            init: function(options) {
                offcanvas.events = [];
                offcanvas.options = $.extend(true, {}, $.fn.mOffcanvas.defaults, options);
                offcanvas.overlay;
                offcanvas.classBase = offcanvas.options.class;
                offcanvas.classShown = offcanvas.classBase + '--on';
                offcanvas.classOverlay = offcanvas.classBase + '-overlay';
                offcanvas.state = element.hasClass(offcanvas.classShown) ? 'shown' : 'hidden';
                offcanvas.close = offcanvas.options.close;
                if (offcanvas.options.toggle && offcanvas.options.toggle.target) {
                    offcanvas.toggleTarget = offcanvas.options.toggle.target;
                    offcanvas.toggleState = offcanvas.options.toggle.state;
                } else {
                    offcanvas.toggleTarget = offcanvas.options.toggle; 
                    offcanvas.toggleState = '';
                }
            },
            build: function() {
                $(offcanvas.toggleTarget).on('click', Plugin.toggle);
                if (offcanvas.close) {
                    $(offcanvas.close).on('click', Plugin.hide);
                }
            },
            sync: function () {
                $(element).data('offcanvas', offcanvas);
            }, 
            toggle: function() {
                if (offcanvas.state == 'shown') {
                    Plugin.hide();
                } else {
                    Plugin.show();
                }
            },
            show: function() {
                if (offcanvas.state == 'shown') {
                    return;
                }
                Plugin.eventTrigger('beforeShow');
                if (offcanvas.toggleState != '') {
                    $(offcanvas.toggleTarget).addClass(offcanvas.toggleState);
                }
                $('body').addClass(offcanvas.classShown);
                element.addClass(offcanvas.classShown);
                offcanvas.state = 'shown';
                if (offcanvas.options.overlay) {
                    var overlay = $('<div class="' + offcanvas.classOverlay + '"></div>');                
                    element.after(overlay);
                    offcanvas.overlay = overlay;
                    offcanvas.overlay.on('click', function(e) {
                        e.stopPropagation();
                        e.preventDefault();
                        Plugin.hide();
                    });
                } 
                Plugin.eventTrigger('afterShow');
                return offcanvas;
            },
            hide: function() {
                if (offcanvas.state == 'hidden') {
                    return;
                }
                Plugin.eventTrigger('beforeHide');
                if (offcanvas.toggleState != '') {
                    $(offcanvas.toggleTarget).removeClass(offcanvas.toggleState);
                }
                $('body').removeClass(offcanvas.classShown)
                element.removeClass(offcanvas.classShown);
                offcanvas.state = 'hidden';
                if (offcanvas.options.overlay) {
                    offcanvas.overlay.remove();
                } 
                Plugin.eventTrigger('afterHide');
                return offcanvas;
            },
            eventTrigger: function(name) {
                for (i = 0; i < offcanvas.events.length; i++) {
                    var event = offcanvas.events[i];
                    if (event.name == name) {
                        if (event.one == true) {
                            if (event.fired == false) {
                                offcanvas.events[i].fired = true;
                                return event.handler.call(this, offcanvas);
                            }
                        } else {
                            return  event.handler.call(this, offcanvas);
                        }
                    }
                }
            },
            addEvent: function(name, handler, one) {
                offcanvas.events.push({
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
        offcanvas.hide =  function () {
            return Plugin.hide();
        };
        offcanvas.show =  function () {
            return Plugin.show();
        };
        offcanvas.on =  function (name, handler) {
            return Plugin.addEvent(name, handler);
        };
        offcanvas.one =  function (name, handler) {
            return Plugin.addEvent(name, handler, true);
        };   
        return offcanvas;
    };
    $.fn.mOffcanvas.defaults = {
    }; 
}(jQuery));
