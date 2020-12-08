(function($) {
    $.fn.mMenu = function(options) {
        var menu = this;
        var element = $(this);
        var Plugin = {
            run: function(options, reinit) { 
                if (element.data('menu') && reinit !== true) {
                    menu = element.data('menu');                
                } else {
                    Plugin.init(options);
                    Plugin.reset();
                    Plugin.build();
                    element.data('menu', menu);
                } 
                return menu;
            },
            init: function(options) { 
                menu.events = [];
                menu.options = $.extend(true, {}, $.fn.mMenu.defaults, options);
                menu.pauseDropdownHoverTime = 0;
            },
            build: function() {
                element.on('click', '.m-menu__toggle', Plugin.handleSubmenuAccordion);
                if (Plugin.getSubmenuMode() === 'dropdown' || Plugin.isConditionalSubmenuDropdown()) {   
	                element.on({mouseenter: Plugin.handleSubmenuDrodownHoverEnter, mouseleave: Plugin.handleSubmenuDrodownHoverExit}, '[data-menu-submenu-toggle="hover"]');
	                element.on('click', '[data-menu-submenu-toggle="click"] .m-menu__toggle', Plugin.handleSubmenuDropdownClick);
                }
                element.find('.m-menu__item:not(.m-menu__item--submenu) > .m-menu__link:not(.m-menu__toggle)').click(Plugin.handleLinkClick);             
            },
            reset: function() {
            	element.off('click', '.m-menu__toggle', Plugin.handleSubmenuAccordion);
            	element.off({mouseenter: Plugin.handleSubmenuDrodownHoverEnter, mouseleave: Plugin.handleSubmenuDrodownHoverExit}, '[data-menu-submenu-toggle="hover"]');
            	element.off('click', '[data-menu-submenu-toggle="click"] .m-menu__toggle', Plugin.handleSubmenuDropdownClick);
                menu.find('.m-menu__submenu, .m-menu__inner').css('display', '');
                menu.find('.m-menu__item--hover').removeClass('m-menu__item--hover');
                menu.find('.m-menu__item--open:not(.m-menu__item--expanded)').removeClass('m-menu__item--open');
            },
            getSubmenuMode: function() {                
                if (mUtil.isInResponsiveRange('desktop')) {
                    if (mUtil.isset(menu.options.submenu, 'desktop.state.body')) {
                        if ($('body').hasClass(menu.options.submenu.desktop.state.body)) {
                            return menu.options.submenu.desktop.state.mode;
                        } else {
                            return menu.options.submenu.desktop.default;
                        }
                    } else if (mUtil.isset(menu.options.submenu, 'desktop') ){
                        return menu.options.submenu.desktop;
                    }
                } else if (mUtil.isInResponsiveRange('tablet') && mUtil.isset(menu.options.submenu, 'tablet')) {
                    return menu.options.submenu.tablet;
                } else if (mUtil.isInResponsiveRange('mobile') && mUtil.isset(menu.options.submenu, 'mobile')) {
                    return menu.options.submenu.mobile;
                } else {
                    return false;
                }
            },
            isConditionalSubmenuDropdown: function() {
                if (mUtil.isInResponsiveRange('desktop') && mUtil.isset(menu.options.submenu, 'desktop.state.body')) {
                    return true;
                } else {
                    return false;    
                }                
            },
            handleLinkClick: function(e) {    
                if (Plugin.eventTrigger('linkClick', $(this)) === false) {
                    e.preventDefault();
                };
                if (Plugin.getSubmenuMode() === 'dropdown' || Plugin.isConditionalSubmenuDropdown()) { 
                    Plugin.handleSubmenuDropdownClose(e, $(this));
                }
            },
            handleSubmenuDrodownHoverEnter: function(e) {
                if (Plugin.getSubmenuMode() === 'accordion') {
                    return;
                }
                if (menu.resumeDropdownHover() === false) {
                    return;
                }               
                var item = $(this);
                Plugin.showSubmenuDropdown(item);
                if (item.data('hover') == true) {
                    Plugin.hideSubmenuDropdown(item, false);
                }
            },
            handleSubmenuDrodownHoverExit: function(e) {
                if (menu.resumeDropdownHover() === false) {
                    return;
                }
                if (Plugin.getSubmenuMode() === 'accordion') {
                    return;
                }
                var item = $(this);
                var time = menu.options.dropdown.timeout;
                var timeout = setTimeout(function() {
                    if (item.data('hover') == true) {
                        Plugin.hideSubmenuDropdown(item, true);
                    }
                }, time);
                item.data('hover', true);
                item.data('timeout', timeout);
            },
            handleSubmenuDropdownClick: function(e) {
                if (Plugin.getSubmenuMode() === 'accordion') {
                    return;
                }
                var item = $(this).closest('.m-menu__item');
                if (item.hasClass('m-menu__item--hover') == false) {
                    item.addClass('m-menu__item--open-dropdown');
                    Plugin.showSubmenuDropdown(item);
                } else {
                    item.removeClass('m-menu__item--open-dropdown');
                    Plugin.hideSubmenuDropdown(item, true);
                }
                e.preventDefault();
            },
            handleSubmenuDropdownClose: function(e, el) {
                if (Plugin.getSubmenuMode() === 'accordion') {
                    return;
                }
                var shown = element.find('.m-menu__item.m-menu__item--submenu.m-menu__item--hover');
                if (shown.length > 0 && el.hasClass('m-menu__toggle') === false && el.find('.m-menu__toggle').length === 0) {
                    shown.each(function() {
                        Plugin.hideSubmenuDropdown($(this), true);    
                    });                     
                }
            },
            handleSubmenuAccordion: function(e) {
                if (Plugin.getSubmenuMode() === 'dropdown') {
                    e.preventDefault();
                    return;
                }
                var item = $(this);
                var li = item.closest('li');
                var submenu = li.children('.m-menu__submenu, .m-menu__inner');
                if (submenu.parent('.m-menu__item--expanded').length != 0) {
                }
                if (submenu.length > 0) {
                    e.preventDefault();
                    var speed = menu.options.accordion.slideSpeed;
                    var hasClosables = false;
                    if (li.hasClass('m-menu__item--open') === false) {
                        if (menu.options.accordion.expandAll === false) {
                            var closables = item.closest('.m-menu__nav, .m-menu__subnav').find('> .m-menu__item.m-menu__item--open.m-menu__item--submenu:not(.m-menu__item--expanded)');
                            closables.each(function() {
                                $(this).children('.m-menu__submenu').slideUp(speed, function() {
                                    Plugin.scrollToItem(item);
                                });                                
                                $(this).removeClass('m-menu__item--open');
                            });
                            if (closables.length > 0) {
                                hasClosables = true;
                            }
                        }                         
                        if (hasClosables) {
                            submenu.slideDown(speed, function() {
                                Plugin.scrollToItem(item);
                            }); 
                            li.addClass('m-menu__item--open');
                        } else {
                            submenu.slideDown(speed, function() {
                                Plugin.scrollToItem(item);
                            });
                            li.addClass('m-menu__item--open');
                        }                        
                    } else {  
                        submenu.slideUp(speed, function() {
                             Plugin.scrollToItem(item);
                        });                        
                        li.removeClass('m-menu__item--open');                  
                    }
                }
            },     
            scrollToItem: function(item) {
                if (mUtil.isInResponsiveRange('desktop') && menu.options.accordion.autoScroll && !element.data('menu-scrollable')) {                        
                    mApp.scrollToViewport(item);
                }
            },
            hideSubmenuDropdown: function(el, classAlso) {
                if (classAlso) {
                    el.removeClass('m-menu__item--hover');
                }
                el.removeData('hover');
                var timeout = el.data('timeout');
                el.removeData('timeout');
                clearTimeout(timeout);
            },
            showSubmenuDropdown: function(item) {
                element.find('.m-menu__item--submenu.m-menu__item--hover').each(function() {
                    var el = $(this);
                    if (item.is(el) || el.find(item).length > 0 || item.find(el).length > 0) {
                        return;
                    } else {
                        Plugin.hideSubmenuDropdown(el, true); 
                    }
                });
                Plugin.adjustSubmenuDropdownArrowPos(item);
                item.addClass('m-menu__item--hover');
                if (Plugin.getSubmenuMode() === 'accordion' && menu.options.accordion.autoScroll) {
                    mApp.scrollTo(item.children('.m-menu__item--submenu'));
                }              
            },                
            resize: function(e) {
                if (Plugin.getSubmenuMode() !== 'dropdown') {
                    return;
                }
                var resize = element.find('> .m-menu__nav > .m-menu__item--resize');
                var submenu = resize.find('> .m-menu__submenu');
                var breakpoint;
                var currentWidth = mUtil.getViewPort().width;
                var itemsNumber = element.find('> .m-menu__nav > .m-menu__item').length - 1;
                var check;
                if (
                    Plugin.getSubmenuMode() == 'dropdown' && 
                    (
                        (mUtil.isInResponsiveRange('desktop') && mUtil.isset(menu.options, 'resize.desktop') && (check = menu.options.resize.desktop) && currentWidth <= (breakpoint = resize.data('menu-resize-desktop-breakpoint'))) ||
                        (mUtil.isInResponsiveRange('tablet') && mUtil.isset(menu.options, 'resize.tablet') && (check = menu.options.resize.tablet) && currentWidth <= (breakpoint = resize.data('menu-resize-tablet-breakpoint'))) ||
                        (mUtil.isInResponsiveRange('mobile') && mUtil.isset(menu.options, 'resize.mobile') && (check = menu.options.resize.mobile) && currentWidth <= (breakpoint = resize.data('menu-resize-mobile-breakpoint')))
                    )
                    ) {
                    var moved = submenu.find('> .m-menu__subnav > .m-menu__item').length; 
                    var left = element.find('> .m-menu__nav > .m-menu__item:not(.m-menu__item--resize)').length; 
                    var total = moved + left;
                    if (check.apply() === true) {
                        if (moved > 0) {
                            submenu.find('> .m-menu__subnav > .m-menu__item').each(function() {
                                var item = $(this);
                                var elementsNumber = submenu.find('> .m-menu__nav > .m-menu__item:not(.m-menu__item--resize)').length;
                                element.find('> .m-menu__nav > .m-menu__item:not(.m-menu__item--resize)').eq(elementsNumber - 1).after(item);
                                if (check.apply() === false) {
                                    item.appendTo(submenu.find('> .m-menu__subnav'));
                                    return false;
                                }         
                                moved--;
                                left++;                        
                            });
                        }
                    } else {
                        if (left > 0) {
                            var items = element.find('> .m-menu__nav > .m-menu__item:not(.m-menu__item--resize)');
                            var index = items.length - 1;
                            for(var i = 0; i < items.length; i++) {
                                var item = $(items.get(index)); 
                                index--;
                                if (check.apply() === true) {
                                    break;
                                }
                                item.appendTo(submenu.find('> .m-menu__subnav'));
                                moved++;
                                left--; 
                            } 
                        }
                    }
                    if (moved > 0) {
                        resize.show();  
                    } else {
                        resize.hide();
                    }                   
                } else {    
                    submenu.find('> .m-menu__subnav > .m-menu__item').each(function() {
                        var elementsNumber = submenu.find('> .m-menu__subnav > .m-menu__item').length;
                        element.find('> .m-menu__nav > .m-menu__item').get(elementsNumber).after($(this));
                    });
                    resize.hide();
                }
            },
            createSubmenuDropdownClickDropoff: function(el) {
                var zIndex = el.find('> .m-menu__submenu').css('zIndex') - 1;
                var dropoff = $('<div class="m-menu__dropoff" style="background: transparent; position: fixed; top: 0; bottom: 0; left: 0; right: 0; z-index: ' + zIndex + '"></div>');
                $('body').after(dropoff);
                dropoff.on('click', function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    el.removeClass('m-menu__item--hover');
                    $(this).remove();
                });
            },
            adjustSubmenuDropdownArrowPos: function(item) {                
                var arrow = item.find('> .m-menu__submenu > .m-menu__arrow.m-menu__arrow--adjust');
                var submenu = item.find('> .m-menu__submenu');
                var subnav = item.find('> .m-menu__submenu > .m-menu__subnav');
                if (arrow.length > 0) {
                    var pos;
                    var link = item.children('.m-menu__link');
                    if (submenu.hasClass('m-menu__submenu--classic') || submenu.hasClass('m-menu__submenu--fixed')) { 
                        if (submenu.hasClass('m-menu__submenu--right')) {
                            pos = item.outerWidth() / 2;
                            if (submenu.hasClass('m-menu__submenu--pull')) {
                                pos = pos + Math.abs(parseInt(submenu.css('margin-right')));    
                            }  
                            pos = submenu.width() - pos;
                        } else if (submenu.hasClass('m-menu__submenu--left')) {
                            pos = item.outerWidth() / 2;
                            if (submenu.hasClass('m-menu__submenu--pull')) {
                                pos = pos + Math.abs(parseInt(submenu.css('margin-left')));    
                            } 
                        }
                    } else  {
                        if (submenu.hasClass('m-menu__submenu--center') || submenu.hasClass('m-menu__submenu--full')) {
                            pos = item.offset().left - ((mUtil.getViewPort().width - submenu.outerWidth()) / 2);
                            pos = pos + (item.outerWidth() / 2);
                        } else if (submenu.hasClass('m-menu__submenu--left')) {
                        } else if (submenu.hasClass('m-menu__submenu--right')) {
                        }
                    } 
                    arrow.css('left', pos);
                }
            },
            pauseDropdownHover: function(time) {
            	var date = new Date();
            	menu.pauseDropdownHoverTime = date.getTime() + time;
            },
            resumeDropdownHover: function() {
            	var date = new Date();
            	return (date.getTime() > menu.pauseDropdownHoverTime ? true : false);
            },
            resetActiveItem: function(item) {
                element.find('.m-menu__item--active').each(function() {
                    $(this).removeClass('m-menu__item--active');
                    $(this).children('.m-menu__submenu').css('display', '');
                    $(this).parents('.m-menu__item--submenu').each(function() {
                        $(this).removeClass('m-menu__item--open');
                        $(this).children('.m-menu__submenu').css('display', '');
                    });
                });             
                if (menu.options.accordion.expandAll === false) {
                    element.find('.m-menu__item--open').each(function() {
                        $(this).removeClass('m-menu__item--open');
                    });
                }
            },
            setActiveItem: function(item) {
                Plugin.resetActiveItem();
                var item = $(item);
                item.addClass('m-menu__item--active');
                item.parents('.m-menu__item--submenu').each(function() {
                    $(this).addClass('m-menu__item--open');
                });
            },
            getBreadcrumbs: function(item) {
                var breadcrumbs = [];
                var item = $(item);
                var link = item.children('.m-menu__link');
                breadcrumbs.push({
                    text: link.find('.m-menu__link-text').html(), 
                    title: link.attr('title'),
                    href: link.attr('href')
                });
                item.parents('.m-menu__item--submenu').each(function() {
                    var submenuLink = $(this).children('.m-menu__link');
                    breadcrumbs.push({
                        text: submenuLink.find('.m-menu__link-text').html(), 
                        title: submenuLink.attr('title'),
                        href: submenuLink.attr('href')
                    });
                });
                breadcrumbs.reverse();
                return breadcrumbs;
            },
            getPageTitle: function(item) {
                item = $(item);       
                return item.children('.m-menu__link').find('.m-menu__link-text').html();
            },
            sync: function () {
                $(element).data('menu', menu);
            }, 
            eventTrigger: function(name, args) {
                for (i = 0; i < menu.events.length; i++) {
                    var event = menu.events[i];
                    if (event.name == name) {
                        if (event.one == true) {
                            if (event.fired == false) {
                                menu.events[i].fired = true;
                                return event.handler.call(this, menu, args);
                            }
                        } else {
                            return  event.handler.call(this, menu, args);
                        }
                    }
                }
            },
            addEvent: function(name, handler, one) {
                menu.events.push({
                    name: name,
                    handler: handler,
                    one: one,
                    fired: false
                });
                Plugin.sync();
            }
        };
        Plugin.run.apply(menu, [options]);
        if (typeof(options)  !== "undefined") {
            $(window).resize(function() {
                Plugin.run.apply(menu, [options, true]);
            });  
        }        
        menu.setActiveItem = function(item) {
            return Plugin.setActiveItem(item);
        };
        menu.getBreadcrumbs = function(item) {
            return Plugin.getBreadcrumbs(item);
        };
        menu.getPageTitle = function(item) {
            return Plugin.getPageTitle(item);
        };
        menu.getSubmenuMode = function() {
            return Plugin.getSubmenuMode();
        };
        menu.pauseDropdownHover = function(time) {
        	Plugin.pauseDropdownHover(time);
        };
        menu.resumeDropdownHover = function() {
        	return Plugin.resumeDropdownHover();
        };
        menu.on =  function (name, handler) {
            return Plugin.addEvent(name, handler);
        };
        return menu;
    };
    $.fn.mMenu.defaults = {
        accordion: {   
            slideSpeed: 200,  
            autoScroll: true, 
            expandAll: true   
        },
        dropdown: {
            timeout: 500  
        }
    }; 
    $(document).on('click', function(e) {
        $('.m-menu__nav .m-menu__item.m-menu__item--submenu.m-menu__item--hover[data-menu-submenu-toggle="click"]').each(function() {
            var  element = $(this).parent('.m-menu__nav').parent();
            menu = element.mMenu(); 
            if (menu.getSubmenuMode() !== 'dropdown') { 
                return;
            }
            if ($(e.target).is(element) == false && element.find($(e.target)).length == 0) {
                element.find('.m-menu__item--submenu.m-menu__item--hover[data-menu-submenu-toggle="click"]').removeClass('m-menu__item--hover');
            }          
        });
    });
}(jQuery));
