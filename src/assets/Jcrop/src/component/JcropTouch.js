  var JcropTouch = function(core){
    this.core = core;
    this.init();
  };
  $.extend(JcropTouch,{
    support: function(){
      if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch)
        return true;
    },
    prototype: {
      init: function(){
        var t = this,
          p = $.Jcrop.component.DragState.prototype;
        if (!p.touch) {
          t.initEvents();
          t.shimDragState();
          t.shimStageDrag();
          p.touch = true;
        }
      },
      shimDragState: function(){
        var t = this;
        $.Jcrop.component.DragState.prototype.initEvents = function(e){
          if (e.type.substr(0,5) == 'touch') {
            $(this.eventTarget)
              .on('touchmove.jcrop.jcrop-touch',t.dragWrap(this.createDragHandler()))
              .on('touchend.jcrop.jcrop-touch',this.createStopHandler());
          }
          else {
            $(this.eventTarget)
              .on('mousemove.jcrop',this.createDragHandler())
              .on('mouseup.jcrop',this.createStopHandler());
          }
        };
      },
      shimStageDrag: function(){
        this.core.container
          .addClass('jcrop-touch')
          .on('touchstart.jcrop.jcrop-stage',this.dragWrap(this.core.ui.manager.startDragHandler()));
      },
      dragWrap: function(cb){
        return function(e){
          e.preventDefault();
          e.stopPropagation();
          if (e.type.substr(0,5) == 'touch') {
            e.pageX = e.originalEvent.changedTouches[0].pageX;
            e.pageY = e.originalEvent.changedTouches[0].pageY;
            return cb(e);
          }
          return false;
        };
      },
      initEvents: function(){
        var t = this, c = t.core;
        c.container.on(
          'touchstart.jcrop.jcrop-touch',
          '.'+c.opt.css_drag,
          t.dragWrap(c.startDrag())
        );
      }
    }
  });
  Jcrop.registerComponent('Touch',JcropTouch);
