function LimitDrag (id){
    Drag.call(this,id);
}
for(var i in Drag.prototype){
    LimitDrag.prototype[i] = Drag.prototype[i];
}

LimitDrag.prototype.mouseMoveFn = function(ev){
    var ev = ev || event;
    var _this = this;

    var x = ev.clientX - _this.disX;
    var y = ev.clientY - _this.disY;
    if(x<=0){
       x = 0;
    }else if( x > (document.documentElement.clientWidth - _this.oDiv.offsetWidth) ){
       x =  (document.documentElement.clientWidth - _this.oDiv.offsetWidth);
    }
    
    if(y<=0){
        y = 0 ;
    }else if( y > (document.documentElement.clientHeight - _this.oDiv.offsetHeight) ){
       y =  (document.documentElement.clientHeight - _this.oDiv.offsetHeight);
    }
    console.log('x------'+x);
    console.log('y------'+y);

    _this.oDiv.style.left = x + 'px';
    _this.oDiv.style.top = y + 'px';


}