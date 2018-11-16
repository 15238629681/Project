import $ from 'jquery'
// import pdf from '../../../../static/common/pdf/pdf.js'
// PDFJS.workerSrc = '../../../../static/common/pdf/pdf.worker.js'

//pdf文件懒加载（在图片的基础上修改）
let tempPdfInfo //点击事件取this.savePdfInfo取不到，所以创建一个全局变量
let downloadPdf = {} //已经下载好的pdf

let Lazyload = function (parentDom, infoDic, tag, id, elements, callback) {
	this.distance = 0
	this.SENCER = 30
	this.parentDom = parentDom || document
	this.tag = tag ? tag : "data-original"
	this.tag = tag || "data-original" 
	this.id = id ? id : "file-id"
	this.id = id || "file-id" 
	this.elements = elements || document.getElementsByClassName("ct-r-t")
	callback && (this.callback = callback)
	this.timer;
	tempPdfInfo = infoDic
};

let queueRenderPage = (num, onePdfInfo, fileId) => {
	if (onePdfInfo.pageRendering) {
		onePdfInfo.pageNumPending = num
	} else {
		renderPage(num, onePdfInfo, fileId)
	}
}

let onPrevPage = (pageNum, onePdfInfo, fileId) => {
	if (pageNum <= 1) {
		return
	}
	pageNum--;
	onePdfInfo.pageNum = pageNum
	queueRenderPage(pageNum, onePdfInfo, fileId)
}

let onNextPage = (pageNum, onePdfInfo, fileId) => {
	if (pageNum >= onePdfInfo.pdfDoc.numPages) {
		return
	}
	pageNum++
	onePdfInfo.pageNum = pageNum
	queueRenderPage(pageNum, onePdfInfo, fileId)
}

let renderPage = (num, onePdfInfo, fileId) => {
	onePdfInfo.pageRendering = true
	onePdfInfo.pdfDoc.getPage(num).then(function(page) {
		let viewport = page.getViewport(onePdfInfo.scale)
		if (viewport.width > 595) {
			let bigScale = 595 / viewport.width
			viewport = page.getViewport(bigScale)
		}
		onePdfInfo.canvas.height = viewport.height
		onePdfInfo.canvas.width = viewport.width

		let renderContext = {
			canvasContext: onePdfInfo.ctx,
			viewport: viewport
		};
		let renderTask = page.render(renderContext);

		renderTask.promise.then(function() {
			onePdfInfo.pageRendering = false
			if (onePdfInfo.pageNumPending !== null) {
				renderPage(onePdfInfo.pageNumPending, onePdfInfo, fileId)
				onePdfInfo.pageNumPending = null
			}
		});
	});
	$('#page-num-' + fileId).html(onePdfInfo.pageNum)
}

let getPdfWithUrl = (pdfUrl, fileId) => {
	let currentPdf = downloadPdf[fileId]
	if (currentPdf) {
		tempPdfInfo[fileId].pdfDoc = currentPdf
		$('#page-count-' + fileId).html(tempPdfInfo[fileId].pdfDoc.numPages)
		renderPage(tempPdfInfo[fileId].pageNum, tempPdfInfo[fileId], fileId);
	} else {
		PDFJS.getDocument(pdfUrl).then(function(pdfDoc_) {
			if (pdfDoc_) {
				downloadPdf[fileId] = pdfDoc_
				tempPdfInfo[fileId].pdfDoc = pdfDoc_
				$('#page-count-' + fileId).html(tempPdfInfo[fileId].pdfDoc.numPages)
				renderPage(tempPdfInfo[fileId].pageNum, tempPdfInfo[fileId], fileId);
			}
		})
	}
}

 Lazyload.prototype._detectElementIfInScreen = function() {
	if(!this.elements.length) {
		this.callback && this.callback();
		return;
	}
	var W = window.innerWidth || document.documentElement.clientWidth;
	var H = window.innerHeight || document.documentElement.clientHeight;
	for (var i = 0, len = this.elements.length; i < len; i++) {
		var ele = this.elements[i];
		var rect = ele.getBoundingClientRect();
		if($(ele).is(':visible')&&(rect.top >= this.distance && rect.left >= this.distance
			|| rect.top  < 0 &&  rect.top + rect.height >= this.distance
			|| rect.left < 0 &&  rect.left + rect.width >= this.distance)
			&& rect.top <= H && rect.left <= W ) {
				this.loadItem(ele);
				ele.isLoaded = true;
			}
	}
};

Lazyload.prototype.init = function() {
    var self = this;
	self._detectElementIfInScreen();

	//上一页and下一页
	$(document).unbind('click').on('click', '.next', function() {
		let currentId = $(this).attr('id')
		let pageNum = tempPdfInfo[currentId].pageNum
		onNextPage(pageNum, tempPdfInfo[currentId], currentId)
	})
	$(document).on('click', '.prev', function() {
		let currentId = $(this).attr('id')
		let pageNum = tempPdfInfo[currentId].pageNum
		onPrevPage(pageNum, tempPdfInfo[currentId], currentId)
	})

	
	$(this.parentDom).on('scroll', function() {
		self.refresh()
	})
    $(this.parentDom).on("resize", function() {
    	self.refresh();
    });
};

Lazyload.prototype.refresh = function() {
	var self = this;
	self.timer && clearTimeout(this.timer)
	self.timer = setTimeout(function() {
		self._detectElementIfInScreen()
	},self.SENCER)
};

Lazyload.prototype.loadItem = function(ele) {
	if(ele.isLoaded) return;
	var src = ele.getAttribute(this.tag);
	var fileId = ele.getAttribute(this.id);
    if(src) {
		getPdfWithUrl(src, fileId)
    }
};
export default Lazyload