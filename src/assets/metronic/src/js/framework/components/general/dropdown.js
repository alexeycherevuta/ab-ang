(function ($) {
    $.fn.mDropdown = function (options) {
        var dropdown = {};
        var element = $(this);
        var Plugin = {
            run: function (options) {
                if (!element.data('dropdown')) {                      
                    Plugin.init(options);
                    Plugin.build();
                    Plugin.setup();
                    element.data('dropdown', dropdown);
                } else {
                    dropdown = element.data('dropdown');
                }               
                return dropdown;
            },
            init: function(options) {
                dropdown.events = [];
                dropdown.eventOne = false;
                dropdown.close = element.find('.m-dropdown__close');
                dropdown.toggle = element.find('.m-dropdown__toggle');
                dropdown.arrow = element.find('.m-dropdown__arrow');
                dropdown.wrapper = element.find('.m-dropdown__wrapper');
                dropdown.scrollable = element.find('.m-dropdown__scrollable');
                dropdown.defaultDropPos = element.hasClass('m-dropdown--up') ? 'up' : 'down';
                dropdown.currentDropPos = dropdown.defaultDropPos;
                dropdown.options = $.extend(true, {}, $.fn.mDropdown.defaults, options);
                if (element.data('drop-auto') === true) {
                    dropdown.options.dropAuto = true;
                } else if (element.data('drop-auto') === false) {
                    dropdown.options.dropAuto = false;
                }               
                if (dropdown.scrollable.length > 0) {
                    if (dropdown.scrollable.data('min-height')) {
                        dropdown.options.minHeight = dropdown.scrollable.data('min-height');
                    }
                    if (dropdown.scrollable.data('max-height')) {
                        dropdown.options.maxHeight = dropdown.scrollable.data('max-height');
                    }
                }                
            },
            build: function () {
                if (mUtil.isMobileDevice()) {
                    if (element.data('dropdown-toggle') == 'hover' || element.data('dropdown-toggle') == 'click') { 
                        dropdown.options.toggle = 'click';
                    } else {
                        dropdown.options.toggle = 'click'; 
                        dropdown.toggle.click(Plugin.toggle); 
                    }
                } else {
                    if (element.data('dropdown-toggle') == 'hover') {     
                        dropdown.options.toggle = 'hover';              
                        element.mouseleave(Plugin.hide);
                    } else if(element.data('dropdown-toggle') == 'click') {
                        dropdown.options.toggle = 'click';                  
                    } else {
                        if (dropdown.options.toggle == 'hover') {
                            element.mouseenter(Plugin.show);
                            element.mouseleave(Plugin.hide);
                        } else {
                            dropdown.toggle.click(Plugin.toggle);      
                        }
                    }
                }                
                if (dropdown.close.length) {
                    dropdown.close.on('click', Plugin.hide);
                }
                Plugin.disableClose();
            }, 
            setup: function () {
                if (dropdown.options.placement) {
                    element.addClass('m-dropdown--' + dropdown.options.placement);
                }
                if (dropdown.options.align) {
                    element.addClass('m-dropdown--align-' + dropdown.options.align);
                } 
                if (dropdown.options.width) {
                    dropdown.wrapper.css('width', dropdown.options.width);
                }
                if (element.data('dropdown-persistent')) {
                    dropdown.options.persistent = true;
                }
                if (dropdown.options.minHeight) {
                    dropdown.scrollable.css('min-height', dropdown.options.minHeight);                    
                } 
                if (dropdown.options.maxHeight) {
                    dropdown.scrollable.css('max-height', dropdown.options.maxHeight);     
                    dropdown.scrollable.css('overflow-y', 'auto'); 
                    if (mUtil.isDesktopDevice()) {
                        mApp.initScroller(dropdown.scrollable, {});                
                    }   
                }      
                Plugin.setZindex();
            },
            sync: function () {
                $(element).data('dropdown', dropdown);
            }, 
            disableClose: function () {
                element.on('click', '.m-dropdown--disable-close, .mCSB_1_scrollbar', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                });
            },
            toggle: function () {
                if (dropdown.open) {
                    return Plugin.hide();
                } else {
                    return Plugin.show();
                }
            },
            setContent: function (content) {
                element.find('.m-dropdown__content').html(content);
                return dropdown;
            },
            show: function() {
                if (dropdown.options.toggle == 'hover' && element.data('hover')) {
                    Plugin.clearHovered(); 
                    return dropdown;
                }
                if (dropdown.open) {
                    return dropdown;
                }
                if (dropdown.arrow.length > 0) {
                    Plugin.adjustArrowPos();
                }
                Plugin.eventTrigger('beforeShow'); 
                Plugin.hideOpened();
                element.addClass('m-dropdown--open');
                if (mUtil.isMobileDevice() && dropdown.options.mobileOverlay) {
                    var zIndex = dropdown.wrapper.css('zIndex') - 1;
                    var dropdownoff = $('<div class="m-dropdown__dropoff"></div>');
                    dropdownoff.css('zIndex', zIndex);
                    dropdownoff.data('dropdown', element);
                    element.data('dropoff', dropdownoff);
                    element.after(dropdownoff);
                    dropdownoff.click(function(e) {
                        Plugin.hide();
                        $(this).remove();                    
                        e.preventDefault();
                    });
                } 
                element.focus();
                element.attr('aria-expanded', 'true');
                dropdown.open = true;
                Plugin.handleDropPosition();          
                Plugin.eventTrigger('afterShow');
                return dropdown;
            },
            clearHovered: function () {
                element.removeData('hover');
                var timeout = element.data('timeout');
                element.removeData('timeout');
                clearTimeout(timeout);
            },
            hideHovered: function(force) {
                if (force) {
                    if (Plugin.eventTrigger('beforeHide') === false) {
                        return;
                    }  
                    Plugin.clearHovered();        
                    element.removeClass('m-dropdown--open');
                    dropdown.open = false;
                    Plugin.eventTrigger('afterHide');
                } else {
                    if (Plugin.eventTrigger('beforeHide') === false) {
                        return;
                    }
                    var timeout = setTimeout(function() {
                        if (element.data('hover')) {
                            Plugin.clearHovered();        
                            element.removeClass('m-dropdown--open');
                            dropdown.open = false;
                            Plugin.eventTrigger('afterHide');
                        }
                    }, dropdown.options.hoverTimeout);
                    element.data('hover', true);
                    element.data('timeout', timeout); 
                }     
            },
            hideClicked: function() {    
                if (Plugin.eventTrigger('beforeHide') === false) {
                    return;
                }             
                element.removeClass('m-dropdown--open');
                if (element.data('dropoff')) {
                    element.data('dropoff').remove();
                }
                dropdown.open = false;
                Plugin.eventTrigger('afterHide');
            },
            hide: function(force) {
                if (dropdown.open === false) {
                    return dropdown;
                }
                if (dropdown.options.toggle == 'hover') {
                    Plugin.hideHovered(force);
                } else {
                    Plugin.hideClicked();
                }
                if (dropdown.defaultDropPos == 'down' && dropdown.currentDropPos == 'up') {
                    element.removeClass('m-dropdown--up');
                    dropdown.arrow.prependTo(dropdown.wrapper);
                    dropdown.currentDropPos = 'down';
                }
                return dropdown;                
            },
            hideOpened: function() {
                $('.m-dropdown.m-dropdown--open').each(function() {
                    $(this).mDropdown().hide(true);
                });
            },
            adjustArrowPos: function() {
                var width = element.outerWidth();
                var alignment = dropdown.arrow.hasClass('m-dropdown__arrow--right') ? 'right' : 'left';
                var pos = 0;
                if (dropdown.arrow.length > 0) {
                    if (mUtil.isInResponsiveRange('mobile') && element.hasClass('m-dropdown--mobile-full-width')) {
                        pos = element.offset().left + (width / 2) - Math.abs(dropdown.arrow.width() / 2) - parseInt(dropdown.wrapper.css('left'));
                        dropdown.arrow.css('right', 'auto');    
                        dropdown.arrow.css('left', pos);    
                        dropdown.arrow.css('margin-left', 'auto');
                        dropdown.arrow.css('margin-right', 'auto');
                    } else if (dropdown.arrow.hasClass('m-dropdown__arrow--adjust')) {
                        pos = width / 2 - Math.abs(dropdown.arrow.width() / 2);
                        if (element.hasClass('m-dropdown--align-push')) {
                            pos = pos + 20;
                        }
                        if (alignment == 'right') { 
                            dropdown.arrow.css('left', 'auto');  
                            dropdown.arrow.css('right', pos);
                        } else {                            
                            dropdown.arrow.css('right', 'auto');  
                            dropdown.arrow.css('left', pos);
                        }  
                    }                    
                }
            },
            handleDropPosition: function() {
                return;
                if (dropdown.options.dropAuto == true) {
                    if (Plugin.isInVerticalViewport() === false) {
                        if (dropdown.currentDropPos == 'up') {
                            element.removeClass('m-dropdown--up');
                            dropdown.arrow.prependTo(dropdown.wrapper);
                            dropdown.currentDropPos = 'down';
                        } else if (dropdown.currentDropPos == 'down') {
                            element.addClass('m-dropdown--up');
                            dropdown.arrow.appendTo(dropdown.wrapper);
                            dropdown.currentDropPos = 'up'; 
                        }
                    }
                }
            },
            setZindex: function() {
                var oldZindex = dropdown.wrapper.css('z-index');
                var newZindex = mUtil.getHighestZindex(element);
                if (newZindex > oldZindex) {
                    dropdown.wrapper.css('z-index', zindex);
                }
            },
            isPersistent: function () {
                return dropdown.options.persistent;
            },
            isShown: function () {
                return dropdown.open;
            },
            isInVerticalViewport: function() {
                var el = dropdown.wrapper;
                var offset = el.offset();
                var height = el.outerHeight();
                var width = el.width();
                var scrollable = el.find('[data-scrollable]');
                if (scrollable.length) {
                    if (scrollable.data('max-height')) {
                        height += parseInt(scrollable.data('max-height'));
                    } else if(scrollable.data('height')) {
                        height += parseInt(scrollable.data('height'));
                    }
                }
                return (offset.top + height < $(window).scrollTop() + $(window).height());
            },
            eventTrigger: function(name) {
                for (i = 0; i < dropdown.events.length; i++) {
                    var event = dropdown.events[i];
                    if (event.name == name) {
                        if (event.one == true) {
                            if (event.fired == false) {
                                dropdown.events[i].fired = true;
                                return event.handler.call(this, dropdown);
                            }
                        } else {
                            return  event.handler.call(this, dropdown);
                        }
                    }
                }
            },
            addEvent: function(name, handler, one) {
                dropdown.events.push({
                    name: name,
                    handler: handler,
                    one: one,
                    fired: false
                });
                Plugin.sync();
                return dropdown;
            }
        };
        Plugin.run.apply(this, [options]);
        dropdown.show = function () {
            return Plugin.show();
        };
        dropdown.hide = function () {
            return Plugin.hide();
        };
        dropdown.toggle = function () {
            return Plugin.toggle();
        };
        dropdown.isPersistent = function () {
            return Plugin.isPersistent();
        };
        dropdown.isShown = function () {
            return Plugin.isShown();
        };
        dropdown.fixDropPosition = function () {
            return Plugin.handleDropPosition();
        };
        dropdown.setContent = function (content) {
            return Plugin.setContent(content);
        };
        dropdown.on =  function (name, handler) {
            return Plugin.addEvent(name, handler);
        };
        dropdown.one =  function (name, handler) {
            return Plugin.addEvent(name, handler, true);
        };        
        return dropdown;
    };
    $.fn.mDropdown.defaults = {
        toggle: 'click',
        hoverTimeout: 300,
        skin: 'default',
        height: 'auto',
        dropAuto: true,
        maxHeight: false,
        minHeight: false,
        persistent: false,
        mobileOverlay: true
    };
    if (mUtil.isMobileDevice()) {
        $(document).on('click', '[data-dropdown-toggle="click"] .m-dropdown__toggle, [data-dropdown-toggle="hover"] .m-dropdown__toggle', function(e) { 
            e.preventDefault(); 
            $(this).parent('.m-dropdown').mDropdown().toggle(); 
        });
    } else {
        $(document).on('click', '[data-dropdown-toggle="click"] .m-dropdown__toggle', function(e) { 
            e.preventDefault();
            $(this).parent('.m-dropdown').mDropdown().toggle();   
        });
        $(document).on('mouseenter', '[data-dropdown-toggle="hover"]', function(e) { 
            $(this).mDropdown().toggle();
        });
    }
    $(document).on('click', function(e) {
        $('.m-dropdown.m-dropdown--open').each(function() {
            if (!$(this).data('dropdown')) {
                return;
            }        
            var target = $(e.target);
            var dropdown = $(this).mDropdown();
            var toggle = $(this).find('.m-dropdown__toggle');
            if (toggle.length > 0 && target.is(toggle) !== true && toggle.find(target).length === 0 && target.find(toggle).length === 0 && dropdown.isPersistent() == false) {
                dropdown.hide();     
            } else if ($(this).find(target).length === 0) {
                dropdown.hide();       
            }
        });
    });
}(jQuery));
