var Inputmask = function () {
    var demos = function () {
        $("#m_inputmask_1").inputmask("mm/dd/yyyy", {
            autoUnmask: true
        });
        $("#m_inputmask_2").inputmask("mm/dd/yyyy", {
            "placeholder": "*"
        });
        $("#m_inputmask_3").inputmask("mask", {
            "mask": "(999) 999-9999"
        }); 
        $("#m_inputmask_4").inputmask({
            "mask": "99-9999999",
            placeholder: "" 
        });
        $("#m_inputmask_5").inputmask({
            "mask": "9",
            "repeat": 10,
            "greedy": false
        }); 
        $("#m_inputmask_6").inputmask('decimal', {
            rightAlignNumerics: false
        }); 
        $("#m_inputmask_7").inputmask('€ 999.999.999,99', {
            numericInput: true
        }); 
        $("#m_inputmask_8").inputmask({
            "mask": "999.999.999.999"
        });  
        $("#m_inputmask_9").inputmask({
            mask: "*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]",
            greedy: false,
            onBeforePaste: function (pastedValue, opts) {
                pastedValue = pastedValue.toLowerCase();
                return pastedValue.replace("mailto:", "");
            },
            definitions: {
                '*': {
                    validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~\-]",
                    cardinality: 1,
                    casing: "lower"
                }
            }
        });        
    }
    return {
        init: function() {
            demos(); 
        }
    };
}();
jQuery(document).ready(function() {    
    Inputmask.init();
});
