  $.fn.Jcrop = function(options,callback){
    options = options || {};
    var first = this.eq(0).data('Jcrop');
    var args = Array.prototype.slice.call(arguments);
    if (options == 'api') { return first; }
    else if (first && (typeof options == 'string')) {
      if (first[options]) {
        args.shift();
        first[options].apply(first,args);
        return first;
      }
      return false;
    }
    this.each(function(){
      var t = this, $t = $(this);
      var exists = $t.data('Jcrop');
      var obj;
      if (exists)
        exists.setOptions(options);
      else {
        if (!options.stageConstructor)
          options.stageConstructor = $.Jcrop.stageConstructor;
        options.stageConstructor(this,options,function(stage,options){
          var selection = options.setSelect;
          if (selection) delete(options.setSelect);
          var obj = $.Jcrop.attach(stage.element,options);
          if (typeof stage.attach == 'function')
            stage.attach(obj);
          $t.data('Jcrop',obj);
          if (selection) {
            obj.newSelection();
            obj.setSelect(selection);
          }
          if (typeof callback == 'function')
            callback.call(obj);
        });
      }
      return this;
    });
  };
