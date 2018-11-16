/**
 * form 表单结合 iframe 原生插件上传
 *
 *
 */

 var Zupload = (function(){
 	var Zu = function(opt) {
       var self = this
       if(opt.url === undefined) {
            throw 'upload url can not be null'
       }
       if(opt.hideField && opt.hideField.constructor.toString().indexOf('Array') === -1) {
            throw 'type of hide field is array'
       }
       if(opt.csrftoken && typeof opt.csrftoken !== 'object') {
            throw 'type of csrftoken is object'
       }
       if(opt.target && typeof opt.target !== 'string') {
       	    throw 'type of target must be string and not null'
       }
       self.opt = opt
 	}

    Zu.prototype.upload = function () {
      var self = this
      self.getDom()
      self.form.submit()
    }

 	Zu.prototype.getDom = function () {
 		var self = this
        var uploadWrap = document.createElement('div')
        uploadWrap.id = 'zupload-wrap'
        uploadWrap.style.display = 'none'
        //iframe ele
        var fakeIframe = document.createElement('iframe')
        fakeIframe.id = 'zupload-iframe'
        fakeIframe.name = 'zupload-iframe'
        fakeIframe.style.display = 'none'
        uploadWrap.appendChild(fakeIframe)

        //form ele
        self.form = document.createElement('form')
        self.form.target = 'zupload-iframe'
        self.form.id = 'zupload-form'
        self.form.method = 'POST'
        self.form.enctype = 'multipart/form-data'
        self.form.action = self.opt.url
        // insert file input
        if(self.opt.target) {
        	var fileNode = ''
        	var cloneNode = ''
        	fileNode = document.getElementById(self.opt.target)
        	cloneNode = fileNode.cloneNode(true)
        }
        //insert csrftoken 
        if(self.opt.csrftoken) {
            var csrfElem =  '<input type="hidden" name="' + self.opt.csrftoken.name + '" value="' + self.opt.csrftoken.value + '">'
            self.form.innerHTML = csrfElem
        }

        // hidden fields to submit
        var fields = document.createElement('div')
        fields.id = 'zupload-fields'
        //render fields
        if(self.opt.hideField) {
            var hideElem = ''
            for(let i = 0; i < self.opt.hideField.length; i++) {
                hideElem += '<input type="hidden" name="' + self.opt.hideField[i].name + '" value="' + self.opt.hideField[i].value + '">'
            }
            fields.innerHTML = hideElem
        }
        self.form.appendChild(cloneNode)
        self.form.appendChild(fields)
        uploadWrap.appendChild(self.form)
        document.body.appendChild(uploadWrap)
        return fakeIframe
 	}
 	return Zu
 }())

 module.exports = Zupload