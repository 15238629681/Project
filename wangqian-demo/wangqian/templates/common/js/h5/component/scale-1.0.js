/**
     * touchstart touchmove 实现图片缩放效果
*/
let Scale = () => {
   let self = this
   self.distance = 0
   self.scale = 1
   self.baseWidth = null
   self.baseHeight = null
   self.scaleWidth = null
   self.scaleHeight = null
}

Scale.prototype = {
	touchstart: function (e) {
		console.log('单手指触发开始')
        // 单手指缩放开始，也不做任何处理
        if(e.touches.length == 1) return
        console.log('双手指触发开始')
        // 注意touchstartCallback 真正代码的开始
        // 一开始我并没有这个回调函数，会出现缩小的时候有瞬间被放大过程的bug
        // 当两根手指放上去的时候，就将distance 初始化。
        let xMove = e.touches[1].clientX - e.touches[0].clientX;
        let yMove = e.touches[1].clientY - e.touches[0].clientY;
        self.distance = Math.sqrt(xMove * xMove + yMove * yMove);
	},
	touchmove: function() {
		let self = this
        console.log('单手指运动')
        // 单手指缩放我们不做任何操作
        if(e.touches.length == 1) return
        console.log('双手指运动')
        let xMove = e.touches[1].clientX - e.touches[0].clientX;
        let yMove = e.touches[1].clientY - e.touches[0].clientY;
        // 新的 ditance
        let distance = Math.sqrt(xMove * xMove + yMove * yMove);
        let distanceDiff = distance - self.distance;
        let newScale = self.scale + 0.005 * distanceDiff
        // 为了防止缩放得太大，所以scale需要限制，同理最小值也是
        if(newScale >= 2) {
            newScale = 2
        }
        if(newScale <= 0.6) {
            newScale = 0.6
        }
        let scaleWidth = newScale * self.baseWidth
        let scaleHeight = newScale * self.baseHeight
        self.distance = distance
        self.scale = newScale
        self.scaleWidth = scaleWidth
        self.scaleHeight = scaleHeight
	}
}

module.exports = Scale