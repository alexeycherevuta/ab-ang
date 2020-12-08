var DropzoneDemo = function () {    
    var demos = function () {
        Dropzone.options.mDropzoneOne = {
            paramName: "file", 
            maxFiles: 1,
            maxFilesize: 5, 
            accept: function(file, done) {
                if (file.name == "justinbieber.jpg") {
                    done("Naha, you don't.");
                } else { 
                    done(); 
                }
            }   
        };
        Dropzone.options.mDropzoneTwo = {
            paramName: "file", 
            maxFiles: 10,
            maxFilesize: 10, 
            accept: function(file, done) {
                if (file.name == "justinbieber.jpg") {
                    done("Naha, you don't.");
                } else { 
                    done(); 
                }
            }   
        };
        Dropzone.options.mDropzoneThree = {
            paramName: "file", 
            maxFiles: 10,
            maxFilesize: 10, 
            acceptedFiles: "image/*,application/pdf,.psd",
            accept: function(file, done) {
                if (file.name == "justinbieber.jpg") {
                    done("Naha, you don't.");
                } else { 
                    done(); 
                }
            }   
        };
    }
    return {
        init: function() {
            demos(); 
        }
    };
}();
DropzoneDemo.init();
