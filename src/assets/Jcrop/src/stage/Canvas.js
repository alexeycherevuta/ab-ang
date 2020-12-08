var CanvasStage = function(){
  this.angle = 0;
  this.scale = 1;
  this.scaleMin = 0.2;
  this.scaleMax = 1.25;
  this.offset = [0,0];
};
CanvasStage.prototype = new ImageStage();
$.extend(CanvasStage,{
  isSupported: function(el,o){
    if ($.Jcrop.supportsCanvas && (el.tagName == 'IMG')) return true;
  },
  priority: 60,
  create: function(el,options,callback){
    var $el = $(el);
    var opt = $.extend({},options);
    $.Jcrop.component.ImageLoader.attach(el,function(w,h){
      var obj = new CanvasStage;
      $el.hide();
      obj.createCanvas(el,w,h);
      $el.before(obj.element);
      obj.imgsrc = el;
      opt.imgsrc = el;
      if (typeof callback == 'function'){
        callback(obj,opt);
        obj.redraw();
      }
    });
  }
});
$.extend(CanvasStage.prototype,{
  init: function(core){
    this.core = core;
  },
  setOffset: function(x,y) {
    this.offset = [x,y];
    return this;
  },
  setAngle: function(v) {
    this.angle = v;
    return this;
  },
  setScale: function(v) {
    this.scale = this.boundScale(v);
    return this;
  },
  boundScale: function(v){
    if (v<this.scaleMin) v = this.scaleMin;
    else if (v>this.scaleMax) v = this.scaleMax;
    return v;
  },
  createCanvas: function(img,w,h){
    this.width = w;
    this.height = h;
    this.canvas = document.createElement('canvas');
    this.canvas.width = w;
    this.canvas.height = h;
    this.$canvas = $(this.canvas).width('100%').height('100%');
    this.context = this.canvas.getContext('2d');
    this.fillstyle = "rgb(0,0,0)";
    this.element = this.$canvas.wrap('<div />').parent().width(w).height(h);
  },
  triggerEvent: function(ev){
    this.$canvas.trigger(ev);
    return this;
  },
  clear: function() {
    this.context.fillStyle = this.fillstyle;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    return this;
  },
  redraw: function() {
    this.context.save();
    this.clear();
    this.context.translate(parseInt(this.width * 0.5), parseInt(this.height * 0.5));
    this.context.translate(this.offset[0]/this.core.opt.xscale,this.offset[1]/this.core.opt.yscale);
    this.context.rotate(this.angle * (Math.PI/180));
    this.context.scale(this.scale,this.scale);
    this.context.translate(-parseInt(this.width * 0.5), -parseInt(this.height * 0.5));
    this.context.drawImage(this.imgsrc,0,0,this.width,this.height);
    this.context.restore();
    this.$canvas.trigger('cropredraw');
    return this;
  },
  setFillStyle: function(v) {
    this.fillstyle = v;
    return this;
  }
});
Jcrop.registerStageType('Canvas',CanvasStage);
