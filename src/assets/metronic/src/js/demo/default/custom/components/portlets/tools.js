var PortletTools = function () {
    var initToastr = function() {
        toastr.options.showDuration = 1000;
    }
    var demo1 = function() {
        var portlet = $('#m_portlet_tools_1').mPortlet();
        portlet.on('beforeCollapse', function(portlet) {
            setTimeout(function() {
                toastr.info('Before collapse event fired!');
            }, 100);
        });
        portlet.on('afterCollapse', function(portlet) {
            setTimeout(function() {
                toastr.warning('Before collapse event fired!');
            }, 2000);            
        });
        portlet.on('beforeExpand', function(portlet) {
            setTimeout(function() {
                toastr.info('Before expand event fired!');
            }, 100);  
        });
        portlet.on('afterExpand', function(portlet) {
            setTimeout(function() {
                toastr.warning('After expand event fired!');
            }, 2000);
        });
        portlet.on('beforeRemove', function(portlet) {
            toastr.info('Before remove event fired!');
            return confirm('Are you sure to remove this portlet ?');  
        });
        portlet.on('afterRemove', function(portlet) {
            setTimeout(function() {
                toastr.warning('After remove event fired!');
            }, 2000);            
        });
        portlet.on('reload', function(portlet) {
            toastr.info('Leload event fired!');
            mApp.block(portlet.getSelf(), {
                overlayColor: '#ffffff',
                type: 'loader',
                state: 'accent',
                opacity: 0.3,
                size: 'lg'
            });
            setTimeout(function() {
                mApp.unblock(portlet.getSelf());
            }, 2000);
        });
        portlet.on('afterFullscreenOn', function(portlet) {
            var scrollable = portlet.getBody().find('> .m-scrollable');
            scrollable.data('original-height', scrollable.data('max-height'));
            scrollable.css('height', '100%');
            scrollable.css('max-height', '100%');
            mApp.initScroller(scrollable, {});
        });
        portlet.on('afterFullscreenOff', function(portlet) {
            toastr.warning('After fullscreen off event fired!');
            var scrollable = portlet.getBody().find('> .m-scrollable');
            scrollable.css('height', scrollable.data('original-height'));
            scrollable.data('max-height', scrollable.data('original-height')); 
            mApp.initScroller(scrollable, {});
        });
    }
    var demo2 = function() {
        var portlet = $('#m_portlet_tools_2').mPortlet();
        portlet.on('beforeCollapse', function(portlet) {
            setTimeout(function() {
                toastr.info('Before collapse event fired!');
            }, 100);
        });
        portlet.on('afterCollapse', function(portlet) {
            setTimeout(function() {
                toastr.warning('Before collapse event fired!');
            }, 2000);            
        });
        portlet.on('beforeExpand', function(portlet) {
            setTimeout(function() {
                toastr.info('Before expand event fired!');
            }, 100);  
        });
        portlet.on('afterExpand', function(portlet) {
            setTimeout(function() {
                toastr.warning('After expand event fired!');
            }, 2000);
        });
        portlet.on('beforeRemove', function(portlet) {
            toastr.info('Before remove event fired!');
            return confirm('Are you sure to remove this portlet ?');  
        });
        portlet.on('afterRemove', function(portlet) {
            setTimeout(function() {
                toastr.warning('After remove event fired!');
            }, 2000);            
        });
        portlet.on('reload', function(portlet) {
            toastr.info('Leload event fired!');
            mApp.block(portlet.getSelf(), {
                overlayColor: '#000000',
                type: 'spinner',
                state: 'brand',
                opacity: 0.05,
                size: 'lg'
            });
            setTimeout(function() {
                mApp.unblock(portlet.getSelf());
            }, 2000);
        });
    }
    var demo3 = function() {
        var portlet = $('#m_portlet_tools_3').mPortlet();
        portlet.on('beforeCollapse', function(portlet) {
            setTimeout(function() {
                toastr.info('Before collapse event fired!');
            }, 100);
        });
        portlet.on('afterCollapse', function(portlet) {
            setTimeout(function() {
                toastr.warning('Before collapse event fired!');
            }, 2000);            
        });
        portlet.on('beforeExpand', function(portlet) {
            setTimeout(function() {
                toastr.info('Before expand event fired!');
            }, 100);  
        });
        portlet.on('afterExpand', function(portlet) {
            setTimeout(function() {
                toastr.warning('After expand event fired!');
            }, 2000);
        });
        portlet.on('beforeRemove', function(portlet) {
            toastr.info('Before remove event fired!');
            return confirm('Are you sure to remove this portlet ?');  
        });
        portlet.on('afterRemove', function(portlet) {
            setTimeout(function() {
                toastr.warning('After remove event fired!');
            }, 2000);            
        });
        portlet.on('reload', function(portlet) {
            toastr.info('Leload event fired!');
            mApp.block(portlet.getSelf(), {
                type: 'loader',
                state: 'success',
                message: 'Please wait...'
            });
            setTimeout(function() {
                mApp.unblock(portlet.getSelf());
            }, 2000);
        });
        portlet.on('afterFullscreenOn', function(portlet) {
            var scrollable = portlet.getBody().find('> .m-scrollable');
            scrollable.data('original-height', scrollable.data('max-height'));
            scrollable.css('height', '100%');
            scrollable.css('max-height', '100%');
            mApp.initScroller(scrollable, {});
        });
        portlet.on('afterFullscreenOff', function(portlet) {
            toastr.warning('After fullscreen off event fired!');
            var scrollable = portlet.getBody().find('> .m-scrollable');
            scrollable.css('height', scrollable.data('original-height'));
            scrollable.data('max-height', scrollable.data('original-height')); 
            mApp.initScroller(scrollable, {});
        });
    }
    var demo4 = function() {
        var portlet = $('#m_portlet_tools_4').mPortlet();
        portlet.on('beforeCollapse', function(portlet) {
            setTimeout(function() {
                toastr.info('Before collapse event fired!');
            }, 100);
        });
        portlet.on('afterCollapse', function(portlet) {
            setTimeout(function() {
                toastr.warning('Before collapse event fired!');
            }, 2000);            
        });
        portlet.on('beforeExpand', function(portlet) {
            setTimeout(function() {
                toastr.info('Before expand event fired!');
            }, 100);  
        });
        portlet.on('afterExpand', function(portlet) {
            setTimeout(function() {
                toastr.warning('After expand event fired!');
            }, 2000);
        });
        portlet.on('beforeRemove', function(portlet) {
            toastr.info('Before remove event fired!');
            return confirm('Are you sure to remove this portlet ?');  
        });
        portlet.on('afterRemove', function(portlet) {
            setTimeout(function() {
                toastr.warning('After remove event fired!');
            }, 2000);            
        });
        portlet.on('reload', function(portlet) {
            toastr.info('Leload event fired!');
            mApp.block(portlet.getSelf(), {
                type: 'loader',
                state: 'brand',
                message: 'Please wait...'
            });
            setTimeout(function() {
                mApp.unblock(portlet.getSelf());
            }, 2000);
        });
        portlet.on('afterFullscreenOn', function(portlet) {
            var scrollable = portlet.getBody().find('> .m-scrollable');
            scrollable.data('original-height', scrollable.data('max-height'));
            scrollable.css('height', '100%');
            scrollable.css('max-height', '100%');
            mApp.initScroller(scrollable, {});
        });
        portlet.on('afterFullscreenOff', function(portlet) {
            toastr.warning('After fullscreen off event fired!');
            var scrollable = portlet.getBody().find('> .m-scrollable');
            scrollable.css('height', scrollable.data('original-height'));
            scrollable.data('max-height', scrollable.data('original-height')); 
            mApp.initScroller(scrollable, {});
        });
    }
    var demo5 = function() {
        var portlet = $('#m_portlet_tools_5').mPortlet();
        portlet.on('beforeCollapse', function(portlet) {
            setTimeout(function() {
                toastr.info('Before collapse event fired!');
            }, 100);
        });
        portlet.on('afterCollapse', function(portlet) {
            setTimeout(function() {
                toastr.warning('Before collapse event fired!');
            }, 2000);            
        });
        portlet.on('beforeExpand', function(portlet) {
            setTimeout(function() {
                toastr.info('Before expand event fired!');
            }, 100);  
        });
        portlet.on('afterExpand', function(portlet) {
            setTimeout(function() {
                toastr.warning('After expand event fired!');
            }, 2000);
        });
        portlet.on('beforeRemove', function(portlet) {
            toastr.info('Before remove event fired!');
            return confirm('Are you sure to remove this portlet ?');  
        });
        portlet.on('afterRemove', function(portlet) {
            setTimeout(function() {
                toastr.warning('After remove event fired!');
            }, 2000);            
        });
        portlet.on('reload', function(portlet) {
            toastr.info('Leload event fired!');
            mApp.block(portlet.getSelf(), {
                type: 'loader',
                state: 'brand',
                message: 'Please wait...'
            });
            setTimeout(function() {
                mApp.unblock(portlet.getSelf());
            }, 2000);
        });
        portlet.on('afterFullscreenOn', function(portlet) {
            toastr.info('After fullscreen on event fired!');
            mApp.initScroller(scrollable, {});
        });
        portlet.on('afterFullscreenOff', function(portlet) {
            toastr.warning('After fullscreen off event fired!');
        });
    }
    var demo6 = function() {
        var portlet = $('#m_portlet_tools_6').mPortlet();
        portlet.on('beforeCollapse', function(portlet) {
            setTimeout(function() {
                toastr.info('Before collapse event fired!');
            }, 100);
        });
        portlet.on('afterCollapse', function(portlet) {
            setTimeout(function() {
                toastr.warning('Before collapse event fired!');
            }, 2000);            
        });
        portlet.on('beforeExpand', function(portlet) {
            setTimeout(function() {
                toastr.info('Before expand event fired!');
            }, 100);  
        });
        portlet.on('afterExpand', function(portlet) {
            setTimeout(function() {
                toastr.warning('After expand event fired!');
            }, 2000);
        });
        portlet.on('beforeRemove', function(portlet) {
            toastr.info('Before remove event fired!');
            return confirm('Are you sure to remove this portlet ?');  
        });
        portlet.on('afterRemove', function(portlet) {
            setTimeout(function() {
                toastr.warning('After remove event fired!');
            }, 2000);            
        });
        portlet.on('reload', function(portlet) {
            toastr.info('Leload event fired!');
            mApp.block(portlet.getSelf(), {
                type: 'loader',
                state: 'brand',
                message: 'Please wait...'
            });
            setTimeout(function() {
                mApp.unblock(portlet.getSelf());
            }, 2000);
        });
        portlet.on('afterFullscreenOn', function(portlet) {
            toastr.info('After fullscreen on event fired!');
            mApp.initScroller(scrollable, {});
        });
        portlet.on('afterFullscreenOff', function(portlet) {
            toastr.warning('After fullscreen off event fired!');
        });
    }
    return {
        init: function () {
            initToastr();
            demo1();
            demo2();
            demo3();
            demo4();
            demo5();
            demo6();
        }
    };
}();
jQuery(document).ready(function() {
    PortletTools.init();
});
