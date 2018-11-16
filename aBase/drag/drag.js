function Drag( id ){
    this.oDiv = document.getElementById(id);
    
    this,disX = 0;
    this.dixY = 0;
    
    var _this = this;
    this.oDiv.onmousedown = function(ev){
        var ev = ev || event;
        _this.mouseDownFn(ev);

        return false;
    }
}

Drag.prototype.mouseDownFn = function(ev){
    var ev = ev || event;
    var _this = this;
    _this.disX = ev.clientX - _this.oDiv.offsetLeft;
    _this.disY = ev.clientY - _this.oDiv.offsetTop;

    document.onmousemove = function(ev){
        var ev = ev || event;
        _this.mouseMoveFn(ev);
    }

    document.onmouseup = function (ev){
        var ev = ev || event;
        _this.mouseUpFn(ev);
    }
}

Drag.prototype.mouseMoveFn = function(ev){
    var ev = ev || event;
    var _this = this;
    _this.oDiv.style.left = ev.clientX - _this.disX + 'px';
    _this.oDiv.style.top = ev.clientY - _this.disY + 'px';
}
Drag.prototype.mouseUpFn = function(ev){
    var ev = ev || event;
    document.onmousemove = null;
    document.onmouseup = null;
}
