var SessionTimeoutDemo = function () {
    var initDemo = function () {
        $.sessionTimeout({
            title: 'Session Timeout Notification',
            message: 'Your session is about to expire.',
            keepAliveUrl: 'inc/api/session-timeout/keepalive.php',
            redirUrl: '?p=page_user_lock_1',
            logoutUrl: '?p=page_user_login_1',
            warnAfter: 3000, 
            redirAfter: 35000, 
            ignoreUserActivity: true,
            countdownMessage: 'Redirecting in {timer} seconds.',
            countdownBar: true
        });
    }
    return {
        init: function () {
            initDemo();
        }
    };
}();
jQuery(document).ready(function() {    
    SessionTimeoutDemo.init();
});
