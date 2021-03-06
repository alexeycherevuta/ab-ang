(function ($) {
    $.fn.mPortlet = function (options) {
        var portlet = {};
        var element = $(this);
        var Plugin = {
            run: function (options) {
                if (element.data('portlet-object')) {            
                    portlet = element.data('portlet-object');
                } else {                              
                    Plugin.init(options);
                    Plugin.build();
                    element.data('portlet-object', portlet);
                }               
                return portlet;
            },
            init: function(options) {
                portlet.options = $.extend(true, {}, $.fn.mPortlet.defaults, options);
                portlet.events = [];
                portlet.eventOne = false;       
                if ( element.find('> .m-portlet__body').length !== 0 ) {
                    portlet.body = element.find('> .m-portlet__body');
                } else if ( element.find('> .m-form').length !== 0 ) {
                    portlet.body = element.find('> .m-form');
                }
            },
            build: function () {
                var remove = element.find('> .m-portlet__head [data-portlet-tool=remove]');
                if (remove.length === 1) {
                    remove.click(function(e) {
                        e.preventDefault();
                        Plugin.remove();
                    });
                }                 
                var reload = element.find('> .m-portlet__head [data-portlet-tool=reload]')
                if (reload.length === 1) {
                    reload.click(function(e) {
                        e.preventDefault();
                        Plugin.reload();
                    });
                }
                var toggle = element.find('> .m-portlet__head [data-portlet-tool=toggle]');
                if (toggle.length === 1) {
                    toggle.click(function(e) {
                        e.preventDefault();
                        Plugin.toggle();
                    });
                }
                var fullscreen = element.find('> .m-portlet__head [data-portlet-tool=fullscreen]');
                if (fullscreen.length === 1) {
                    fullscreen.click(function(e) {
                        e.preventDefault();
                        Plugin.fullscreen();
                    });
                }                    
                Plugin.setupTooltips();
            }, 
            remove: function () {
                if (Plugin.eventTrigger('beforeRemove') === false) {
                    return;
                }
                if ( $('body').hasClass('m-portlet--fullscreen') && element.hasClass('m-portlet--fullscreen') ) {
                    Plugin.fullscreen('off');
                }
                Plugin.removeTooltips();
                element.remove();
                Plugin.eventTrigger('afterRemove');
            }, 
            setContent: function (html) {
                if (html) {
                    portlet.body.html(html);
                }               
            },
            getBody: function () {
                return portlet.body;
            },
            getSelf: function () {
                return element;
            },
            setupTooltips: function () {
                if (portlet.options.tooltips) {
                    var collapsed = element.hasClass('collapsed');
                    var fullscreenOn = $('body').hasClass('m-portlet--fullscreen') && element.hasClass('m-portlet--fullscreen');
                    var remove = element.find('> .m-portlet__head [data-portlet-tool=remove]');
                    if (remove.length === 1) {
                        remove.attr('title', portlet.options.tools.remove);
                        remove.data('placement', fullscreenOn ? 'bottom' : 'top');
                        remove.data('offset', fullscreenOn ? '0,10px,0,0' : '0,5px');
                        remove.tooltip('dispose');
                        mApp.initTooltip(remove);
                    }
                    var reload = element.find('> .m-portlet__head [data-portlet-tool=reload]');
                    if (reload.length === 1) {
                        reload.attr('title', portlet.options.tools.reload);
                        reload.data('placement', fullscreenOn ? 'bottom' : 'top');
                        reload.data('offset', fullscreenOn ? '0,10px,0,0' : '0,5px');
                        reload.tooltip('dispose');
                        mApp.initTooltip(reload);
                    }
                    var toggle = element.find('> .m-portlet__head [data-portlet-tool=toggle]');
                    if (toggle.length === 1) {
                        if (collapsed) {
                            toggle.attr('title', portlet.options.tools.toggle.expand);
                        } else {
                            toggle.attr('title', portlet.options.tools.toggle.collapse);
                        }
                        toggle.data('placement', fullscreenOn ? 'bottom' : 'top');
                        toggle.data('offset', fullscreenOn ? '0,10px,0,0' : '0,5px');
                        toggle.tooltip('dispose');
                        mApp.initTooltip(toggle);
                    }
                    var fullscreen = element.find('> .m-portlet__head [data-portlet-tool=fullscreen]');
                    if (fullscreen.length === 1) {
                        if (fullscreenOn) {
                            fullscreen.attr('title', portlet.options.tools.fullscreen.off);
                        } else {
                            fullscreen.attr('title', portlet.options.tools.fullscreen.on);
                        }
                        fullscreen.data('placement', fullscreenOn ? 'bottom' : 'top');
                        fullscreen.data('offset', fullscreenOn ? '0,10px,0,0' : '0,5px');
                        fullscreen.tooltip('dispose');
                        mApp.initTooltip(fullscreen);
                    }                
                }                   
            },
            removeTooltips: function () {
                if (portlet.options.tooltips) {
                    var remove = element.find('> .m-portlet__head [data-portlet-tool=remove]');
                    if (remove.length === 1) {
                        remove.tooltip('dispose');
                    }
                    var reload = element.find('> .m-portlet__head [data-portlet-tool=reload]');
                    if (reload.length === 1) {
                        reload.tooltip('dispose');
                    }
                    var toggle = element.find('> .m-portlet__head [data-portlet-tool=toggle]');
                    if (toggle.length === 1) {
                        toggle.tooltip('dispose');
                    }
                    var fullscreen = element.find('> .m-portlet__head [data-portlet-tool=fullscreen]');
                    if (fullscreen.length === 1) {
                        fullscreen.tooltip('dispose');
                    }                
                }                   
            },
            reload: function () {
                Plugin.eventTrigger('reload');                
            },
            toggle: function (mode) {
                if (mode === 'collapse' || element.hasClass('m-portlet--collapse') || element.hasClass('m-portlet--collapsed')) {
                    if (Plugin.eventTrigger('beforeExpand') === false) {
                        return;
                    } 
                    element.removeClass('m-portlet--collapse');
                    element.removeClass('m-portlet--collapsed');
                    Plugin.setupTooltips();
                    portlet.body.slideDown(portlet.options.bodyToggleSpeed, function(){                        
                        Plugin.eventTrigger('afterExpand');                         
                    });
                } else {
                    if (Plugin.eventTrigger('beforeCollapse') === false) {
                        return;
                    } 
                    element.addClass('m-portlet--collapse');
                    Plugin.setupTooltips();
                    portlet.body.slideUp(portlet.options.bodyToggleSpeed, function() {                        
                        Plugin.eventTrigger('afterCollapse');    
                    });
                }                  
            },
            fullscreen: function (mode) {
                var d = {};
                var speed = 300;
                if (mode === 'off' || ($('body').hasClass('m-portlet--fullscreen') && element.hasClass('m-portlet--fullscreen'))) {
                    Plugin.eventTrigger('beforeFullscreenOff');
                    $('body').removeClass('m-portlet--fullscreen');
                    element.removeClass('m-portlet--fullscreen');
                    Plugin.setupTooltips();
                    Plugin.eventTrigger('afterFullscreenOff');
                } else {
                    Plugin.eventTrigger('beforeFullscreenOn');
                    element.addClass('m-portlet--fullscreen');
                    $('body').addClass('m-portlet--fullscreen');
                    Plugin.setupTooltips();
                    Plugin.eventTrigger('afterFullscreenOn');
                }                  
            }, 
            sync: function () {
                $(element).data('portlet', portlet);
            },
            eventTrigger: function(name) {
                for (i = 0; i < portlet.events.length; i++) {
                    var event = portlet.events[i];
                    if (event.name == name) {
                        if (event.one == true) {
                            if (event.fired == false) {
                                portlet.events[i].fired = true;
                                return event.handler.call(this, portlet);
                            }
                        } else {
                            return  event.handler.call(this, portlet);
                        }
                    }
                }
            },
            addEvent: function(name, handler, one) {
                portlet.events.push({
                    name: name,
                    handler: handler,
                    one: one,
                    fired: false
                });
                Plugin.sync();
                return portlet;
            }
        };
        Plugin.run.apply(this, [options]);
        portlet.remove = function () {
            return Plugin.remove(html);
        };
        portlet.reload = function () {
            return Plugin.reload();
        };
        portlet.setContent = function (html) {
            return Plugin.setContent(html);
        };
        portlet.collapse = function () {
            return Plugin.toggle('collapse');
        };
        portlet.expand = function () {
            return Plugin.toggle('expand');
        };
        portlet.fullscreen = function () {
            return Plugin.fullscreen('on');
        };
        portlet.unFullscreen = function () {
            return Plugin.fullscreen('off');
        };
        portlet.getBody = function () {
            return Plugin.getBody();
        };
        portlet.getSelf = function () {
            return Plugin.getSelf();
        };
        portlet.on =  function (name, handler) {
            return Plugin.addEvent(name, handler);
        };
        portlet.one =  function (name, handler) {
            return Plugin.addEvent(name, handler, true);
        };        
        return portlet;
    };
    $.fn.mPortlet.defaults = {
        bodyToggleSpeed: 400,
        tooltips: true,
        tools: {
            toggle: {
                collapse: 'Collapse', 
                expand: 'Expand'
            },
            reload: 'Reload',
            remove: 'Remove',
            fullscreen: {
                on: 'Fullscreen',
                off: 'Exit Fullscreen'
            }        
        }
    };
}(jQuery));
