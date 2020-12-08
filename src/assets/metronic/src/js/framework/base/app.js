var mApp = function() {
    var initTooltip = function(el) {
        var skin = el.data('skin') ? 'm-tooltip--skin-' + el.data('skin') : '';
        el.tooltip({
            trigger: 'hover',
            template: '<div class="m-tooltip ' + skin + ' tooltip" role="tooltip">\
                <div class="arrow"></div>\
                <div class="tooltip-inner"></div>\
            </div>'
        });
    }
    var initTooltips = function() {
        $('[data-toggle="m-tooltip"]').each(function() {
            initTooltip($(this));
        });
    }
    var initPopover = function(el) {
        var skin = el.data('skin') ? 'm-popover--skin-' + el.data('skin') : '';
        el.popover({
            trigger: 'hover',
            template: '\
            <div class="m-popover ' + skin + ' popover" role="tooltip">\
                <div class="arrow"></div>\
                <h3 class="popover-header"></h3>\
                <div class="popover-body"></div>\
            </div>'
        });
    }
    var initPopovers = function() {
        $('[data-toggle="m-popover"]').each(function() {
            initPopover($(this));
        });
    }    
    var initPortlet = function(el, options) {
        el.mPortlet(options);
    }
    var initPortlets = function() {
        $('[data-portlet="true"]').each(function() {
            var el = $(this);
            if ( el.data('portlet-initialized') !== true ) {
                initPortlet(el, {});
                el.data('portlet-initialized', true);
            }
        });
    }
    var initScrollables = function() {
        $('[data-scrollable="true"]').each(function(){
            var maxHeight;
            var height;
            var el = $(this);
            if (mUtil.isInResponsiveRange('tablet-and-mobile')) {
                if (el.data('mobile-max-height')) {
                    maxHeight = el.data('mobile-max-height');
                } else {
                    maxHeight = el.data('max-height');
                }
                if (el.data('mobile-height')) {
                    height = el.data('mobile-height');
                } else {
                    height = el.data('height');
                }
            } else {
                maxHeight = el.data('max-height');
                height = el.data('max-height');
            }
            if (maxHeight) {
                el.css('max-height', maxHeight);
            }
            if (height) {
                el.css('height', height);
            }
            mApp.initScroller(el, {});
        });
    }
    var initAlerts = function() {
        $('body').on('click', '[data-close=alert]', function() {
            $(this).closest('.alert').hide();
        });
    }        
    return {
        init: function() {
            mApp.initComponents();
        },
        initComponents: function() {
            initScrollables();
            initTooltips();
            initPopovers();
            initAlerts();
            initPortlets();
        },
        initTooltips: function() {
            initTooltips();
        },
        initTooltip: function(el) {
            initTooltip(el);
        },
        initPopovers: function() {
            initPopovers();
        },
        initPopover: function(el) {
            initPopover(el);
        },
        initPortlet: function(el, options) {
            initPortlet(el, options);
        },
        initPortlets: function() {
            initPortlets();
        },
        scrollTo: function(el, offset) {
            var pos = (el && el.length > 0) ? el.offset().top : 0;
            pos = pos + (offset ? offset : 0);
            jQuery('html,body').animate({
                scrollTop: pos
            }, 'slow');
        },
        scrollToViewport: function(el) {
            var elOffset = el.offset().top;
            var elHeight = el.height();
            var windowHeight = mUtil.getViewPort().height;
            var offset = elOffset - ((windowHeight / 2) - (elHeight / 2));
            jQuery('html,body').animate({
                scrollTop: offset
            }, 'slow');
        },
        scrollTop: function() {
            mApp.scrollTo();
        },
        initScroller: function(el, options) {
            if (mUtil.isMobileDevice()) {
                el.css('overflow', 'auto');
            } else {
                el.mCustomScrollbar("destroy");
                el.mCustomScrollbar({
                    scrollInertia: 0,
                    autoDraggerLength: true,
                    autoHideScrollbar: true,
                    autoExpandScrollbar: false,
                    alwaysShowScrollbar: 0,
                    axis: el.data('axis') ? el.data('axis') : 'y', 
                    mouseWheel: {
                        scrollAmount: 120,
                        preventDefault: true
                    },         
                    setHeight: (options.height ? options.height : ''),
                    theme:"minimal-dark"
                });
            }           
        },
        destroyScroller: function(el) {
            el.mCustomScrollbar("destroy");
        },
        alert: function(options) {
            options = $.extend(true, {
                container: "", 
                place: "append", 
                type: 'success', 
                message: "", 
                close: true, 
                reset: true, 
                focus: true, 
                closeInSeconds: 0, 
                icon: "" 
            }, options);
            var id = mUtil.getUniqueID("App_alert");
            var html = '<div id="' + id + '" class="custom-alerts alert alert-' + options.type + ' fade in">' + (options.close ? '<button type="button" class="close" data-dismiss="alert" aria-hidden="true"></button>' : '') + (options.icon !== "" ? '<i class="fa-lg fa fa-' + options.icon + '"></i>  ' : '') + options.message + '</div>';
            if (options.reset) {
                $('.custom-alerts').remove();
            }
            if (!options.container) {
                if ($('.page-fixed-main-content').size() === 1) {
                    $('.page-fixed-main-content').prepend(html);
                } else if (($('body').hasClass("page-container-bg-solid") || $('body').hasClass("page-content-white")) && $('.page-head').size() === 0) {
                    $('.page-title').after(html);
                } else {
                    if ($('.page-bar').size() > 0) {
                        $('.page-bar').after(html);
                    } else {
                        $('.page-breadcrumb, .breadcrumbs').after(html);
                    }
                }
            } else {
                if (options.place == "append") {
                    $(options.container).append(html);
                } else {
                    $(options.container).prepend(html);
                }
            }
            if (options.focus) {
                mApp.scrollTo($('#' + id));
            }
            if (options.closeInSeconds > 0) {
                setTimeout(function() {
                    $('#' + id).remove();
                }, options.closeInSeconds * 1000);
            }
            return id;
        },
        block: function(target, options) {
            var el = $(target);
            options = $.extend(true, {
                opacity: 0.1,
                overlayColor: '',
                state: 'brand',
                type: 'spinner',
                centerX: true,
                centerY: true,
                message: '',
                shadow: true,
                width: 'auto'
            }, options);
            var skin;
            var state;
            var loading;
            if (options.type == 'spinner') {
                skin = options.skin ? 'm-spinner--skin-' + options.skin : '';
                state = options.state ? 'm-spinner--' + options.state : '';
                loading = '<div class="m-spinner ' + skin + ' ' + state + '"></div';
            } else {
                skin = options.skin ? 'm-loader--skin-' + options.skin : '';
                state = options.state ? 'm-loader--' + options.state : '';
                size = options.size ? 'm-loader--' + options.size : '';
                loading = '<div class="m-loader ' + skin + ' ' + state + ' ' + size + '"></div';
            }
            if (options.message && options.message.length > 0) {
                var classes = 'm-blockui ' + (options.shadow === false ? 'm-blockui-no-shadow' : '');
                html = '<div class="' + classes + '"><span>' + options.message + '</span><span>' + loading + '</span></div>';
                options.width = mUtil.realWidth(html) + 10;
                if (target == 'body') {
                    html = '<div class="' + classes + '" style="margin-left:-'+ (options.width / 2) +'px;"><span>' + options.message + '</span><span>' + loading + '</span></div>';
                }
            } else {
                html = loading;
            }
            var params = {
                message: html,
                centerY: options.centerY,
                centerX: options.centerX,
                css: {
                    top: '30%',
                    left: '50%',
                    border: '0',
                    padding: '0',
                    backgroundColor: 'none',
                    width: options.width
                },
                overlayCSS: {
                    backgroundColor: options.overlayColor,
                    opacity: options.opacity,
                    cursor: 'wait'
                },
                onUnblock: function() {
                    if (el) {
                        el.css('position', '');
                        el.css('zoom', '');
                    }                    
                }
            };
            if (target == 'body') {
                params.css.top = '50%';
                $.blockUI(params);
            } else {
                var el = $(target);
                el.block(params);
            }
        },
        unblock: function(target) {
            if (target && target != 'body') {
                $(target).unblock();
            } else {
                $.unblockUI();
            }
        },
        blockPage: function(options) {
            return mApp.block('body', options);
        },
        unblockPage: function() {
            return mApp.unblock('body');
        }
    };
}();
$(document).ready(function() {
    mApp.init();
});
