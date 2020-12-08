var IdleTimerDemo = function() {
    var demo1 = function() {
        var
            docTimeout = 5000;
        $(document).on("idle.idleTimer", function(event, elem, obj) {
            $("#docStatus")
                .val(function(i, v) {
                    return v + "Idle @ " + moment().format() + " \n";
                })
                .removeClass("alert-success")
                .addClass("alert-warning")
                .scrollTop($('#docStatus')[0].scrollHeight);
        });
        $(document).on("active.idleTimer", function(event, elem, obj, e) {
            $('#docStatus')
                .val(function(i, v) {
                    return v + "Active [" + e.type + "] [" + e.target.nodeName + "] @ " + moment().format() + " \n";
                })
                .addClass("alert-success")
                .removeClass("alert-warning")
                .scrollTop($('#docStatus')[0].scrollHeight);
        });
        $("#btPause").click(function() {
            $(document).idleTimer("pause");
            $('#docStatus')
                .val(function(i, v) {
                    return v + "Paused @ " + moment().format() + " \n";
                })
                .scrollTop($('#docStatus')[0].scrollHeight);
            $(this).blur();
            return false;
        });
        $("#btResume").click(function() {
            $(document).idleTimer("resume");
            $('#docStatus')
                .val(function(i, v) {
                    return v + "Resumed @ " + moment().format() + " \n";
                })
                .scrollTop($('#docStatus')[0].scrollHeight);
            $(this).blur();
            return false;
        });
        $("#btElapsed").click(function() {
            $('#docStatus')
                .val(function(i, v) {
                    return v + "Elapsed (since becoming active): " + $(document).idleTimer("getElapsedTime") + " \n";
                })
                .scrollTop($('#docStatus')[0].scrollHeight);
            $(this).blur();
            return false;
        });
        $("#btDestroy").click(function() {
            $(document).idleTimer("destroy");
            $('#docStatus')
                .val(function(i, v) {
                    return v + "Destroyed: @ " + moment().format() + " \n";
                })
                .removeClass("alert-success")
                .removeClass("alert-warning")
                .scrollTop($('#docStatus')[0].scrollHeight);
            $(this).blur();
            return false;
        });
        $("#btInit").click(function() {
            $(document).idleTimer({
                timeout: docTimeout
            });
            $('#docStatus')
                .val(function(i, v) {
                    return v + "Init: @ " + moment().format() + " \n";
                })
                .scrollTop($('#docStatus')[0].scrollHeight);
            if ($(document).idleTimer("isIdle")) {
                $('#docStatus')
                    .removeClass("alert-success")
                    .addClass("alert-warning");
            } else {
                $('#docStatus')
                    .addClass("alert-success")
                    .removeClass("alert-warning");
            }
            $(this).blur();
            return false;
        });
        $('#docStatus').val('');
        $(document).idleTimer(docTimeout);
        if ($(document).idleTimer("isIdle")) {
            $("#docStatus")
                .val(function(i, v) {
                    return v + "Initial Idle State @ " + moment().format() + " \n";
                })
                .removeClass("alert-success")
                .addClass("alert-warning")
                .scrollTop($('#docStatus')[0].scrollHeight);
        } else {
            $('#docStatus')
                .val(function(i, v) {
                    return v + "Initial Active State @ " + moment().format() + " \n";
                })
                .addClass("alert-success")
                .removeClass("alert-warning")
                .scrollTop($('#docStatus')[0].scrollHeight);
        }
        $('#docTimeout').text(docTimeout / 1000);
    }
    var demo2 = function() {
        var
            taTimeout = 3000;
        $('#elStatus').on("idle.idleTimer", function(event, elem, obj) {
            event.stopPropagation();
            $('#elStatus')
                .val(function(i, v) {
                    return v + "Idle @ " + moment().format() + " \n";
                })
                .removeClass("alert-success")
                .addClass("alert-warning")
                .scrollTop($('#elStatus')[0].scrollHeight);
        });
        $('#elStatus').on("active.idleTimer", function(event) {
            event.stopPropagation();
            $('#elStatus')
                .val(function(i, v) {
                    return v + "Active @ " + moment().format() + " \n";
                })
                .addClass("alert-success")
                .removeClass("alert-warning")
                .scrollTop($('#elStatus')[0].scrollHeight);
        });
        $("#btReset").click(function() {
            $('#elStatus')
                .idleTimer("reset")
                .val(function(i, v) {
                    return v + "Reset @ " + moment().format() + " \n";
                })
                .scrollTop($('#elStatus')[0].scrollHeight);
            if ($("#elStatus").idleTimer("isIdle")) {
                $('#elStatus')
                    .removeClass("alert-success")
                    .addClass("alert-warning");
            } else {
                $('#elStatus')
                    .addClass("alert-success")
                    .removeClass("alert-warning");
            }
            $(this).blur();
            return false;
        });
        $("#btRemaining").click(function() {
            $('#elStatus')
                .val(function(i, v) {
                    return v + "Remaining: " + $("#elStatus").idleTimer("getRemainingTime") + " \n";
                })
                .scrollTop($('#elStatus')[0].scrollHeight);
            $(this).blur();
            return false;
        });
        $("#btLastActive").click(function() {
            $('#elStatus')
                .val(function(i, v) {
                    return v + "LastActive: " + $("#elStatus").idleTimer("getLastActiveTime") + " \n";
                })
                .scrollTop($('#elStatus')[0].scrollHeight);
            $(this).blur();
            return false;
        });
        $("#btState").click(function() {
            $('#elStatus')
                .val(function(i, v) {
                    return v + "State: " + ($("#elStatus").idleTimer("isIdle") ? "idle" : "active") + " \n";
                })
                .scrollTop($('#elStatus')[0].scrollHeight);
            $(this).blur();
            return false;
        });
        $('#elStatus').val('').idleTimer(taTimeout);
        if ($("#elStatus").idleTimer("isIdle")) {
            $("#elStatus")
                .val(function(i, v) {
                    return v + "Initial Idle @ " + moment().format() + " \n";
                })
                .removeClass("alert-success")
                .addClass("alert-warning")
                .scrollTop($('#elStatus')[0].scrollHeight);
        } else {
            $('#elStatus')
                .val(function(i, v) {
                    return v + "Initial Active @ " + moment().format() + " \n";
                })
                .addClass("alert-success")
                .removeClass("alert-warning")
                .scrollTop($('#elStatus')[0].scrollHeight);
        }
        $('#elTimeout').text(taTimeout / 1000);
    }
    return {
        init: function() {
            demo1();
            demo2();
        }
    };
}();
jQuery(document).ready(function() {
    IdleTimerDemo.init();
});
