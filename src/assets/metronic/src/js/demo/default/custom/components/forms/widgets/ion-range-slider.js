var IONRangeSlider = function () {
    var demos = function () {
        $('#m_slider_1').ionRangeSlider();
        $('#m_slider_2').ionRangeSlider({
            min: 100,
            max: 1000,
            from: 550
        });
        $('#m_slider_3').ionRangeSlider({
            type: "double",
            grid: true,
            min: 0,
            max: 1000,
            from: 200,
            to: 800,
            prefix: "$"
        });
        $('#m_slider_4').ionRangeSlider({
            type: "double",
            grid: true,
            min: -1000,
            max: 1000,
            from: -500,
            to: 500
        });
        $('#m_slider_5').ionRangeSlider({
            type: "double",
            grid: true,
            min: -12.8,
            max: 12.8,
            from: -3.2,
            to: 3.2,
            step: 0.1
        });
        $('#m_slider_6').ionRangeSlider({
            type: "single",
            grid: true,
            min: -90,
            max: 90,
            from: 0,
            postfix: "°"
        });
        $('#m_slider_7').ionRangeSlider({
            type: "double",
            min: 100,
            max: 200,
            from: 145,
            to: 155,
            prefix: "Weight: ",
            postfix: " million pounds",
            decorate_both: true
        });
    }
    return {
        init: function() {
            demos(); 
        }
    };
}();
jQuery(document).ready(function() {    
    IONRangeSlider.init();
});
