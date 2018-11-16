import $ from 'jquery'
function includeStyleElement(styles,styleId) {
    if (document.getElementById(styleId)) return;
    var style = document.createElement('style');
    style.id = styleId;
    (document.getElementsByTagName("head")[0] || document.body).appendChild(style);
    if (style.styleSheet) {
        style.styleSheet.cssText = styles;
    } else {
        style.appendChild(document.createTextNode(styles));
    }
}
var styles = [
  '.pagination2 {',
    'list-style: none;',
    'margin: 0 auto;',
    'font-size: 14px;',
    'color: #999;',
  '}',
  '.pagination2:after{',
    'content:".";',
    'clear:both;',
    'display: block;',
    'height: 0; ',
    'visibility: hidden;',
  '}',
  '.pagination2 li {',
      'float: left;',
      'display: inline;',
      'padding: 0px 12px;',
      'height: 30px;',
      'line-height: 30px;',
      'text-align: center;',
      'border: 1px solid #e5e5e5;',
      'margin: 0 2px;',
      'background-color: #fff',
  '}',
  '.pagination2 li a{',
    'color: #999;',
    'cursor: pointer;',
  '}',
  '.pagination2 li.bookmark.active{',
    'background:#40B2F1;',
    'border: 1px solid #40B2F1;',
  '}',
  '.pagination2 li.bookmark.active a{',
    'color:white;',
  '}',
  '.pagination2 .omit{',
    'float: left;',
      'display: inline;',
      'padding: 0 10px;',
      'height: 30px;',
      'line-height: 30px;',
  '}'
].join('');
includeStyleElement(styles,"paginator2");
var Paginator = function(url, param, cb, err){
    var self = this;
    cb && (self.cb = cb);
    err && (self.err = err);
    self.url = url;
    self.no = 1;
    if(param.target) { //分页页面的按钮列表
      self.target = $('ul'+param.target)
    } else {
      self.target = $('ul.pagination2')
    }
    delete param.target

    self.param = param;

    $.ajax({
       type: "GET",
       url: self.url,
       dataType:'json',
      //  crossDomain:true  //兼容ie9
       data:self.param
   })
  .done(function(data){
        self.cb&&self.cb(data);
        self.refreshPagins(data);
        self.bindEvents();
  }).fail(function(err){

        self.err&&self.err();
  })
};
Paginator.prototype.reset= function (url, param, cb, err) {
    var self = this;
    cb && (self.cb = cb);
    err &&(self.err = err);
    url && (self.url = url);
    self.no = 1;
    param && (self.param = param);
    $.ajax({
       type:"GET",
       url: self.url,
       dataType:'json',
      //  crossDomain:true, //兼容ie9
       data: self.param
   })
  .done(function(data){
        self.cb&&self.cb(data);
        self.refreshPagins(data);
  }).fail(function(){
        console.log('failed')
        self.err&&self.err();
  })
};
Paginator.prototype.refreshPagins = function(data){

  var self  = this;
  self.target.empty();
  if(data.previous){
       self.target.append('<li class="firstPage"><a>上一页</a></li>');
       this.previous = data.previous;
  }else{
       this.previous = null;
  }
  if(data.next){
    var pageSum = Math.ceil(data.count/data.results.length);
  }else{
    var pageSum = self.no;
  }


  function appendBookmark(i){
    if(self.no == i){
       self.target.append('<li class="bookmark active" data-no="'+i+'"><a>'+i+'</a></li>');
    }else{
       self.target.append('<li class="bookmark" data-no="'+i+'"><a>'+i+'</a></li>');
    }
  }
  if(pageSum>10){
    if(self.no>=5 && self.no <= pageSum-4){
      // 显示头
      for(var i=1; i<=2 ;i++){
        appendBookmark(i)
      }
       self.target.append('<span class="omit">...</span>');
      // 显示中心
      for(var i=self.no-1; i<=self.no+1; i++){
         appendBookmark(i)
      }
       self.target.append('<span class="omit">...</span>');
      // 显示尾巴
      for(var i=pageSum-1; i<=pageSum ;i++){
         appendBookmark(i)
      }

    }else{
      // 只显示头尾
      for(var i=1; i<=pageSum; i++){
        if(i==6){
           self.target.append('<span class="omit">...</span>');
        }
        if(i>=6&&i<=pageSum-5) continue;
         appendBookmark(i)
      }
    }
  }else{
    if(pageSum != 1){
      for(var i=1; i<=pageSum; i++){
        appendBookmark(i)
      }
    }
    
  }

  for(var i=1; i<=10; i++){

  }
  if(data.next){
         self.target.append('<li class="lastPage"><a>下一页</a></li>');
       this.next = data.next
  }else{
       this.next = null;
  }

};
Paginator.prototype.refresh = function(url){
    var self = this;
    self.url = url;
    $.ajax({
       type:"GET",
       url:url,
       dataType:'json',
       data: self.param,
      //  crossDomain:true,
   })
  .done(function(data){
       self.cb&&self.cb(data);
       self.refreshPagins(data);

  }).fail(function(){
        self.err&&self.err();
  })
};
Paginator.prototype.bindEvents = function(){
    var self  = this;
     self.target.on('click','.firstPage',function(){
        try {
          self.no = parseInt(self.previous.match(/page=(\d+)/)[1]);
        } catch(err) {
          self.no = 1
        }
        self.refresh(self.previous);

    });
     self.target.on('click','.lastPage',function(){
        self.no = parseInt(self.next.match(/page=(\d+)/)[1]);
        self.refresh(self.next);

    });
     self.target.on('click','.bookmark',function (){
      if(self.url.match(/page=\d+/)){
        var markurl = self.url.replace(self.url.match(/page=\d+/)[0],'page='+$(this).attr('data-no'));
      }else{
        if(self.url.indexOf('?')!=-1){
          var markurl = self.url + '&page='+ $(this).attr('data-no');
        }else{
          var markurl = self.url + '?page='+ $(this).attr('data-no');
        }
      }
      self.no = parseInt($(this).attr('data-no'));
      self.refresh(markurl);
    })
};

module.exports = Paginator