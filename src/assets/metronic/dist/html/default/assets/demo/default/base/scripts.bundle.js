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
jQuery.fn.extend({
    animateClass: function(animationName, callback) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        jQuery(this).addClass('animated ' + animationName).one(animationEnd, function() {
            jQuery(this).removeClass('animated ' + animationName);
        });
        if (callback) {
            jQuery(this).one(animationEnd, callback);
        }
    },
    animateDelay: function(value) {
        var vendors = ['webkit-', 'moz-', 'ms-', 'o-', ''];
        for (var i = 0; i < vendors.length; i++) {
            jQuery(this).css(vendors[i] + 'animation-delay', value);
        }
    },
    animateDuration: function(value) {
        var vendors = ['webkit-', 'moz-', 'ms-', 'o-', ''];
        for (var i = 0; i < vendors.length; i++) {
            jQuery(this).css(vendors[i] + 'animation-duration', value);
        }
    }
});
(function($) {
  if (typeof mUtil === 'undefined') throw new Error(
      'mUtil is required and must be included before mDatatable.');
  $.fn.mDatatable = function(options) {
    if ($(this).hasClass('m-datatable--loaded')) return;
    if ($(this).length === 0) throw new Error('No mDatatable element exist.');
    if ($(this).attr('id') === '') throw new Error('ID is required.');
    var datatable = this;
    datatable.debug = false;
    var dt = {
      offset: 110,
      stateId: 'm-meta',
      init: function(options) {
        dt.setupBaseDOM.call();
        dt.setupDOM(datatable.table);
        API.setDataSourceQuery(API.getOption('data.source.read.params.query'));
        $(datatable).on('m-datatable--on-layout-updated', dt.afterRender);
        if (datatable.debug) dt.stateRemove(dt.stateId);
        if (options.data.type === 'remote' || options.data.type === 'local') {
          if (options.data.saveState === false
              || options.data.saveState.cookie === false
              && options.data.saveState.webstorage === false) {
            dt.stateRemove(dt.stateId);
          }
          if (options.data.type === 'local' &&
              typeof options.data.source === 'object') {
            if (options.data.source === null) {
              dt.extractTable();
            }
            datatable.dataSet = datatable.originalDataSet
                = dt.dataMapCallback(options.data.source);
          }
          dt.dataRender();
        }
        dt.setHeadTitle.call();
        dt.setHeadTitle.call(this, datatable.tableFoot);
        if (options.data.type === null) {
          dt.setupCellField.call();
          dt.setupTemplateCell.call();
          dt.setupSystemColumn.call();
        }
        if (typeof options.layout.header !== 'undefined' &&
            options.layout.header === false) {
          $(datatable.table).find('thead').remove();
        }
        if (typeof options.layout.footer !== 'undefined' &&
            options.layout.footer === false) {
          $(datatable.table).find('tfoot').remove();
        }
        if (options.data.type === null ||
            options.data.type === 'local') dt.layoutUpdate();
        $(window).resize(dt.fullRender);
        $(datatable).height('');
        $(API.getOption('search.input')).on('keyup', function(e) {
          API.search($(this).val().toLowerCase());
        });
        return datatable;
      },
      extractTable: function() {
        var columns = [];
        var headers = $(datatable).
            find('tr:first-child th').
            get().
            map(function(cell, i) {
              var field = $(cell).data('field');
              if (typeof field === 'undefined') {
                field = $(cell).text();
              }
              var column = {field: field, title: field};
              for (var ii in options.columns) {
                if (options.columns[ii].field === field) {
                  column = $.extend(true, {}, options.columns[ii], column);
                }
              }
              columns.push(column);
              return field;
            });
        options.columns = columns;
        var data = $(datatable).find('tr').get().map(function(row) {
          return $(row).find('td').get().map(function(cell, i) {
            return $(cell).html();
          });
        });
        var source = [];
        $.each(data, function(i, row) {
          if (row.length === 0) return;
          var td = {};
          $.each(row, function(index, value) {
            td[headers[index]] = value;
          });
          source.push(td);
        });
        options.data.source = source;
      },
      layoutUpdate: function() {
        dt.setupSubDatatable.call();
        dt.setupSystemColumn.call();
        dt.columnHide.call();
        dt.sorting.call();
        dt.setupHover.call();
        if (typeof options.detail === 'undefined'
            && dt.getDepth() === 1) {
          dt.lockTable.call();
        }
        $(datatable).
            trigger('m-datatable--on-layout-updated',
                {table: $(datatable.table).attr('id')});
      },
      lockTable: function() {
        var lock = {
          lockEnabled: false,
          init: function() {
            lock.lockEnabled = $.grep(options.columns, function(n, i) {
              return typeof n.locked !== 'undefined' && n.locked !== false;
            });
            if (lock.lockEnabled.length === 0) return;
            if (!dt.isLocked()) {
              datatable.oriTable = $(datatable.table).clone();
            }
            lock.enable();
          },
          enable: function() {
            var enableLock = function(tablePart) {
              var lockEnabled = lock.lockEnabledColumns();
              if (lockEnabled.left.length === 0 &&
                  lockEnabled.right.length === 0) {
                return;
              }
              if ($(tablePart).find('.m-datatable__lock').length > 0) {
                dt.log('Locked container already exist in: ', tablePart);
                return;
              }
              if ($(tablePart).find('.m-datatable__row').length === 0) {
                dt.log('No row exist in: ', tablePart);
                return;
              }
              var lockLeft = $('<div/>').
                  addClass('m-datatable__lock m-datatable__lock--left');
              var lockScroll = $('<div/>').
                  addClass('m-datatable__lock m-datatable__lock--scroll');
              var lockRight = $('<div/>').
                  addClass('m-datatable__lock m-datatable__lock--right');
              $(tablePart).find('.m-datatable__row').each(function() {
                var rowLeft = $('<tr/>').
                    addClass('m-datatable__row').
                    appendTo(lockLeft);
                var rowScroll = $('<tr/>').
                    addClass('m-datatable__row').
                    appendTo(lockScroll);
                var rowRight = $('<tr/>').
                    addClass('m-datatable__row').
                    appendTo(lockRight);
                $(this).find('.m-datatable__cell').each(function() {
                  var locked = $(this).data('locked');
                  if (typeof locked !== 'undefined') {
                    if (typeof locked.left !== 'undefined' || locked === true) {
                      $(this).appendTo(rowLeft);
                    }
                    if (typeof locked.right !== 'undefined') {
                      $(this).appendTo(rowRight);
                    }
                  } else {
                    $(this).appendTo(rowScroll);
                  }
                });
                $(this).remove();
              });
              if (lockEnabled.left.length > 0) {
                $(datatable.wrap).addClass('m-datatable--lock');
                $(lockLeft).appendTo(tablePart);
              }
              if (lockEnabled.left.length > 0 || lockEnabled.right.length > 0) {
                $(lockScroll).appendTo(tablePart);
              }
              if (lockEnabled.right.length > 0) {
                $(datatable.wrap).addClass('m-datatable--lock');
                $(lockRight).appendTo(tablePart);
              }
            };
            $(datatable.table).find('thead,tbody,tfoot').each(function() {
              var tablePart = this;
              if ($(this).find('.m-datatable__lock').length === 0) {
                $(this).ready(function() {
                  enableLock(tablePart);
                });
              }
            });
          },
          lockEnabledColumns: function() {
            var screen = $(window).width();
            var columns = options.columns;
            var enabled = {left: [], right: []};
            $.each(columns, function(i, column) {
              if (typeof column.locked !== 'undefined') {
                if (typeof column.locked.left !== 'undefined') {
                  if (mUtil.getBreakpoint(column.locked.left) <= screen) {
                    enabled['left'].push(column.locked.left);
                  }
                }
                if (typeof column.locked.right !== 'undefined') {
                  if (mUtil.getBreakpoint(column.locked.right) <= screen) {
                    enabled['right'].push(column.locked.right);
                  }
                }
              }
            });
            return enabled;
          },
        };
        lock.init();
        return lock;
      },
      fullRender: function() {
        dt.spinnerCallback(true);
        $(datatable.wrap).removeClass('m-datatable--loaded');
        if (dt.isLocked()) {
          var content = $(datatable.oriTable).children();
          if (content.length > 0) {
            $(datatable.wrap).removeClass('m-datatable--lock');
            $(datatable.table).empty().html(content);
            datatable.oriTable = null;
            dt.setupCellField.call();
            API.redraw();
          }
          dt.updateTableComponents.call();
        }
        dt.insertData();
      },
      afterRender: function(e, args) {
        if (args.table === $(datatable.table).attr('id')) {
          if (!dt.isLocked()) API.redraw();
          $(datatable).ready(function() {
            $(datatable.tableBody).
                find('.m-datatable__row:even').
                addClass('m-datatable__row--even');
            if (dt.isLocked()) API.redraw();
            $(datatable.tableBody).css('visibility', '');
            $(datatable.wrap).addClass('m-datatable--loaded');
            dt.scrollbar.call();
            dt.spinnerCallback(false);
          });
        }
      },
      setupHover: function() {
        $(datatable.tableBody).
            find('.m-datatable__cell').
            off('mouseenter', 'mouseleave').
            on('mouseenter', function() {
              var row = $(this).
                  closest('.m-datatable__row').
                  addClass('m-datatable__row--hover');
              var index = $(row).index() + 1;
              $(row).
                  closest('.m-datatable__lock').
                  parent().
                  find('.m-datatable__row:nth-child(' + index + ')').
                  addClass('m-datatable__row--hover');
            }).
            on('mouseleave', function() {
              var row = $(this).
                  closest('.m-datatable__row').
                  removeClass('m-datatable__row--hover');
              var index = $(row).index() + 1;
              $(row).
                  closest('.m-datatable__lock').
                  parent().
                  find('.m-datatable__row:nth-child(' + index + ')').
                  removeClass('m-datatable__row--hover');
            });
      },
      adjustLockContainer: function() {
        if (!dt.isLocked()) return 0;
        var containerWidth = $(datatable.tableHead).width();
        var lockLeft = $(datatable.tableHead).
            find('.m-datatable__lock--left').
            width();
        var lockRight = $(datatable.tableHead).
            find('.m-datatable__lock--right').
            width();
        if (typeof lockLeft === 'undefined') lockLeft = 0;
        if (typeof lockRight === 'undefined') lockRight = 0;
        var lockScroll = Math.floor(containerWidth - lockLeft - lockRight);
        $(datatable.table).
            find('.m-datatable__lock--scroll').
            css('width', lockScroll);
        return lockScroll;
      },
      dragResize: function() {
        var pressed = false;
        var start = undefined;
        var startX, startWidth;
        $(datatable.tableHead).
            find('.m-datatable__cell').
            mousedown(function(e) {
              start = $(this);
              pressed = true;
              startX = e.pageX;
              startWidth = $(this).width();
              $(start).addClass('m-datatable__cell--resizing');
            }).
            mousemove(function(e) {
              if (pressed) {
                var i = $(start).index();
                var tableBody = $(datatable.tableBody);
                var ifLocked = $(start).closest('.m-datatable__lock');
                if (ifLocked) {
                  var lockedIndex = $(ifLocked).index();
                  tableBody = $(datatable.tableBody).
                      find('.m-datatable__lock').
                      eq(lockedIndex);
                }
                $(tableBody).find('.m-datatable__row').each(function(tri, tr) {
                  $(tr).
                      find('.m-datatable__cell').
                      eq(i).
                      width(startWidth + (e.pageX - startX)).
                      children().
                      width(startWidth + (e.pageX - startX));
                });
                $(start).children().width(startWidth + (e.pageX - startX));
              }
            }).
            mouseup(function() {
              $(start).removeClass('m-datatable__cell--resizing');
              pressed = false;
            });
        $(document).mouseup(function() {
          $(start).removeClass('m-datatable__cell--resizing');
          pressed = false;
        });
      },
      initHeight: function() {
        if (options.layout.height && options.layout.scroll) {
          var theadHeight = $(datatable.tableHead).
              find('.m-datatable__row').
              height();
          var tfootHeight = $(datatable.tableFoot).
              find('.m-datatable__row').
              height();
          var bodyHeight = options.layout.height;
          if (typeof theadHeight !== 'undefined') bodyHeight -= theadHeight;
          if (typeof tfootHeight !== 'undefined') bodyHeight -= tfootHeight;
          $(datatable.tableBody).css('max-height', bodyHeight);
        }
      },
      setupBaseDOM: function() {
        datatable.old = $(datatable).clone();
        if ($(datatable).prop('tagName') === 'TABLE') {
          datatable.table = $(datatable).
              removeClass('m-datatable').
              addClass('m-datatable__table');
          if ($(datatable.table).parents('.m-datatable').length === 0) {
            datatable.table.wrap($('<div/>').
                addClass('m-datatable').
                addClass('m-datatable--' + options.layout.theme));
            datatable.wrap = $(datatable.table).parent();
          }
        } else {
          datatable.wrap = $(datatable).
              addClass('m-datatable').
              addClass('m-datatable--' + options.layout.theme);
          datatable.table = $('<table/>').
              addClass('m-datatable__table').
              appendTo(datatable);
        }
        if (typeof options.layout.class !== 'undefined') {
          $(datatable.wrap).addClass(options.layout.class);
        }
        $(datatable.table).
            removeClass('m-datatable--destroyed').
            css('display', 'block').
            attr('id', mUtil.getUniqueID('m-datatable--'));
        if (API.getOption('layout.height')) $(datatable.table).
            css('max-height', API.getOption('layout.height'));
        if (options.data.type === null) {
          $(datatable.table).css('width', '').css('display', '');
        }
        datatable.tableHead = $(datatable.table).find('thead');
        if ($(datatable.tableHead).length === 0) {
          datatable.tableHead = $('<thead/>').prependTo(datatable.table);
        }
        datatable.tableBody = $(datatable.table).find('tbody');
        if ($(datatable.tableBody).length === 0) {
          datatable.tableBody = $('<tbody/>').appendTo(datatable.table);
        }
        if (typeof options.layout.footer !== 'undefined' &&
            options.layout.footer) {
          datatable.tableFoot = $(datatable.table).find('tfoot');
          if ($(datatable.tableFoot).length === 0) {
            datatable.tableFoot = $('<tfoot/>').appendTo(datatable.table);
          }
        }
      },
      setupCellField: function(tableParts) {
        if (typeof tableParts === 'undefined') tableParts = $(datatable.table).
            children();
        var columns = options.columns;
        $.each(tableParts, function(part, tablePart) {
          $(tablePart).find('.m-datatable__row').each(function(tri, tr) {
            $(tr).find('.m-datatable__cell').each(function(tdi, td) {
              if (typeof columns[tdi] !== 'undefined') {
                $(td).data(columns[tdi]);
              }
            });
          });
        });
      },
      setupTemplateCell: function(tablePart) {
        if (typeof tablePart === 'undefined') tablePart = datatable.tableBody;
        var columns = options.columns;
        $(tablePart).find('.m-datatable__row').each(function(tri, tr) {
          var obj = $(tr).data('obj') || {};
          var rowCallback = API.getOption('rows.callback');
          if (typeof rowCallback === 'function') {
            rowCallback(tr, obj, tri);
          }
          obj['getIndex'] = function() {
            return tri;
          };
          obj['getDatatable'] = function() {
            return datatable;
          };
          if (typeof obj === 'undefined') {
            obj = {};
            $(tr).find('.m-datatable__cell').each(function(tdi, td) {
              var column = $.grep(columns, function(n, i) {
                return $(td).data('field') === n.field;
              })[0];
              if (typeof column !== 'undefined') {
                obj[column['field']] = $(td).text();
              }
            });
          }
          $(tr).find('.m-datatable__cell').each(function(tdi, td) {
            var column = $.grep(columns, function(n, i) {
              return $(td).data('field') === n.field;
            })[0];
            if (typeof column !== 'undefined') {
              if (typeof column.template !== 'undefined') {
                var finalValue = '';
                if (typeof column.template === 'string') {
                  finalValue = dt.dataPlaceholder(column.template, obj);
                }
                if (typeof column.template === 'function') {
                  finalValue = column.template(obj);
                }
                var span = $('<span/>').append(finalValue);
                $(td).html(span);
                if (typeof column.overflow !== 'undefined') {
                  $(span).css('overflow', column.overflow);
                }
              }
            }
          });
        });
      },
      setupSystemColumn: function() {
        datatable.dataSet = datatable.dataSet || [];
        if (datatable.dataSet.length === 0) return;
        var columns = options.columns;
        $(datatable.tableBody).
            find('.m-datatable__row').
            each(function(tri, tr) {
              $(tr).find('.m-datatable__cell').each(function(tdi, td) {
                var column = $.grep(columns, function(n, i) {
                  return $(td).data('field') === n.field;
                })[0];
                if (typeof column !== 'undefined') {
                  var value = $(td).text();
                  if (typeof column.selector !== 'undefined' &&
                      column.selector !== false) {
                    if ($(td).find('.m-checkbox [type="checkbox"]').length >
                        0) return;
                    $(td).addClass('m-datatable__cell--check');
                    var chk = $('<label/>').
                        addClass('m-checkbox m-checkbox--single').
                        append($('<input/>').
                            attr('type', 'checkbox').
                            attr('value', value).
                            on('click', function() {
                              if ($(this).is(':checked')) {
                                API.setActive(this);
                              } else {
                                API.setInactive(this);
                              }
                            })).
                        append($('<span/>'));
                    if (typeof column.selector.class !== 'undefined') {
                      $(chk).addClass(column.selector.class);
                    }
                    $(td).children().html(chk);
                  }
                  if (typeof column.subtable !== 'undefined' &&
                      column.subtable) {
                    if ($(td).find('.m-datatable__toggle-subtable').length >
                        0) return;
                    $(td).
                        children().
                        html($('<a/>').
                            addClass('m-datatable__toggle-subtable').
                            attr('href', '#').
                            attr('data-value', value).
                            append($('<i/>').
                                addClass(API.getOption(
                                    'layout.icons.rowDetail.collapse'))));
                  }
                }
              });
            });
        var initCheckbox = function(tr) {
          var column = $.grep(columns, function(n, i) {
            return typeof n.selector !== 'undefined' && n.selector !== false;
          })[0];
          if (typeof column !== 'undefined') {
            if (typeof column.selector !== 'undefined' &&
                column.selector !== false) {
              var td = $(tr).find('[data-field="' + column.field + '"]');
              if ($(td).find('.m-checkbox [type="checkbox"]').length >
                  0) return;
              $(td).addClass('m-datatable__cell--check');
              var chk = $('<label/>').
                  addClass('m-checkbox m-checkbox--single m-checkbox--all').
                  append($('<input/>').
                      attr('type', 'checkbox').
                      on('click', function() {
                        if ($(this).is(':checked')) {
                          API.setActiveAll(true);
                        } else {
                          API.setActiveAll(false);
                        }
                      })).
                  append($('<span/>'));
              if (typeof column.selector.class !== 'undefined') {
                $(chk).addClass(column.selector.class);
              }
              $(td).children().html(chk);
            }
          }
        };
        if (typeof options.layout.header !== 'undefined' &&
            options.layout.header === true) {
          initCheckbox(
              $(datatable.tableHead).find('.m-datatable__row').first());
        }
        if (typeof options.layout.footer !== 'undefined' &&
            options.layout.footer === true) {
          initCheckbox(
              $(datatable.tableFoot).find('.m-datatable__row').first());
        }
      },
      adjustCellsWidth: function() {
        var containerWidth = $(datatable.tableHead).width();
        var sortOffset = 20;
        var columns = dt.getOneRow(datatable.tableHead, 1).length;
        if (columns > 0) {
          containerWidth = containerWidth - (sortOffset * columns);
          var minWidth = Math.floor(containerWidth / columns);
          if (minWidth <= dt.offset) {
            minWidth = dt.offset;
          }
          $(datatable.table).
              find('.m-datatable__row').
              find('.m-datatable__cell').
              each(function(tdi, td) {
                var width = minWidth;
                var dataWidth = $(td).data('width');
                if (typeof dataWidth !== 'undefined') {
                  width = dataWidth;
                }
                $(td).children().css('width', width);
              });
        }
      },
      adjustCellsHeight: function() {
        $(datatable.table).find('.m-datatable__row');
        $.each($(datatable.table).children(), function(part, tablePart) {
          for (var i = 1; i <= dt.getTotalRows(tablePart); i++) {
            var rows = dt.getOneRow(tablePart, i, false);
            if ($(rows).length > 0) {
              var maxHeight = Math.max.apply(null, $(rows).map(function() {
                return $(this).height();
              }).get());
              $(rows).css('height', Math.ceil(maxHeight));
            }
          }
        });
      },
      setupDOM: function(table) {
        $(table).find('> thead').addClass('m-datatable__head');
        $(table).find('> tbody').addClass('m-datatable__body');
        $(table).find('> tfoot').addClass('m-datatable__foot');
        $(table).find('tr').addClass('m-datatable__row');
        $(table).find('tr > th, tr > td').addClass('m-datatable__cell');
        $(table).find('tr > th, tr > td').each(function(i, td) {
          if ($(td).find('span').length === 0) {
            $(td).wrapInner($('<span/>').width(dt.offset));
          }
        });
      },
      scrollbar: function() {
        var scroll = {
          tableLocked: null,
          mcsOptions: {
            scrollInertia: 0,
            autoDraggerLength: true,
            autoHideScrollbar: true,
            autoExpandScrollbar: false,
            alwaysShowScrollbar: 0,
            mouseWheel: {
              scrollAmount: 120,
              preventDefault: false,
            },
            advanced: {
              updateOnContentResize: true,
              autoExpandHorizontalScroll: true,
            },
            theme: 'minimal-dark',
          },
          init: function() {
            var screen = mUtil.getViewPort().width;
            if (options.layout.scroll) {
              $(datatable.wrap).addClass('m-datatable--scroll');
              var scrollable = $(datatable.tableBody).
                  find('.m-datatable__lock--scroll');
              if ($(scrollable).length > 0) {
                scroll.scrollHead = $(datatable.tableHead).
                    find('> .m-datatable__lock--scroll > .m-datatable__row');
                scroll.scrollFoot = $(datatable.tableFoot).
                    find('> .m-datatable__lock--scroll > .m-datatable__row');
                scroll.tableLocked = $(datatable.tableBody).
                    find('.m-datatable__lock:not(.m-datatable__lock--scroll)');
                if (screen > mUtil.getBreakpoint('lg')) {
                  scroll.mCustomScrollbar(scrollable);
                } else {
                  scroll.defaultScrollbar(scrollable);
                }
              } else {
                scroll.scrollHead = $(datatable.tableHead).
                    find('> .m-datatable__row');
                scroll.scrollFoot = $(datatable.tableFoot).
                    find('> .m-datatable__row');
                if (screen > mUtil.getBreakpoint('lg')) {
                  scroll.mCustomScrollbar(datatable.tableBody);
                } else {
                  scroll.defaultScrollbar(datatable.tableBody);
                }
              }
            } else {
              $(datatable.table).
                  css('height', 'auto').
                  css('overflow-x', 'auto');
            }
          },
          defaultScrollbar: function(scrollable) {
            $(scrollable).
                css('overflow', 'auto').
                css('max-height', API.getOption('layout.height')).
                on('scroll', scroll.onScrolling);
          },
          onScrolling: function(e) {
            var left = $(this).scrollLeft();
            var top = $(this).scrollTop();
            $(scroll.scrollHead).css('left', -left);
            $(scroll.scrollFoot).css('left', -left);
            $(scroll.tableLocked).each(function(i, table) {
              $(table).css('top', -top);
            });
          },
          mCustomScrollbar: function(scrollable) {
            var height = API.getOption('layout.height');
            var axis = 'xy';
            if (height === null) {
              axis = 'x';
            }
            var mcsOptions = $.extend({}, scroll.mcsOptions, {
              axis: axis,
              setHeight: $(datatable.tableBody).height(),
              callbacks: {
                whileScrolling: function() {
                  var mcs = this.mcs;
                  $(scroll.scrollHead).css('left', mcs.left);
                  $(scroll.scrollFoot).css('left', mcs.left);
                  $(scroll.tableLocked).each(function(i, table) {
                    $(table).css('top', mcs.top);
                  });
                },
              },
            });
            if (API.getOption('layout.smoothScroll.scrollbarShown') === true) {
              $(scrollable).attr('data-scrollbar-shown', 'true');
            }
            dt.mCustomScrollbar(scrollable, mcsOptions);
            $(scrollable).mCustomScrollbar('scrollTo', 'top');
          },
        };
        scroll.init();
        return scroll;
      },
      mCustomScrollbar: function(element, options) {
        $(datatable.tableBody).css('overflow', '');
        if ($(element).find('.mCustomScrollbar').length === 0) {
          if ($(datatable.tableBody).hasClass('mCustomScrollbar')) {
            $(datatable.tableBody).mCustomScrollbar('destroy');
          }
          $(element).mCustomScrollbar(options);
        }
      },
      setHeadTitle: function(tablePart) {
        if (typeof tablePart === 'undefined') tablePart = datatable.tableHead;
        var columns = options.columns;
        var row = $(tablePart).find('.m-datatable__row');
        var ths = $(tablePart).find('.m-datatable__cell');
        if ($(row).length === 0) {
          row = $('<tr/>').appendTo(tablePart);
        }
        $.each(columns, function(i, column) {
          var th = $(ths).eq(i);
          if ($(th).length === 0) {
            th = $('<th/>').appendTo(row);
          }
          if (typeof column['title'] !== 'undefined') {
            $(th).
                html(column['title']).
                attr('data-field', column.field).
                data(column);
          }
          if (typeof column.textAlign !== 'undefined') {
            var align = typeof datatable.textAlign[column.textAlign] !==
            'undefined' ? datatable.textAlign[column.textAlign] : '';
            $(th).addClass(align);
          }
        });
        dt.setupDOM(tablePart);
      },
      dataRender: function(action) {
        $(datatable.table).
            siblings('.m-datatable__pager').
            removeClass('m-datatable--paging-loaded');
        var buildMeta = function() {
          datatable.dataSet = datatable.dataSet || [];
          dt.localDataUpdate();
          var meta = API.getDataSourceParam('pagination');
          if (meta.perpage === 0) {
            meta.perpage = options.data.pageSize || 10;
          }
          meta.total = datatable.dataSet.length;
          var start = Math.max(meta.perpage * (meta.page - 1), 0);
          var end = Math.min(start + meta.perpage, meta.total);
          datatable.dataSet = $(datatable.dataSet).slice(start, end);
          return meta;
        };
        var afterGetData = function(result) {
          $(datatable.wrap).removeClass('m-datatable--error');
          if (options.pagination) {
            if (options.data.serverPaging && options.data.type !== 'local') {
              dt.paging(dt.getObject('meta', result || null));
            } else {
              dt.paging(buildMeta(), function(ctx, meta) {
                if (!$(ctx.pager).hasClass('m-datatable--paging-loaded')) {
                  $(ctx.pager).remove();
                  ctx.init(meta);
                }
                $(ctx.pager).off().on('m-datatable--on-goto-page', function(e) {
                  $(ctx.pager).remove();
                  ctx.init(meta);
                });
                var start = Math.max(meta.perpage * (meta.page - 1), 0);
                var end = Math.min(start + meta.perpage, meta.total);
                dt.localDataUpdate();
                datatable.dataSet = $(datatable.dataSet).slice(start, end);
                dt.insertData();
              });
            }
          } else {
            dt.localDataUpdate();
          }
          dt.insertData();
        };
        if (options.data.type === 'local'
            || typeof options.data.source.read === 'undefined' &&
            datatable.dataSet !== null
            || options.data.serverSorting === false && action === 'sort'
        ) {
          afterGetData();
          return;
        }
        dt.getData().done(afterGetData);
      },
      insertData: function() {
        datatable.dataSet = datatable.dataSet || [];
        var params = API.getDataSourceParam();
        var tableBody = $('<tbody/>').
            addClass('m-datatable__body').
            css('visibility', 'hidden');
        $.each(datatable.dataSet, function(i, row) {
          var tr = $('<tr/>').attr('data-row', i).data('obj', row);
          var idx = 0;
          var tdArr = [];
          var colLength = options.columns.length;
          for (var a = 0; a < colLength; a += 1) {
            var column = options.columns[a];
            var classes = [];
            if (params.sort.field === column.field) {
              classes.push('m-datatable__cell--sorted');
            }
            if (typeof column.textAlign !== 'undefined') {
              var align = typeof datatable.textAlign[column.textAlign] !==
              'undefined' ? datatable.textAlign[column.textAlign] : '';
              classes.push(align);
            }
            tdArr[idx++] = '<td data-field="' + column.field + '"';
            tdArr[idx++] = ' class="' + classes.join(' ') + '"';
            tdArr[idx++] = '>';
            tdArr[idx++] = row[column.field];
            tdArr[idx++] = '</td>';
          }
          $(tr).append(tdArr.join(''));
          $(tableBody).append(tr);
        });
        if (datatable.dataSet.length === 0) {
          $('<span/>').
              addClass('m-datatable--error').
              width('100%').
              html(API.getOption('translate.records.noRecords')).
              appendTo(tableBody);
          $(datatable.wrap).addClass('m-datatable--error');
        }
        $(datatable.tableBody).replaceWith(tableBody);
        datatable.tableBody = tableBody;
        dt.setupDOM(datatable.table);
        dt.setupCellField([datatable.tableBody]);
        dt.setupTemplateCell(datatable.tableBody);
        dt.layoutUpdate();
      },
      updateTableComponents: function() {
        datatable.tableHead = $(datatable.table).children('thead');
        datatable.tableBody = $(datatable.table).children('tbody');
        datatable.tableFoot = $(datatable.table).children('tfoot');
      },
      getData: function() {
        var params = {
          dataType: 'json',
          method: 'GET',
          data: {},
          timeout: 30000,
        };
        if (options.data.type === 'local') {
          params.url = options.data.source;
        }
        if (options.data.type === 'remote') {
          params.url = API.getOption('data.source.read.url');
          if (typeof params.url !== 'string') params.url = API.getOption(
              'data.source.read');
          if (typeof params.url !== 'string') params.url = API.getOption(
              'data.source');
          params.headers = API.getOption('data.source.read.headers');
          params.data['datatable'] = API.getDataSourceParam();
          params.method = API.getOption('data.source.read.method') || 'POST';
          if (!API.getOption('data.serverPaging')) {
            delete params.data['datatable']['pagination'];
          }
          if (!API.getOption('data.serverSorting')) {
            delete params.data['datatable']['sort'];
          }
        }
        return $.ajax(params).done(function(data, textStatus, jqXHR) {
          datatable.dataSet = datatable.originalDataSet
              = dt.dataMapCallback(data);
          $(datatable).
              trigger('m-datatable--on-ajax-done', [datatable.dataSet]);
        }).fail(function(jqXHR, textStatus, errorThrown) {
          $(datatable).trigger('m-datatable--on-ajax-fail', [jqXHR]);
          $('<span/>').
              addClass('m-datatable--error').
              width('100%').
              html(API.getOption('translate.records.noRecords')).
              appendTo(datatable.tableBody);
          $(datatable).addClass('m-datatable--error');
        }).always(function() {
        });
      },
      paging: function(meta, callback) {
        var pg = {
          meta: null,
          pager: null,
          paginateEvent: null,
          pagerLayout: {pagination: null, info: null},
          callback: null,
          init: function(meta) {
            pg.meta = meta;
            pg.meta.pages = Math.max(Math.ceil(pg.meta.total / pg.meta.perpage),
                1);
            if (pg.meta.page > pg.meta.pages) pg.meta.page = pg.meta.pages;
            pg.paginateEvent = dt.getTablePrefix();
            pg.pager = $(datatable.table).siblings('.m-datatable__pager');
            if ($(pg.pager).hasClass('m-datatable--paging-loaded')) return;
            $(pg.pager).remove();
            if (pg.meta.pages === 0) return;
            API.setDataSourceParam('pagination', pg.meta);
            pg.callback = pg.serverCallback;
            if (typeof callback === 'function') pg.callback = callback;
            pg.addPaginateEvent();
            pg.populate();
            pg.meta.page = Math.max(pg.meta.page || 1, pg.meta.page);
            $(datatable).trigger(pg.paginateEvent, pg.meta);
            pg.pagingBreakpoint.call();
            $(window).resize(pg.pagingBreakpoint);
          },
          serverCallback: function(ctx, meta) {
            dt.dataRender();
          },
          populate: function() {
            var icons = API.getOption('layout.icons.pagination');
            var title = API.getOption(
                'translate.toolbar.pagination.items.default');
            pg.pager = $('<div/>').
                addClass(
                    'm-datatable__pager m-datatable--paging-loaded clearfix');
            var pagerNumber = $('<ul/>').addClass('m-datatable__pager-nav');
            pg.pagerLayout['pagination'] = pagerNumber;
            $('<li/>').
                append($('<a/>').
                    attr('title', title.first).
                    addClass(
                        'm-datatable__pager-link m-datatable__pager-link--first').
                    append($('<i/>').addClass(icons.first)).
                    on('click', pg.gotoMorePage).
                    attr('data-page', 1)).
                appendTo(pagerNumber);
            $('<li/>').
                append($('<a/>').
                    attr('title', title.prev).
                    addClass(
                        'm-datatable__pager-link m-datatable__pager-link--prev').
                    append($('<i/>').addClass(icons.prev)).
                    on('click', pg.gotoMorePage)).
                appendTo(pagerNumber);
            $('<li/>').
                append($('<a/>').
                    attr('title', title.more).
                    addClass(
                        'm-datatable__pager-link m-datatable__pager-link--more-prev').
                    html($('<i/>').addClass(icons.more)).
                    on('click', pg.gotoMorePage)).
                appendTo(pagerNumber);
            $('<li/>').
                append($('<input/>').
                    attr('type', 'text').
                    addClass('m-pager-input form-control').
                    attr('title', title.input).
                    on('keyup', function() {
                      $(this).attr('data-page', Math.abs($(this).val()));
                    }).
                    on('keypress', function(e) {
                      if (e.which === 13) pg.gotoMorePage(e);
                    })).
                appendTo(pagerNumber);
            var pagesNumber = API.getOption(
                'toolbar.items.pagination.pages.desktop.pagesNumber');
            var end = Math.ceil(pg.meta.page / pagesNumber) * pagesNumber;
            var start = end - pagesNumber;
            if (end > pg.meta.pages) {
              end = pg.meta.pages;
            }
            for (var x = start; x < end; x++) {
              var pageNumber = x + 1;
              $('<li/>').
                  append($('<a/>').
                      addClass(
                          'm-datatable__pager-link m-datatable__pager-link-number').
                      text(pageNumber).
                      attr('data-page', pageNumber).
                      attr('title', pageNumber).
                      on('click', pg.gotoPage)).
                  appendTo(pagerNumber);
            }
            $('<li/>').
                append($('<a/>').
                    attr('title', title.more).
                    addClass(
                        'm-datatable__pager-link m-datatable__pager-link--more-next').
                    html($('<i/>').addClass(icons.more)).
                    on('click', pg.gotoMorePage)).
                appendTo(pagerNumber);
            $('<li/>').
                append($('<a/>').
                    attr('title', title.next).
                    addClass(
                        'm-datatable__pager-link m-datatable__pager-link--next').
                    append($('<i/>').addClass(icons.next)).
                    on('click', pg.gotoMorePage)).
                appendTo(pagerNumber);
            $('<li/>').
                append($('<a/>').
                    attr('title', title.last).
                    addClass(
                        'm-datatable__pager-link m-datatable__pager-link--last').
                    append($('<i/>').addClass(icons.last)).
                    on('click', pg.gotoMorePage).
                    attr('data-page', pg.meta.pages)).
                appendTo(pagerNumber);
            if (API.getOption('toolbar.items.info')) {
              pg.pagerLayout['info'] = $('<div/>').
                  addClass('m-datatable__pager-info').
                  append($('<span/>').addClass('m-datatable__pager-detail'));
            }
            $.each(API.getOption('toolbar.layout'), function(i, layout) {
              $(pg.pagerLayout[layout]).appendTo(pg.pager);
            });
            var pageSizeSelect = $('<select/>').
                addClass('selectpicker m-datatable__pager-size').
                attr('title', API.getOption(
                    'translate.toolbar.pagination.items.default.select')).
                attr('data-width', '70px').
                val(pg.meta.perpage).
                on('change', pg.updatePerpage).
                prependTo(pg.pagerLayout['info']);
            $.each(API.getOption('toolbar.items.pagination.pageSizeSelect'),
                function(i, size) {
                  var display = size;
                  if (size === -1) display = 'All';
                  $('<option/>').
                      attr('value', size).
                      html(display).
                      appendTo(pageSizeSelect);
                });
            $(datatable).ready(function() {
              $('.selectpicker').
                  selectpicker().
                  siblings('.dropdown-toggle').
                  attr('title', API.getOption(
                      'translate.toolbar.pagination.items.default.select'));
            });
            pg.paste();
          },
          paste: function() {
            $.each($.unique(API.getOption('toolbar.placement')),
                function(i, position) {
                  if (position === 'bottom') {
                    $(pg.pager).clone(true).insertAfter(datatable.table);
                  }
                  if (position === 'top') {
                    $(pg.pager).
                        clone(true).
                        addClass('m-datatable__pager--top').
                        insertBefore(datatable.table);
                  }
                });
          },
          gotoMorePage: function(e) {
            e.preventDefault();
            if ($(this).attr('disabled') === 'disabled') return false;
            var page = $(this).attr('data-page');
            if (typeof page === 'undefined') {
              page = $(e.target).attr('data-page');
            }
            pg.openPage(parseInt(page));
            return false;
          },
          gotoPage: function(e) {
            e.preventDefault();
            if ($(this).hasClass('m-datatable__pager-link--active')) return;
            pg.openPage(parseInt($(this).data('page')));
          },
          openPage: function(page) {
            pg.meta.page = parseInt(page);
            $(datatable).trigger(pg.paginateEvent, pg.meta);
            pg.callback(pg, pg.meta);
            $(pg.pager).trigger('m-datatable--on-goto-page', pg.meta);
          },
          updatePerpage: function(e) {
            e.preventDefault();
            if (API.getOption('layout.height') === null) {
              $('html, body').animate({scrollTop: $(datatable).position().top});
            }
            pg.pager = $(datatable.table).
                siblings('.m-datatable__pager').
                removeClass('m-datatable--paging-loaded');
            if (e.originalEvent) {
              pg.meta.perpage = parseInt($(this).val());
            }
            $(pg.pager).
                find('select.m-datatable__pager-size').
                val(pg.meta.perpage).
                attr('data-selected', pg.meta.perpage);
            API.setDataSourceParam('pagination', pg.meta);
            $(pg.pager).trigger('m-datatable--on-update-perpage', pg.meta);
            $(datatable).trigger(pg.paginateEvent, pg.meta);
            pg.callback(pg, pg.meta);
            pg.updateInfo.call();
          },
          addPaginateEvent: function(e) {
            $(datatable).
                off(pg.paginateEvent).
                on(pg.paginateEvent, function(e, meta) {
                  dt.spinnerCallback(true);
                  pg.pager = $(datatable.table).siblings('.m-datatable__pager');
                  var pagerNumber = $(pg.pager).find('.m-datatable__pager-nav');
                  $(pagerNumber).
                      find('.m-datatable__pager-link--active').
                      removeClass('m-datatable__pager-link--active');
                  $(pagerNumber).
                      find('.m-datatable__pager-link-number[data-page="' +
                          meta.page + '"]').
                      addClass('m-datatable__pager-link--active');
                  $(pagerNumber).
                      find('.m-datatable__pager-link--prev').
                      attr('data-page', Math.max(meta.page - 1, 1));
                  $(pagerNumber).
                      find('.m-datatable__pager-link--next').
                      attr('data-page', Math.min(meta.page + 1, meta.pages));
                  $(pg.pager).each(function() {
                    $(this).
                        find('.m-pager-input[type="text"]').
                        prop('value', meta.page);
                  });
                  $(pg.pager).find('.m-datatable__pager-nav').show();
                  if (meta.pages <= 1) {
                    $(pg.pager).find('.m-datatable__pager-nav').hide();
                  }
                  API.setDataSourceParam('pagination', pg.meta);
                  $(pg.pager).
                      find('select.m-datatable__pager-size').
                      val(meta.perpage).
                      attr('data-selected', meta.perpage);
                  $(datatable.table).
                      find('.m-checkbox > [type="checkbox"]').
                      prop('checked', false);
                  $(datatable.table).
                      find('.m-datatable__row--active').
                      removeClass('m-datatable__row--active');
                  pg.updateInfo.call();
                  pg.pagingBreakpoint.call();
                });
          },
          updateInfo: function() {
            var start = Math.max(pg.meta.perpage * (pg.meta.page - 1) + 1, 1);
            var end = Math.min(start + pg.meta.perpage - 1, pg.meta.total);
            $(pg.pager).
                find('.m-datatable__pager-info').
                find('.m-datatable__pager-detail').
                html(dt.dataPlaceholder(
                    API.getOption('translate.toolbar.pagination.items.info'), {
                      start: start,
                      end: pg.meta.perpage === -1 ? pg.meta.total : end,
                      pageSize: pg.meta.perpage === -1 ||
                      pg.meta.perpage >= pg.meta.total
                          ? pg.meta.total
                          : pg.meta.perpage,
                      total: pg.meta.total,
                    }));
          },
          pagingBreakpoint: function() {
            var pagerNumber = $(datatable.table).
                siblings('.m-datatable__pager').
                find('.m-datatable__pager-nav');
            if ($(pagerNumber).length === 0) return;
            var currentPage = API.getCurrentPage();
            var pagerInput = $(pagerNumber).
                find('.m-pager-input').
                closest('li');
            $(pagerNumber).find('li').show();
            $.each(API.getOption('toolbar.items.pagination.pages'),
                function(mode, option) {
                  if (mUtil.isInResponsiveRange(mode)) {
                    switch (mode) {
                      case 'desktop':
                      case 'tablet':
                        var end = Math.ceil(currentPage / option.pagesNumber) *
                            option.pagesNumber;
                        var start = end - option.pagesNumber;
                        $(pagerInput).hide();
                        pg.meta = API.getDataSourceParam('pagination');
                        pg.paginationUpdate();
                        break;
                      case 'mobile':
                        $(pagerInput).show();
                        $(pagerNumber).
                            find('.m-datatable__pager-link--more-prev').
                            closest('li').
                            hide();
                        $(pagerNumber).
                            find('.m-datatable__pager-link--more-next').
                            closest('li').
                            hide();
                        $(pagerNumber).
                            find('.m-datatable__pager-link-number').
                            closest('li').
                            hide();
                        break;
                    }
                    return false;
                  }
                });
          },
          paginationUpdate: function() {
            var pager = $(datatable.table).
                    siblings('.m-datatable__pager').
                    find('.m-datatable__pager-nav'),
                pagerMorePrev = $(pager).
                    find('.m-datatable__pager-link--more-prev'),
                pagerMoreNext = $(pager).
                    find('.m-datatable__pager-link--more-next'),
                pagerFirst = $(pager).find('.m-datatable__pager-link--first'),
                pagerPrev = $(pager).find('.m-datatable__pager-link--prev'),
                pagerNext = $(pager).find('.m-datatable__pager-link--next'),
                pagerLast = $(pager).find('.m-datatable__pager-link--last');
            var pagerNumber = $(pager).find('.m-datatable__pager-link-number');
            var morePrevPage = Math.max($(pagerNumber).first().data('page') - 1,
                1);
            $(pagerMorePrev).each(function(i, prev) {
              $(prev).attr('data-page', morePrevPage);
            });
            if (morePrevPage === 1) {
              $(pagerMorePrev).parent().hide();
            } else {
              $(pagerMorePrev).parent().show();
            }
            var moreNextPage = Math.min($(pagerNumber).last().data('page') + 1,
                pg.meta.pages);
            $(pagerMoreNext).each(function(i, prev) {
              $(pagerMoreNext).attr('data-page', moreNextPage).show();
            });
            if (moreNextPage === pg.meta.pages
                && moreNextPage === $(pagerNumber).last().data('page')) {
              $(pagerMoreNext).parent().hide();
            } else {
              $(pagerMoreNext).parent().show();
            }
            if (pg.meta.page === 1) {
              $(pagerFirst).
                  attr('disabled', true).
                  addClass('m-datatable__pager-link--disabled');
              $(pagerPrev).
                  attr('disabled', true).
                  addClass('m-datatable__pager-link--disabled');
            } else {
              $(pagerFirst).
                  removeAttr('disabled').
                  removeClass('m-datatable__pager-link--disabled');
              $(pagerPrev).
                  removeAttr('disabled').
                  removeClass('m-datatable__pager-link--disabled');
            }
            if (pg.meta.page === pg.meta.pages) {
              $(pagerNext).
                  attr('disabled', true).
                  addClass('m-datatable__pager-link--disabled');
              $(pagerLast).
                  attr('disabled', true).
                  addClass('m-datatable__pager-link--disabled');
            } else {
              $(pagerNext).
                  removeAttr('disabled').
                  removeClass('m-datatable__pager-link--disabled');
              $(pagerLast).
                  removeAttr('disabled').
                  removeClass('m-datatable__pager-link--disabled');
            }
            var nav = API.getOption('toolbar.items.pagination.navigation');
            if (!nav.first) $(pagerFirst).remove();
            if (!nav.prev) $(pagerPrev).remove();
            if (!nav.next) $(pagerNext).remove();
            if (!nav.last) $(pagerLast).remove();
          },
        };
        pg.init(meta);
        return pg;
      },
      columnHide: function() {
        var screen = mUtil.getViewPort().width;
        $.each(options.columns, function(i, column) {
          if (typeof column.responsive !== 'undefined') {
            var field = column.field;
            var tds = $.grep($(datatable.table).find('.m-datatable__cell'), function(n, i) {
              return field === $(n).data('field');
            });
            if (mUtil.getBreakpoint(column.responsive.hidden) >= screen) {
              $(tds).hide();
            } else {
              $(tds).show();
            }
            if (mUtil.getBreakpoint(column.responsive.visible) <= screen) {
              $(tds).show();
            } else {
              $(tds).hide();
            }
          }
        });
      },
      setupSubDatatable: function() {
        var detailCallback = API.getOption('detail.content');
        if (typeof detailCallback === 'function') {
          if ($(datatable.table).find('.m-datatable__detail').length >
              0) return;
          $(datatable.wrap).addClass('m-datatable--subtable');
          options.columns[0]['subtable'] = true;
          var toggleSubTable = function(e) {
            e.preventDefault();
            var parentRow = $(this).closest('.m-datatable__row');
            var detailRow = $(parentRow).next().toggle();
            var primaryKey = $(this).
                closest('[data-field]:first-child').
                find('.m-datatable__toggle-subtable').
                data('value');
            var icon = $(this).find('i').removeAttr('class');
            if ($(detailRow).is(':hidden')) {
              $(icon).
                  addClass(API.getOption('layout.icons.rowDetail.collapse'));
              $(parentRow).removeClass('m-datatable__row--detail-expanded');
              $(datatable).
                  trigger('m-datatable--on-collapse-detail', [parentRow]);
            } else {
              $(icon).addClass(API.getOption('layout.icons.rowDetail.expand'));
              $(parentRow).addClass('m-datatable__row--detail-expanded');
              $(datatable).
                  trigger('m-datatable--on-expand-detail', [parentRow]);
              $.map(datatable.dataSet, function(n, i) {
                if (primaryKey === n[options.columns[0].field]) {
                  e.data = n;
                  return true;
                }
                return false;
              });
              e.detailCell = $(detailRow).find('.m-datatable__detail');
              if ($(e.detailCell).find('.m-datatable').length === 0) {
                detailCallback(e);
              }
            }
          };
          var columns = options.columns;
          $(datatable.tableBody).
              find('.m-datatable__row').
              each(function(tri, tr) {
                $(tr).find('.m-datatable__cell').each(function(tdi, td) {
                  var column = $.grep(columns, function(n, i) {
                    return $(td).data('field') === n.field;
                  })[0];
                  if (typeof column !== 'undefined') {
                    var value = $(td).text();
                    if (typeof column.subtable !== 'undefined' &&
                        column.subtable) {
                      if ($(td).find('.m-datatable__toggle-subtable').length >
                          0) return;
                      $(td).
                          children().
                          html($('<a/>').
                              addClass('m-datatable__toggle-subtable').
                              attr('href', '#').
                              attr('data-value', value).
                              attr('title', API.getOption('detail.title')).
                              on('click', toggleSubTable).
                              append($('<i/>').
                                  addClass(API.getOption(
                                      'layout.icons.rowDetail.collapse'))));
                    }
                  }
                });
              });
          $(datatable.tableBody).find('.m-datatable__row').each(function() {
            var detailRow = $('<tr/>').
                addClass('m-datatable__row-detail').
                hide().
                append($('<td/>').
                    addClass('m-datatable__detail').
                    attr('colspan', dt.getTotalColumns()));
            $(this).after(detailRow);
            if ($(this).hasClass('m-datatable__row--even')) {
              $(detailRow).addClass('m-datatable__row-detail--even');
            }
          });
        }
      },
      dataMapCallback: function(raw) {
        var dataSet = raw;
        if (typeof API.getOption('data.source.read.map') === 'function') {
          return API.getOption('data.source.read.map')(raw);
        } else {
          if (typeof raw.data !== 'undefined') {
            dataSet = raw.data;
          }
        }
        return dataSet;
      },
      isSpinning: false,
      spinnerCallback: function(block) {
        if (block) {
          if (!dt.isSpinning) {
            var spinnerOptions = API.getOption('layout.spinner');
            if (spinnerOptions.message === true) {
              spinnerOptions.message = API.getOption(
                  'translate.records.processing');
            }
            dt.isSpinning = true;
            if (typeof mApp !== 'undefined') {
              mApp.block(datatable, spinnerOptions);
            }
          }
        } else {
          dt.isSpinning = false;
          if (typeof mApp !== 'undefined') {
            mApp.unblock(datatable);
          }
        }
      },
      sortCallback: function(data, sort, column) {
        var type = column['type'] || 'string';
        var format = column['format'] || '';
        var field = column['field'];
        if (type === 'date' && typeof moment === 'undefined') {
          throw new Error('Moment.js is required.');
        }
        return $(data).sort(function(a, b) {
          var aField = a[field];
          var bField = b[field];
          switch (type) {
            case 'date':
              var diff = moment(aField, format).diff(moment(bField, format));
              if (sort === 'asc') {
                return diff > 0 ? 1 : diff < 0 ? -1 : 0;
              } else {
                return diff < 0 ? 1 : diff > 0 ? -1 : 0;
              }
              break;
            case 'number':
              if (isNaN(parseFloat(aField)) && aField != null) {
                aField = Number(aField.replace(/[^0-9\.-]+/g, ''));
              }
              if (isNaN(parseFloat(bField)) && bField != null) {
                bField = Number(bField.replace(/[^0-9\.-]+/g, ''));
              }
              aField = parseFloat(aField);
              bField = parseFloat(bField);
              if (sort === 'asc') {
                return aField > bField ? 1 : aField < bField ? -1 : 0;
              } else {
                return aField < bField ? 1 : aField > bField ? -1 : 0;
              }
              break;
            case 'string':
            default:
              if (sort === 'asc') {
                return aField > bField ? 1 : aField < bField ? -1 : 0;
              } else {
                return aField < bField ? 1 : aField > bField ? -1 : 0;
              }
              break;
          }
        });
      },
      log: function(text, obj) {
        if (typeof obj === 'undefined') obj = '';
        if (datatable.debug) {
          console.log(text, obj);
        }
      },
      isLocked: function() {
        return $(datatable.wrap).hasClass('m-datatable--lock') || false;
      },
      replaceTableContent: function(html, tablePart) {
        if (typeof tablePart === 'undefined') tablePart = datatable.tableBody;
        if ($(tablePart).hasClass('mCustomScrollbar')) {
          $(tablePart).find('.mCSB_container').html(html);
        } else {
          $(tablePart).html(html);
        }
      },
      getExtraSpace: function(element) {
        var padding = parseInt($(element).css('paddingRight')) +
            parseInt($(element).css('paddingLeft'));
        var margin = parseInt($(element).css('marginRight')) +
            parseInt($(element).css('marginLeft'));
        var border = Math.ceil(
            $(element).css('border-right-width').replace('px', ''));
        return padding + margin + border;
      },
      dataPlaceholder: function(template, data) {
        var result = template;
        $.each(data, function(key, val) {
          result = result.replace('{{' + key + '}}', val);
        });
        return result;
      },
      getTableId: function(suffix) {
        if (typeof suffix === 'undefined') suffix = '';
        return $(datatable).attr('id') + suffix;
      },
      getTablePrefix: function(suffix) {
        if (typeof suffix !== 'undefined') suffix = '-' + suffix;
        return 'm-datatable__' + dt.getTableId() + '-' + dt.getDepth() + suffix;
      },
      getDepth: function() {
        var depth = 0;
        var table = datatable.table;
        do {
          table = $(table).parents('.m-datatable__table');
          depth++;
        } while ($(table).length > 0);
        return depth;
      },
      stateKeep: function(key, value) {
        key = dt.getTablePrefix(key);
        if (API.getOption('data.saveState') === false) return;
        if (API.getOption('data.saveState.webstorage') && localStorage) {
          localStorage.setItem(key, JSON.stringify(value));
        }
        if (API.getOption('data.saveState.cookie')) {
          Cookies.set(key, JSON.stringify(value));
        }
      },
      stateGet: function(key, defValue) {
        key = dt.getTablePrefix(key);
        if (API.getOption('data.saveState') === false) return;
        var value = null;
        if (API.getOption('data.saveState.webstorage') && localStorage) {
          value = localStorage.getItem(key);
        } else {
          value = Cookies.get(key);
        }
        if (typeof value !== 'undefined' && value !== null) {
          return JSON.parse(value);
        }
      },
      stateUpdate: function(key, value) {
        var ori = dt.stateGet(key);
        if (typeof ori === 'undefined' || ori === null) ori = {};
        dt.stateKeep(key, $.extend({}, ori, value));
      },
      stateRemove: function(key) {
        key = dt.getTablePrefix(key);
        if (localStorage) {
          localStorage.removeItem(key);
        }
        Cookies.remove(key);
      },
      getTotalColumns: function(tablePart) {
        if (typeof tablePart === 'undefined') tablePart = datatable.tableBody;
        return $(tablePart).
            find('.m-datatable__row').
            first().
            find('.m-datatable__cell').length;
      },
      getTotalRows: function(tablePart) {
        if (typeof tablePart === 'undefined') tablePart = datatable.tableBody;
        return $(tablePart).
            find('.m-datatable__row').
            first().
            parent().
            find('.m-datatable__row').length;
      },
      getOneRow: function(tablePart, row, tdOnly) {
        if (typeof tdOnly === 'undefined') tdOnly = true;
        var result = $(tablePart).
            find('.m-datatable__row:not(.m-datatable__row-detail):nth-child(' +
                row + ')');
        if (tdOnly) {
          result = result.find('.m-datatable__cell');
        }
        return result;
      },
      hasOverflowCells: function(element) {
        var children = $(element).
            find('tr:first-child').
            find('.m-datatable__cell');
        var maxWidth = 0;
        if (children.length > 0) {
          $(children).each(function(tdi, td) {
            maxWidth += Math.ceil($(td).innerWidth());
          });
          return maxWidth >= $(element).outerWidth();
        }
        return false;
      },
      hasOverflowX: function(element) {
        var children = $(element).find('*');
        if (children.length > 0) {
          var maxWidth = Math.max.apply(null, $(children).map(function() {
            return $(this).outerWidth(true);
          }).get());
          return maxWidth > $(element).width();
        }
        return false;
      },
      hasOverflowY: function(element) {
        var children = $(element).find('.m-datatable__row');
        var maxHeight = 0;
        if (children.length > 0) {
          $(children).each(function(tdi, td) {
            maxHeight += Math.floor($(td).innerHeight());
          });
          return maxHeight > $(element).innerHeight();
        }
        return false;
      },
      sortColumn: function(header, sort, int) {
        if (typeof sort === 'undefined') sort = 'asc'; 
        if (typeof int === 'undefined') int = false;
        var column = $(header).index();
        var rows = $(datatable.tableBody).find('.m-datatable__row');
        var hIndex = $(header).closest('.m-datatable__lock').index();
        if (hIndex !== -1) {
          rows = $(datatable.tableBody).
              find('.m-datatable__lock:nth-child(' + (hIndex + 1) + ')').
              find('.m-datatable__row');
        }
        var container = $(rows).parent();
        $(rows).sort(function(a, b) {
          var tda = $(a).find('td:nth-child(' + column + ')').text();
          var tdb = $(b).find('td:nth-child(' + column + ')').text();
          if (int) {
            tda = parseInt(tda);
            tdb = parseInt(tdb);
          }
          if (sort === 'asc') {
            return tda > tdb ? 1 : tda < tdb ? -1 : 0;
          } else {
            return tda < tdb ? 1 : tda > tdb ? -1 : 0;
          }
        }).appendTo(container);
      },
      sorting: function() {
        var sortObj = {
          init: function() {
            if (options.sortable) {
              $(datatable.tableHead).
                  find('.m-datatable__cell:not(.m-datatable__cell--check)').
                  addClass('m-datatable__cell--sort').
                  off('click').
                  on('click', sortObj.sortClick);
              sortObj.setIcon();
            }
          },
          setIcon: function() {
            var meta = API.getDataSourceParam('sort');
            var td = $(datatable.tableHead).
                find('.m-datatable__cell[data-field="' + meta.field + '"]').
                attr('data-sort', meta.sort);
            var sorting = $(td).find('span');
            var icon = $(sorting).find('i');
            var icons = API.getOption('layout.icons.sort');
            if ($(icon).length > 0) {
              $(icon).removeAttr('class').addClass(icons[meta.sort]);
            } else {
              $(sorting).append($('<i/>').addClass(icons[meta.sort]));
            }
          },
          sortClick: function(e) {
            var meta = API.getDataSourceParam('sort');
            var field = $(this).data('field');
            var column = dt.getColumnByField(field);
            if (typeof column.sortable !== 'undefined' &&
                column.sortable === false) return;
            $(datatable.tableHead).
                find('.m-datatable__cell > span > i').
                remove();
            if (options.sortable) {
              dt.spinnerCallback(true);
              var sort = 'desc';
              if (meta.field === field) {
                sort = meta.sort;
              }
              sort = typeof sort === 'undefined' || sort === 'desc'
                  ? 'asc'
                  : 'desc';
              meta = {field: field, sort: sort};
              API.setDataSourceParam('sort', meta);
              sortObj.setIcon();
              setTimeout(function() {
                dt.dataRender('sort');
                $(datatable).trigger('m-datatable--on-sort', meta);
              }, 300);
            }
          },
        };
        sortObj.init();
      },
      localDataUpdate: function() {
        var params = API.getDataSourceParam();
        if (typeof datatable.originalDataSet === 'undefined') {
          datatable.originalDataSet = datatable.dataSet;
        }
        var field = params.sort.field;
        var sort = params.sort.sort;
        var column = dt.getColumnByField(field);
        if (typeof column !== 'undefined') {
          if (typeof column.sortCallback === 'function') {
            datatable.dataSet = column.sortCallback(datatable.originalDataSet,
                sort, column);
          } else {
            datatable.dataSet = dt.sortCallback(datatable.originalDataSet, sort,
                column);
          }
        } else {
          datatable.dataSet = datatable.originalDataSet;
        }
        if (typeof params.query === 'object') {
          params.query = params.query || {};
          var search = $(API.getOption('search.input')).val();
          if (typeof search !== 'undefined' && search !== '') {
            search = search.toLowerCase();
            datatable.dataSet = $.grep(datatable.dataSet, function(obj) {
              for (var field in obj) {
                if (!obj.hasOwnProperty(field)) continue;
                if (typeof obj[field] === 'string') {
                  if (obj[field].toLowerCase().indexOf(search) > -1) {
                    return true;
                  }
                }
              }
              return false;
            });
            delete params.query[dt.getGeneralSearchKey()];
          }
          $.each(params.query, function(k, v) {
            if (v === '') {
              delete params.query[k];
            }
          });
          datatable.dataSet = dt.filterArray(datatable.dataSet, params.query);
          datatable.dataSet = datatable.dataSet.filter(function() {
            return true;
          });
        }
        return datatable.dataSet;
      },
      filterArray: function(list, args, operator) {
        if (typeof list !== 'object') {
          return [];
        }
        if (typeof operator === 'undefined') operator = 'AND';
        if (typeof args !== 'object') {
          return list;
        }
        operator = operator.toUpperCase();
        if ($.inArray(operator, ['AND', 'OR', 'NOT']) === -1) {
          return [];
        }
        var count = Object.keys(args).length;
        var filtered = [];
        $.each(list, function(key, obj) {
          var to_match = obj;
          var matched = 0;
          $.each(args, function(m_key, m_value) {
            if (to_match.hasOwnProperty(m_key) && m_value == to_match[m_key]) {
              matched++;
            }
          });
          if (( 'AND' == operator && matched == count ) ||
              ( 'OR' == operator && matched > 0 ) ||
              ( 'NOT' == operator && 0 == matched )) {
            filtered[key] = obj;
          }
        });
        list = filtered;
        return list;
      },
      resetScroll: function() {
        if (typeof options.detail === 'undefined' && dt.getDepth() === 1) {
          $(datatable.table).find('.m-datatable__row').css('left', 0);
          $(datatable.table).find('.m-datatable__lock').css('top', 0);
          $(datatable.tableBody).scrollTop(0);
        }
      },
      getColumnByField: function(field) {
        var result;
        $.each(options.columns, function(i, column) {
          if (field === column.field) {
            result = column;
            return false;
          }
        });
        return result;
      },
      getDefaultSortColumn: function() {
        var result = {sort: '', field: ''};
        $.each(options.columns, function(i, column) {
          if (typeof column.sortable !== 'undefined'
              && $.inArray(column.sortable, ['asc', 'desc']) !== -1) {
            result = {sort: column.sortable, field: column.field};
            return false;
          }
        });
        return result;
      },
      getHiddenDimensions: function(element, includeMargin) {
        var props = {
              position: 'absolute',
              visibility: 'hidden',
              display: 'block',
            },
            dim = {
              width: 0,
              height: 0,
              innerWidth: 0,
              innerHeight: 0,
              outerWidth: 0,
              outerHeight: 0,
            },
            hiddenParents = $(element).parents().addBack().not(':visible');
        includeMargin = (typeof includeMargin === 'boolean')
            ? includeMargin
            : false;
        var oldProps = [];
        hiddenParents.each(function() {
          var old = {};
          for (var name in props) {
            old[name] = this.style[name];
            this.style[name] = props[name];
          }
          oldProps.push(old);
        });
        dim.width = $(element).width();
        dim.outerWidth = $(element).outerWidth(includeMargin);
        dim.innerWidth = $(element).innerWidth();
        dim.height = $(element).height();
        dim.innerHeight = $(element).innerHeight();
        dim.outerHeight = $(element).outerHeight(includeMargin);
        hiddenParents.each(function(i) {
          var old = oldProps[i];
          for (var name in props) {
            this.style[name] = old[name];
          }
        });
        return dim;
      },
      getGeneralSearchKey: function() {
        var searchInput = $(API.getOption('search.input'));
        return $(searchInput).prop('name') || $(searchInput).prop('id');
      },
      getObject: function(path, object) {
        return path.split('.').reduce(function(obj, i) {
          return obj !== null && typeof obj[i] !== 'undefined' ? obj[i] : null;
        }, object);
      },
      extendObj: function(obj, path, value) {
        var levels = path.split('.'),
            i = 0;
        function createLevel(child) {
          var name = levels[i++];
          if (typeof child[name] !== 'undefined' && child[name] !== null) {
            if (typeof child[name] !== 'object' &&
                typeof child[name] !== 'function') {
              child[name] = {};
            }
          } else {
            child[name] = {};
          }
          if (i === levels.length) {
            child[name] = value;
          } else {
            createLevel(child[name]);
          }
        }
        createLevel(obj);
        return obj;
      },
    };
    this.API = {
      row: null,
      record: null,
      column: null,
      value: null,
      params: null,
    };
    var API = {
      timer: 0,
      redraw: function() {
        dt.adjustCellsWidth.call();
        dt.adjustCellsHeight.call();
        dt.adjustLockContainer.call();
        dt.initHeight.call();
        return datatable;
      },
      load: function() {
        API.reload();
        return datatable;
      },
      reload: function() {
        var delay = (function() {
          return function(callback, ms) {
            clearTimeout(API.timer);
            API.timer = setTimeout(callback, ms);
          };
        })();
        delay(function() {
          if (options.data.serverFiltering === false) {
            dt.localDataUpdate();
          }
          dt.dataRender();
          $(datatable).trigger('m-datatable--on-reloaded');
        }, API.getOption('search.delay'));
        return datatable;
      },
      getRecord: function(id) {
        if (typeof datatable.tableBody === 'undefined') datatable.tableBody = $(
            datatable.table).children('tbody');
        $(datatable.tableBody).
            find('.m-datatable__cell:first-child').
            each(function(i, cell) {
              if (id == $(cell).text()) {
                datatable.API.row = $(cell).closest('.m-datatable__row');
                var rowNumber = datatable.API.row.index() + 1;
                datatable.API.record = datatable.API.value = dt.getOneRow(
                    datatable.tableBody, rowNumber);
                return datatable;
              }
            });
        return datatable;
      },
      getColumn: function(columnName) {
        datatable.API.column = datatable.API.value = $(datatable.API.record).
            find('[data-field="' + columnName + '"]');
        return datatable;
      },
      destroy: function() {
        $(datatable).parent().find('.m-datatable__pager').remove();
        $(datatable).
            replaceWith(
                $(datatable.old).addClass('m-datatable--destroyed').show());
        $(datatable).trigger('m-datatable--on-destroy');
        return datatable;
      },
      sort: function(field, sort) {
        if (typeof sort === 'undefined') sort = 'asc';
        $(datatable.tableHead).
            find('.m-datatable__cell[data-field="' + field + '"]').
            trigger('click');
        return datatable;
      },
      getValue: function() {
        return $(datatable.API.value).text();
      },
      setActive: function(cell) {
        if (typeof cell === 'string') {
          cell = $(datatable.tableBody).
              find('.m-checkbox--single > [type="checkbox"][value="' + cell +
                  '"]');
        }
        $(cell).prop('checked', true);
        var row = $(cell).
            closest('.m-datatable__row').
            addClass('m-datatable__row--active');
        var index = $(row).index() + 1;
        $(row).
            closest('.m-datatable__lock').
            parent().
            find('.m-datatable__row:nth-child(' + index + ')').
            addClass('m-datatable__row--active');
        var ids = [];
        $(row).each(function(i, td) {
          var id = $(td).
              find(
                  '.m-checkbox--single:not(.m-checkbox--all) > [type="checkbox"]').
              val();
          if (typeof id !== 'undefined') {
            ids.push(id);
          }
        });
        $(datatable).trigger('m-datatable--on-check', [ids]);
      },
      setInactive: function(cell) {
        if (typeof cell === 'string') {
          cell = $(datatable.tableBody).
              find('.m-checkbox--single > [type="checkbox"][value="' + cell +
                  '"]');
        }
        $(cell).prop('checked', false);
        var row = $(cell).
            closest('.m-datatable__row').
            removeClass('m-datatable__row--active');
        var index = $(row).index() + 1;
        $(row).
            closest('.m-datatable__lock').
            parent().
            find('.m-datatable__row:nth-child(' + index + ')').
            removeClass('m-datatable__row--active');
        var ids = [];
        $(row).each(function(i, td) {
          var id = $(td).
              find(
                  '.m-checkbox--single:not(.m-checkbox--all) > [type="checkbox"]').
              val();
          if (typeof id !== 'undefined') {
            ids.push(id);
          }
        });
        $(datatable).trigger('m-datatable--on-uncheck', [ids]);
      },
      setActiveAll: function(active) {
        if (active) {
          API.setActive($(datatable.table).
              find('.m-datatable__body .m-datatable__row').
              find('.m-datatable__cell'));
        } else {
          API.setInactive($(datatable.table).
              find('.m-datatable__body .m-datatable__row').
              find('.m-datatable__cell'));
        }
        $(datatable.table).
            find('.m-datatable__body .m-datatable__row').
            find('.m-checkbox [type="checkbox"]').
            prop('checked', active || false);
      },
      setSelectedRecords: function() {
        datatable.API.record = $(datatable.tableBody).
            find('.m-datatable__row--active');
        return datatable;
      },
      getSelectedRecords: function() {
        API.setSelectedRecords();
        return datatable.API.record;
      },
      getOption: function(path) {
        return dt.getObject(path, options);
      },
      setOption: function(path, object) {
        options = dt.extendObj(options, path, object);
      },
      search: function(value, columns) {
        if (typeof columns !== 'undefined') columns = $.makeArray(columns);
        var delay = (function() {
          return function(callback, ms) {
            clearTimeout(API.timer);
            API.timer = setTimeout(callback, ms);
          };
        })();
        delay(function() {
          var query = API.getDataSourceQuery();
          if (typeof columns === 'undefined' && typeof value !== 'undefined') {
            var key = dt.getGeneralSearchKey();
            query[key] = value;
          }
          if (typeof columns === 'object') {
            $.each(columns, function(k, column) {
              query[column] = value;
            });
            $.each(query, function(k, v) {
              if (v === '') {
                delete query[k];
              }
            });
          }
          API.setDataSourceQuery(query);
          if (options.data.serverFiltering === false) {
            dt.localDataUpdate();
          }
          dt.dataRender();
        }, API.getOption('search.delay'));
      },
      setDataSourceParam: function(param, value) {
        var defaultSort = dt.getDefaultSortColumn();
        datatable.API.params = $.extend({}, {
          pagination: {page: 1, perpage: API.getOption('data.pageSize')},
          sort: {sort: defaultSort.sort, field: defaultSort.field},
          query: {},
        }, datatable.API.params, dt.stateGet(dt.stateId));
        datatable.API.params = dt.extendObj(datatable.API.params, param, value);
        dt.stateKeep(dt.stateId, datatable.API.params);
      },
      getDataSourceParam: function(param) {
        var defaultSort = dt.getDefaultSortColumn();
        datatable.API.params = $.extend({}, {
          pagination: {page: 1, perpage: API.getOption('data.pageSize')},
          sort: {sort: defaultSort.sort, field: defaultSort.field},
          query: {},
        }, datatable.API.params, dt.stateGet(dt.stateId));
        if (typeof param === 'string') {
          return dt.getObject(param, datatable.API.params);
        }
        return datatable.API.params;
      },
      getDataSourceQuery: function() {
        return API.getDataSourceParam('query') || {};
      },
      setDataSourceQuery: function(query) {
        API.setDataSourceParam('query', query);
      },
      getCurrentPage: function() {
        return $(datatable.table).
            siblings('.m-datatable__pager').
            last().
            find('.m-datatable__pager-nav').
            find('.m-datatable__pager-link.m-datatable__pager-link--active').
            data('page') || 1;
      },
      getPageSize: function() {
        return $(datatable.table).
            siblings('.m-datatable__pager').
            last().
            find('.m-datatable__pager-size').
            val() || 10;
      },
      getTotalRows: function() {
        return datatable.API.params.pagination.total;
      },
      getDataSet: function() {
        return datatable.originalDataSet;
      },
      hideColumn: function(fieldName) {
        $.map(options.columns, function(column) {
          if (fieldName === column.field) {
            column.responsive = {hidden: 'xl'};
          }
          return column;
        });
        var tds = $.grep($(datatable.table).find('.m-datatable__cell'), function(n, i) {
          return fieldName === $(n).data('field');
        });
        $(tds).hide();
      },
      showColumn: function(fieldName) {
        $.map(options.columns, function(column) {
          if (fieldName === column.field) {
            delete column.responsive;
          }
          return column;
        });
        var tds = $.grep($(datatable.table).find('.m-datatable__cell'), function(n, i) {
          return fieldName === $(n).data('field');
        });
        $(tds).show();
      },
    };
    $.each(API, function(funcName, func) {
      datatable[funcName] = func;
    });
    if (typeof options === 'string') {
      API[options].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof options === 'object' || !options) {
      datatable.textAlign = {
        left: 'm-datatable__cell--left',
        center: 'm-datatable__cell--center',
        right: 'm-datatable__cell--right',
      };
      datatable.dataSet = null;
      options = $.extend(true, {}, $.fn.mDatatable.defaults, options);
      $(datatable).data('options', options);
      $(datatable).trigger('m-datatable--on-init', options);
      dt.init.apply(this, [options]);
    } else {
      $.error('Method ' + options + ' does not exist');
    }
    return datatable;
  };
  $.fn.mDatatable.defaults = {
    data: {
      type: 'local',
      source: null,
      pageSize: 10, 
      saveState: {
        cookie: true,
        webstorage: true,
      }, 
      serverPaging: false,
      serverFiltering: false,
      serverSorting: false,
    },
    layout: {
      theme: 'default', 
      class: 'm-datatable--brand', 
      scroll: false, 
      height: null, 
      footer: false, 
      header: true, 
      smoothScroll: {
        scrollbarShown: true,
      },
      spinner: {
        overlayColor: '#000000',
        opacity: 0,
        type: 'loader',
        state: 'brand',
        message: true,
      },
      icons: {
        sort: {asc: 'la la-arrow-up', desc: 'la la-arrow-down'},
        pagination: {
          next: 'la la-angle-right',
          prev: 'la la-angle-left',
          first: 'la la-angle-double-left',
          last: 'la la-angle-double-right',
          more: 'la la-ellipsis-h',
        },
        rowDetail: {expand: 'fa fa-caret-down', collapse: 'fa fa-caret-right'},
      },
    },
    sortable: true,
    resizable: false,
    filterable: false,
    pagination: true,
    editable: false,
    columns: [],
    search: {
      input: null,
      delay: 400,
    },
    rows: {},
    toolbar: {
      layout: ['pagination', 'info'],
      placement: ['bottom'],  
      items: {
        pagination: {
          type: 'default',
          pages: {
            desktop: {
              layout: 'default',
              pagesNumber: 6,
            },
            tablet: {
              layout: 'default',
              pagesNumber: 3,
            },
            mobile: {
              layout: 'compact',
            },
          },
          navigation: {
            prev: true, 
            next: true, 
            first: true, 
            last: true 
          },
          pageSizeSelect: [10, 20, 30, 50, 100] 
        },
        info: true,
      },
    },
    translate: {
      records: {
        processing: 'Please wait...',
        noRecords: 'No records found',
      },
      toolbar: {
        pagination: {
          items: {
            default: {
              first: 'First',
              prev: 'Previous',
              next: 'Next',
              last: 'Last',
              more: 'More pages',
              input: 'Page number',
              select: 'Select page size',
            },
            info: 'Displaying {{start}} - {{end}} of {{total}} records',
          },
        },
      },
    },
  };
}(jQuery));
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
(function($) {
    $.fn.mHeader = function(options) {
        var header = this;
        var element = $(this);
        var Plugin = {
            run: function(options) { 
                if (element.data('header')) {
                    header = element.data('header');                
                } else {
                    Plugin.init(options);
                    Plugin.reset();
                    Plugin.build();
                    element.data('header', header);
                } 
                return header;
            },
            init: function(options) {                
                header.options = $.extend(true, {}, $.fn.mHeader.defaults, options);
            },
            build: function() {
                Plugin.toggle();                   
            },
            toggle: function() {
                var lastScrollTop = 0;
                if (header.options.minimize.mobile === false && header.options.minimize.desktop === false) {
                    return;
                }          
                $(window).scroll(function() {
                    var offset = 0;
                    if (mUtil.isInResponsiveRange('desktop')) {
                        offset = header.options.offset.desktop;
                        on = header.options.minimize.desktop.on;
                        off = header.options.minimize.desktop.off;
                    } else if (mUtil.isInResponsiveRange('tablet-and-mobile')) {
                        offset = header.options.offset.mobile;
                        on = header.options.minimize.mobile.on;
                        off = header.options.minimize.mobile.off;
                    }
                    var st = $(this).scrollTop();
                    if (header.options.classic) {
                        if (st > offset){ 
                            $("body").addClass(on);
                            $("body").removeClass(off);
                        } else { 
                            $("body").addClass(off);
                            $("body").removeClass(on);
                        }
                    } else {
                        if (st > offset && lastScrollTop < st){ 
                            $("body").addClass(on);
                            $("body").removeClass(off);
                        } else { 
                            $("body").addClass(off);
                            $("body").removeClass(on);
                        }
                        lastScrollTop = st;
                    }
                });
            },
            reset: function() {
            }
        };
        Plugin.run.apply(header, [options]);
        header.publicMethod = function() {
        };
        return header;
    };
    $.fn.mHeader.defaults = {
        classic: false,
        offset: {
            mobile: 150,
            desktop: 200        
        },
        minimize: {
            mobile: false,
            desktop: false
        }
    }; 
}(jQuery));
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
(function($) {
    $.fn.mQuicksearch = function(options) {
        var qs = this;
        var element = $(this);
        var Plugin = {
            run: function(options) {
                if (!element.data('qs')) {
                    Plugin.init(options);
                    Plugin.build();                   
                    element.data('qs', qs);
                } else {
                    qs = element.data('qs'); 
                }
                return qs;
            },
            init: function(options) {
                qs.options = $.extend(true, {}, $.fn.mQuicksearch.defaults, options);
                qs.form = element.find('form');
                qs.input = $(qs.options.input);
                qs.iconClose = $(qs.options.iconClose);
                if (qs.options.type == 'default') {
                    qs.iconSearch = $(qs.options.iconSearch);
                    qs.iconCancel = $(qs.options.iconCancel);
                }               
                qs.dropdown = element.mDropdown({mobileOverlay: false});
                qs.cancelTimeout;
                qs.processing = false;
            }, 
            build: function() {
                qs.input.keyup(Plugin.handleSearch);
                if (qs.options.type == 'default') {
                    qs.input.focus(Plugin.showDropdown);
                    qs.iconCancel.click(Plugin.handleCancel);
                    qs.iconSearch.click(function() {
                        if (mUtil.isInResponsiveRange('tablet-and-mobile')) {
                            $('body').addClass('m-header-search--mobile-expanded');
                            qs.input.focus();
                        }
                    });
                    qs.iconClose.click(function() {
                        if (mUtil.isInResponsiveRange('tablet-and-mobile')) {
                            $('body').removeClass('m-header-search--mobile-expanded');
                            Plugin.closeDropdown();
                        }
                    });
                } else if (qs.options.type == 'dropdown') {
                    qs.dropdown.on('afterShow', function() {
                        qs.input.focus();
                    });
                    qs.iconClose.click(Plugin.closeDropdown);
                }               
            },
            handleSearch: function(e) { 
                var query = qs.input.val();
                if (query.length === 0) {
                    qs.dropdown.hide();
                    Plugin.handleCancelIconVisibility('on');
                    Plugin.closeDropdown();
                    element.removeClass(qs.options.hasResultClass);
                }
                if (query.length < qs.options.minLength || qs.processing == true) {
                    return;
                }
                qs.processing = true;
                qs.form.addClass(qs.options.spinner);
                Plugin.handleCancelIconVisibility('off');
                $.ajax({
                    url: qs.options.source,
                    data: {query: query},
                    dataType: 'html',
                    success: function(res) {
                        qs.processing = false;
                        qs.form.removeClass(qs.options.spinner);
                        Plugin.handleCancelIconVisibility('on');
                        qs.dropdown.setContent(res).show();
                        element.addClass(qs.options.hasResultClass);    
                    },
                    error: function(res) {
                        qs.processing = false;
                        qs.form.removeClass(qs.options.spinner);
                        Plugin.handleCancelIconVisibility('on');
                        qs.dropdown.setContent(qs.options.templates.error.apply(qs, res)).show();  
                        element.addClass(qs.options.hasResultClass);   
                    }
                });
            }, 
            handleCancelIconVisibility: function(status) {
                if (qs.options.type == 'dropdown') {
                    return;
                }
                if (status == 'on') {
                    if (qs.input.val().length === 0) {                       
                        qs.iconCancel.css('visibility', 'hidden');
                        qs.iconClose.css('visibility', 'hidden');
                    } else {
                        clearTimeout(qs.cancelTimeout);
                        qs.cancelTimeout = setTimeout(function() {
                            qs.iconCancel.css('visibility', 'visible');
                            qs.iconClose.css('visibility', 'visible');
                        }, 500);                        
                    }
                } else {
                    qs.iconCancel.css('visibility', 'hidden');
                    qs.iconClose.css('visibility', 'hidden');
                }
            },
            handleCancel: function(e) {
                qs.input.val('');
                qs.iconCancel.css('visibility', 'hidden');
                element.removeClass(qs.options.hasResultClass);   
                Plugin.closeDropdown();
            },
            closeDropdown: function() {
                qs.dropdown.hide();
            },
            showDropdown: function(e) { 
                if (qs.dropdown.isShown() == false && qs.input.val().length > qs.options.minLength && qs.processing == false) {
                    qs.dropdown.show();
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        };
        Plugin.run.apply(qs, [options]);
        qs.test = function(time) {
        };
        return qs;
    };
    $.fn.mQuicksearch.defaults = {
    	minLength: 1,
        maxHeight: 300,
    };
}(jQuery));
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
$.notifyDefaults({
	template: '' +
	'<div data-notify="container" class="alert alert-{0} m-alert" role="alert">' +
	'<button type="button" aria-hidden="true" class="close" data-notify="dismiss"></button>' +
	'<span data-notify="icon"></span>' +
	'<span data-notify="title">{1}</span>' +
	'<span data-notify="message">{2}</span>' +
	'<div class="progress" data-notify="progressbar">' +
	'<div class="progress-bar progress-bar-animated bg-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
	'</div>' +
	'<a href="{3}" target="{4}" data-notify="url"></a>' +
	'</div>'
});
Chart.elements.Rectangle.prototype.draw = function() {    
    var ctx = this._chart.ctx;
    var vm = this._view;
    var left, right, top, bottom, signX, signY, borderSkipped, radius;
    var borderWidth = vm.borderWidth;
    var cornerRadius = this._chart.options.barRadius ? this._chart.options.barRadius : 0;
    if (!vm.horizontal) {
        left = vm.x - vm.width / 2;
        right = vm.x + vm.width / 2;
        if (vm.y > 2 * cornerRadius) {
        	top = vm.y - cornerRadius;        
        } else {
        	top = vm.y;        
        }
        bottom = vm.base;
        signX = 1;
        signY = bottom > top? 1: -1;
        borderSkipped = vm.borderSkipped || 'bottom';
    } else {
        left = vm.base;
        right = vm.x;
        top = vm.y - vm.height / 2;
        bottom = vm.y + vm.height / 2;
        signX = right > left? 1: -1;
        signY = 1;
        borderSkipped = vm.borderSkipped || 'left';
    }
    if (borderWidth) {
        var barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
        borderWidth = borderWidth > barSize? barSize: borderWidth;
        var halfStroke = borderWidth / 2;
        var borderLeft = left + (borderSkipped !== 'left'? halfStroke * signX: 0);
        var borderRight = right + (borderSkipped !== 'right'? -halfStroke * signX: 0);
        var borderTop = top + (borderSkipped !== 'top'? halfStroke * signY: 0);
        var borderBottom = bottom + (borderSkipped !== 'bottom'? -halfStroke * signY: 0);
        if (borderLeft !== borderRight) {
            top = borderTop;
            bottom = borderBottom;
        }
        if (borderTop !== borderBottom) {
            left = borderLeft;
            right = borderRight;
        }
    }
    ctx.beginPath();
    ctx.fillStyle = vm.backgroundColor;
    ctx.strokeStyle = vm.borderColor;
    ctx.lineWidth = borderWidth;
    var corners = [
        [left, bottom],
        [left, top],
        [right, top],
        [right, bottom]
    ];
    var borders = ['bottom', 'left', 'top', 'right'];
    var startCorner = borders.indexOf(borderSkipped, 0);
    if (startCorner === -1) {
        startCorner = 0;
    }
    function cornerAt(index) {
        return corners[(startCorner + index) % 4];
    }
    var corner = cornerAt(0);
    ctx.moveTo(corner[0], corner[1]);
    for (var i = 1; i < 4; i++) {
        corner = cornerAt(i);
        nextCornerId = i+1;
        if(nextCornerId == 4){
            nextCornerId = 0
        }
        nextCorner = cornerAt(nextCornerId);
        width = corners[2][0] - corners[1][0];
        height = corners[0][1] - corners[1][1];
        x = corners[1][0];
        y = corners[1][1];
        var radius = cornerRadius;
        if(radius > height/2){
            radius = height/2;
        }if(radius > width/2){
            radius = width/2;
        }
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
    }
    ctx.fill();
    if (borderWidth) {
        ctx.stroke();
    }
}; 
  $.fn.markdown.defaults.iconlibrary = 'fa';
$.fn.timepicker.defaults = $.extend(true, {}, $.fn.timepicker.defaults, {
    icons: {
        up: 'la la-angle-up',
        down: 'la la-angle-down'  
    }
});
jQuery.validator.setDefaults({
	errorElement: 'div', 
    errorClass: 'form-control-feedback', 
    focusInvalid: false, 
    ignore: "",  
    errorPlacement: function(error, element) { 
    	var group = $(element).closest('.form-group');
        var help = group.find('.m-form__help');
        if (help.length > 0) {
            help.before(error); 
        } else {
            $(element).after(error);
        }
    },
    highlight: function(element) { 
    	$(element).closest('.form-group').addClass('has-danger'); 
        if ($(element).hasClass('form-control')) {
        }
    },
    unhighlight: function(element) { 
        $(element).closest('.form-group').removeClass('has-danger'); 
    },
    success: function(label, element) {
    	$(label).closest('.form-group').addClass('has-success').removeClass('has-danger'); 
        $(label).closest('.form-group').find('.form-control-feedback').remove();
    }
});
var mLayout = function() {
    var horMenu;
    var asideMenu;
    var asideMenuOffcanvas;
    var horMenuOffcanvas;
    var initStickyHeader = function() {
        var header = $('.m-header');
        var options = {
            offset: {},
            minimize:{}       
        };
        if (header.data('minimize-mobile') == 'hide') {
            options.minimize.mobile = {};
            options.minimize.mobile.on = 'm-header--hide';
            options.minimize.mobile.off = 'm-header--show';
        } else {
            options.minimize.mobile = false;
        }
        if (header.data('minimize') == 'hide') {
            options.minimize.desktop = {};
            options.minimize.desktop.on = 'm-header--hide';
            options.minimize.desktop.off = 'm-header--show';
        } else {
            options.minimize.desktop = false;
        }
        if (header.data('minimize-offset')) {
            options.offset.desktop = header.data('minimize-offset');
        }
        if (header.data('minimize-mobile-offset')) {
            options.offset.mobile = header.data('minimize-mobile-offset');
        }        
        header.mHeader(options);
    }
    var initHorMenu = function() { 
        horMenuOffcanvas = $('#m_header_menu').mOffcanvas({
            class: 'm-aside-header-menu-mobile',
            overlay: true,
            close: '#m_aside_header_menu_mobile_close_btn',
            toggle: {
                target: '#m_aside_header_menu_mobile_toggle',
                state: 'm-brand__toggler--active'
            }            
        });
        horMenu = $('#m_header_menu').mMenu({
            submenu: {
                desktop: 'dropdown',
                tablet: 'accordion',
                mobile: 'accordion'
            },
            resize: {
                desktop: function() {
                    var headerNavWidth = $('#m_header_nav').width();
                    var headerMenuWidth = $('#m_header_menu_container').width();
                    var headerTopbarWidth = $('#m_header_topbar').width();
                    var spareWidth = 20;
                    if ((headerMenuWidth + headerTopbarWidth + spareWidth) > headerNavWidth ) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }    
        });
    }
    var initLeftAsideMenu = function() {
        var menu = $('#m_ver_menu');
        var menuOptions = {  
            submenu: {
                desktop: {
                    default: (menu.data('menu-dropdown') == true ? 'dropdown' : 'accordion'),
                    state: {
                        body: 'm-aside-left--minimize',  
                        mode: 'dropdown'
                    }
                },
                tablet: 'accordion', 
                mobile: 'accordion'  
            },
            accordion: {
                autoScroll: true,
                expandAll: false
            }
        };
        asideMenu = menu.mMenu(menuOptions);
        if (menu.data('menu-scrollable')) {
            function initScrollableMenu(obj) {    
                if (mUtil.isInResponsiveRange('tablet-and-mobile')) {
                    mApp.destroyScroller(obj);
                    return;
                }
                var height = mUtil.getViewPort().height - $('.m-header').outerHeight()
                    - ($('.m-aside-left .m-aside__header').length != 0 ? $('.m-aside-left .m-aside__header').outerHeight() : 0)
                    - ($('.m-aside-left .m-aside__footer').length != 0 ? $('.m-aside-left .m-aside__footer').outerHeight() : 0);
                mApp.initScroller(obj, {height: height});
            }
            initScrollableMenu(asideMenu);
            mUtil.addResizeHandler(function() {            
                initScrollableMenu(asideMenu);
            });   
        }      
    }
    var initLeftAside = function() {
        var asideOffcanvasClass = ($('#m_aside_left').hasClass('m-aside-left--offcanvas-default') ? 'm-aside-left--offcanvas-default' : 'm-aside-left');
        asideMenuOffcanvas = $('#m_aside_left').mOffcanvas({
            class: asideOffcanvasClass,
            overlay: true,
            close: '#m_aside_left_close_btn',
            toggle: {
                target: '#m_aside_left_offcanvas_toggle',
                state: 'm-brand__toggler--active'                
            }            
        });        
    }
    var initLeftAsideToggle = function() {
        $('#m_aside_left_minimize_toggle').mToggle({
            target: 'body',
            targetState: 'm-brand--minimize m-aside-left--minimize',
            togglerState: 'm-brand__toggler--active'
        }).on('toggle', function() {
            horMenu.pauseDropdownHover(800);
            asideMenu.pauseDropdownHover(800);
        });
        $('#m_aside_left_hide_toggle').mToggle({
            target: 'body',
            targetState: 'm-aside-left--hide',
            togglerState: 'm-brand__toggler--active'
        }).on('toggle', function() {
            horMenu.pauseDropdownHover(800);
            asideMenu.pauseDropdownHover(800);
        })
    }
    var initTopbar = function() {
        $('#m_aside_header_topbar_mobile_toggle').click(function() {
            $('body').toggleClass('m-topbar--on');
        });                                  
        setInterval(function() {
            $('#m_topbar_notification_icon .m-nav__link-icon').addClass('m-animate-shake');
            $('#m_topbar_notification_icon .m-nav__link-badge').addClass('m-animate-blink');
        }, 3000);
        setInterval(function() {
            $('#m_topbar_notification_icon .m-nav__link-icon').removeClass('m-animate-shake');
            $('#m_topbar_notification_icon .m-nav__link-badge').removeClass('m-animate-blink');
        }, 6000);
    }
    var initQuicksearch = function() {
        var qs = $('#m_quicksearch');
        qs.mQuicksearch({
            type: qs.data('search-type'), 
            source: 'http:
            spinner: 'm-loader m-loader--skin-light m-loader--right',
            input: '#m_quicksearch_input',
            iconClose: '#m_quicksearch_close',
            iconCancel: '#m_quicksearch_cancel',
            iconSearch: '#m_quicksearch_search',
            hasResultClass: 'm-list-search--has-result',
            minLength: 1,            
            templates: {
                error: function(qs) {
                    return '<div class="m-search-results m-search-results--skin-light"><span class="m-search-result__message">Something went wrong</div></div>';
                }                            
            }
        });      
    }
    var initScrollTop = function() {
        $('[data-toggle="m-scroll-top"]').mScrollTop({
            offset: 300,
            speed: 600
        });
    }
    return {
        init: function() {  
            this.initHeader();
            this.initAside();
        },
        initHeader: function() {
            initStickyHeader();
            initHorMenu();
            initTopbar();
            initQuicksearch();
            initScrollTop();
        },
        initAside: function() {
            initLeftAside();
            initLeftAsideMenu();            
            initLeftAsideToggle();
        },
        getAsideMenu: function() {
            return asideMenu;
        },
        closeMobileAsideMenuOffcanvas: function() {
            if (mUtil.isMobileDevice()) {
                asideMenuOffcanvas.hide();
            }
        },
        closeMobileHorMenuOffcanvas: function() {
            if (mUtil.isMobileDevice()) {
                horMenuOffcanvas.hide();
            }
        }
    };
}();
$(document).ready(function() {
    if (mUtil.isAngularVersion() === false) {
        mLayout.init();
    }
});
var mQuickSidebar = function() {
    var topbarAside = $('#m_quick_sidebar');
    var topbarAsideTabs = $('#m_quick_sidebar_tabs');    
    var topbarAsideClose = $('#m_quick_sidebar_close');
    var topbarAsideToggle = $('#m_quick_sidebar_toggle');
    var topbarAsideContent = topbarAside.find('.m-quick-sidebar__content');
    var initMessages = function() {
        var init = function() {
            var messenger = $('#m_quick_sidebar_tabs_messenger');  
            var messengerMessages = messenger.find('.m-messenger__messages');
            var height = topbarAside.outerHeight(true) - 
                topbarAsideTabs.outerHeight(true) - 
                messenger.find('.m-messenger__form').outerHeight(true) - 120;
            messengerMessages.css('height', height);
            mApp.initScroller(messengerMessages, {});
        }
        init();        
        mUtil.addResizeHandler(init);
    }
    var initSettings = function() { 
        var init = function() {
            var settings = $('#m_quick_sidebar_tabs_settings');
            var height = mUtil.getViewPort().height - topbarAsideTabs.outerHeight(true) - 60;
            settings.css('height', height);
            mApp.initScroller(settings, {});
        }
        init();
        mUtil.addResizeHandler(init);
    }
    var initLogs = function() {
        var init = function() {
            var logs = $('#m_quick_sidebar_tabs_logs');
            var height = mUtil.getViewPort().height - topbarAsideTabs.outerHeight(true) - 60;
            logs.css('height', height);
            mApp.initScroller(logs, {});
        }
        init();
        mUtil.addResizeHandler(init);
    }
    var initOffcanvasTabs = function() {
        initMessages();
        initSettings();
        initLogs();
    }
    var initOffcanvas = function() {
        topbarAside.mOffcanvas({
            class: 'm-quick-sidebar',
            close: topbarAsideClose,
            toggle: topbarAsideToggle
        });   
        topbarAside.mOffcanvas().one('afterShow', function() {
            mApp.block(topbarAside);
            setTimeout(function() {
                mApp.unblock(topbarAside);
                topbarAsideContent.removeClass('m--hide');
                initOffcanvasTabs();
            }, 1000);                         
        });
    }
    return {     
        init: function() {  
            initOffcanvas(); 
        }
    };
}();
$(document).ready(function() {
    mQuickSidebar.init();
});
