var CalendarGoogle = function() {
    return {
        init: function() {
            $('#m_calendar').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,listYear'
                },
                displayEventTime: false, 
                googleCalendarApiKey: 'AIzaSyDcnW6WejpTOCffshGDDb4neIrXVUA1EAE',
                events: 'en.usa#holiday@group.v.calendar.google.com',
                eventClick: function(event) {
                    window.open(event.url, 'gcalevent', 'width=700,height=600');
                    return false;
                },
                loading: function(bool) {
                    return;
                },                
                eventRender: function(event, element) {
                    if (!event.description) {
                        return;
                    }
                    if (element.hasClass('fc-day-grid-event')) {
                        element.data('content', event.description);
                        element.data('placement', 'top');
                        mApp.initPopover(element); 
                    } else if (element.hasClass('fc-time-grid-event')) {
                        element.find('.fc-title').append('<div class="fc-description">' + event.description + '</div>'); 
                    } else if (element.find('.fc-list-item-title').lenght !== 0) {
                        element.find('.fc-list-item-title').append('<div class="fc-description">' + event.description + '</div>'); 
                    }
                }
            });
        }
    };
}();
jQuery(document).ready(function() {
    CalendarGoogle.init();
});
