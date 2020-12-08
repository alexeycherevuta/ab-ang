var mUtil = function() {
    var resizeHandlers = [];
    var breakpoints = {        
        sm: 544, 
        md: 768, 
        lg: 992, 
        xl: 1200 
    };
    var colors = {
        brand:      '#716aca',
        metal:      '#c4c5d6',
        light:      '#ffffff',
        accent:     '#00c5dc',
        primary:    '#5867dd',
        success:    '#34bfa3',
        info:       '#36a3f7',
        warning:    '#ffb822',
        danger:     '#f4516c'
    };
    var _windowResizeHandler = function() {
        var resize;
        var _runResizeHandlers = function() {
            for (var i = 0; i < resizeHandlers.length; i++) {
                var each = resizeHandlers[i];
                each.call();
            }
        };
        jQuery(window).resize(function() {
            if (resize) {
                clearTimeout(resize);
            }
            resize = setTimeout(function() {
                _runResizeHandlers();
            }, 250); 
        });
    };
    return {
        init: function(options) {
            if (options && options.breakpoints) {
                breakpoints = options.breakpoints;
            }
            if (options && options.colors) {
                colors = options.colors;
            }
            _windowResizeHandler();
        },
        addResizeHandler: function(callback) {
            resizeHandlers.push(callback);
        },
        runResizeHandlers: function() {
            _runResizeHandlers();
        },        
        getURLParam: function(paramName) {
            var searchString = window.location.search.substring(1),
                i, val, params = searchString.split("&");
            for (i = 0; i < params.length; i++) {
                val = params[i].split("=");
                if (val[0] == paramName) {
                    return unescape(val[1]);
                }
            }
            return null;
        },
        isMobileDevice: function() {
            return (this.getViewPort().width < this.getBreakpoint('lg') ? true : false);
        },
        isDesktopDevice: function() {
            return mUtil.isMobileDevice() ? false : true;
        },
        getViewPort: function() {
            var e = window,
                a = 'inner';
            if (!('innerWidth' in window)) {
                a = 'client';
                e = document.documentElement || document.body;
            }
            return {
                width: e[a + 'Width'],
                height: e[a + 'Height']
            };
        },
        isInResponsiveRange: function(mode) {
            var breakpoint = this.getViewPort().width;
            if (mode == 'general') {
                return true;
            } else if (mode == 'desktop' && breakpoint >= (this.getBreakpoint('lg') + 1)) {
                return true;
            } else if (mode == 'tablet' && (breakpoint >= (this.getBreakpoint('md') + 1) && breakpoint < this.getBreakpoint('lg'))) {
                return true;
            } else if (mode == 'mobile' && breakpoint <= this.getBreakpoint('md')) {
                return true;
            } else if (mode == 'desktop-and-tablet' && breakpoint >= (this.getBreakpoint('md') + 1)) {
                return true;
            } else if (mode == 'tablet-and-mobile' && breakpoint <= this.getBreakpoint('lg')) {
                return true;
            }
            return false;
        },
        getUniqueID: function(prefix) {
            return prefix + Math.floor(Math.random() * (new Date()).getTime());
        },
        getBreakpoint: function(mode) {
            if ($.inArray(mode, breakpoints)) {
                return breakpoints[mode];
            }
        },
        isset: function(obj, keys) {
            var stone;
            keys = keys || '';
            if (keys.indexOf('[') !== -1) {
                throw new Error('Unsupported object path notation.');
            }
            keys = keys.split('.');
            do {
                if (obj === undefined) {
                    return false;
                }
                stone = keys.shift();
                if (!obj.hasOwnProperty(stone)) {
                    return false;
                }
                obj = obj[stone];
            } while (keys.length);
            return true;
        },
        getHighestZindex: function(el) {
            var elem = $(el),
                position, value;
            while (elem.length && elem[0] !== document) {
                position = elem.css("position");
                if (position === "absolute" || position === "relative" || position === "fixed") {
                    value = parseInt(elem.css("zIndex"), 10);
                    if (!isNaN(value) && value !== 0) {
                        return value;
                    }
                }
                elem = elem.parent();
            }
        },
        hasClasses: function(el, classes) {
            var classesArr = classes.split(" ");
            for ( var i = 0; i < classesArr.length; i++ ) {
                if ( el.hasClass( classesArr[i] ) == false ) {
                    return false;
                }
            }                
            return true;
        },
        realWidth: function(el){
            var clone = $(el).clone();
            clone.css("visibility","hidden");
            clone.css('overflow', 'hidden');
            clone.css("height","0");
            $('body').append(clone);
            var width = clone.outerWidth();
            clone.remove();
            return width;
        },
        hasFixedPositionedParent: function(el) {
            var result = false;
            el.parents().each(function () {
                if ($(this).css('position') == 'fixed') {
                    result = true;
                    return;
                }
            });
            return result;
        },
        sleep: function(milliseconds) {
            var start = new Date().getTime();
            for (var i = 0; i < 1e7; i++) {
                if ((new Date().getTime() - start) > milliseconds){
                    break;
                }
            }
        },
        getRandomInt: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        getColor: function(name) {
            return colors[name];
        },
        isAngularVersion: function() {
            return window.Zone !== undefined  ? true : false;
        }
    }
}();
$(document).ready(function() {
    mUtil.init();
});
