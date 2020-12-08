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
