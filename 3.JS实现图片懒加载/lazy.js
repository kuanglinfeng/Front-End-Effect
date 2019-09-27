// 实现通用的图片懒加载 （插件）
// 动态的设置src


/**
 * 初始化页面中需要懒加载的图片
 * @param defaultSrc 默认的图片显示路径
 */
function initLazyImg(defaultSrc) {

	// 获取所有需要懒加载的图片
	var imgs = document.querySelectorAll('[data-src]')
	imgs = Array.from(imgs)
	// 1.设置默认图片
	setDefault()

	// 2.懒加载图片
	loadImgs()

	// 3.注册滚动事件

	var timer = null
	window.addEventListener('scroll', function () {
		// 函数防抖 从最后一次操作开始等待指定时间才真正执行loadImgs
		this.clearTimeout(timer)
		timer = setTimeout(function () {
			loadImgs()
		}, 100)
	})

	/**
	 * 设置默认图片
	 */
	function setDefault() {
		// 获取所有需要懒加载的图片
		for (var i = 0; i < imgs.length; i++) {
			imgs[i].src = defaultSrc
		}

	}

	/**
	 * 懒加载所有特定的图片
	 * 该函数可以智能的分析出当前情况下需要懒加载的图片，让其加载完成，其它图片不变
	 */
	function loadImgs() {
		for (var i = 0; i < imgs.length; i++) {
			var img = imgs[i]
			// 如果该图片已经进行了加载，则将该图片从数组中移除
			if (loadImg(img)) {
				imgs.splice(i, 1)
				i--
			}
		}
		console.log(imgs.length)
	}

	/**
	 * 只能加载指定的img元素
	 * 该函数会分析该元素是否应该加载，如果应该，咋加载，否则不加载
	 * @param img
	 */
	function loadImg(img) {
		// 该元素是否能够加载, 该元素是否有一部分在视口范围内
		var rect = img.getBoundingClientRect()

		// 视口宽度 高度
		var w = document.documentElement.clientWidth
    var h = document.documentElement.clientHeight
		// 元素在视口范围内
		if (rect.right > 0 && rect.left < w && rect.bottom > 0 && rect.top < h) {
			img.src = img.dataset.src
			// 表示进行了懒加载
			return true
		}
		return false

	}

}




