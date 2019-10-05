// 配置对象
var config = {
  // 一张图片的宽度
  imgWidth: 520,
  // 一个小圆点的宽度
  dotWidth: 12,
  // 一些需要用到的dom元素
  doms: {
    divBanner: document.querySelector('.banner'),
    divImgs: document.querySelector('.banner .imgs'),
    divDots: document.querySelector('.banner .dots'),
    divArrows: document.querySelector('.banner .arrow')
  },
  // 当前显示的是第几张图片，从0开始，到imgNumber - 1，该属性不考虑额外的图片
  currentIndex: 0,
  // 动画效果配置
  animate: {
    // 计时器的编号
    id: null,
    // 运动的间隔时间
    duration: 16,
    // 运动总时间
    total: 300
  }
}

// 图片数量
config.imgNumber = config.doms.divImgs.children.length

/**
 * 初始化
 */
function init() {
  // 第一张图片前面要放一张逻辑最后轮播的图片 逻辑最后一张图片后面要放逻辑上的第一张图片 所以还要加2
  config.doms.divImgs.style.width = config.imgWidth * (config.imgNumber + 2) + 'px'
  config.doms.divDots.style.width = config.imgNumber * config.dotWidth + 'px'

  // 获取首尾元素
  var firstChild = config.doms.divImgs.firstElementChild
  var lastChild = config.doms.divImgs.lastElementChild

  // 克隆获取到的元素 深度克隆
  var firstClone = firstChild.cloneNode(true) 
  // 将克隆好的第一个元素插入到最后一个元素的后面
  config.doms.divImgs.appendChild(firstClone)
  var lastClone = lastChild.cloneNode(true)
  // 将克隆好的最后一个元素插入到第一个元素的前面
  config.doms.divImgs.insertBefore(lastClone, firstChild)

  // 处理小圆点
  for (var i = 0; i < config.imgNumber; i++) {
    var span = document.createElement('span')
    config.doms.divDots.appendChild(span)
  }
  // 设置小圆点的状态
  setDotsStatus()

  // 设置divImgs的marginLeft
  config.doms.divImgs.style.marginLeft = getCorrectMarginLeft(config.currentIndex) + 'px'

  regEvent()
}

init()


/**
 * 设置小圆点的状态
 */
function setDotsStatus() {
  for (var i = 0; i < config.doms.divDots.children.length; i++) {
    var span = config.doms.divDots.children[i]
    if (i === config.currentIndex) {
      // 激活状态
      span.className = 'active'
    } else { 
      span.className = ''
    }
  }
}

/**
 * 根据currentIndex，得到正确的margin-left值
 */
function getCorrectMarginLeft(index) {
  return (-index - 1) * config.imgWidth
}

/**
 * 切换图片
 * @param {*} index 切换到目标图片的索引
 * @param {*} direction 方向 'right'  'left'  点击的方向
 */
function switchTo(index, direction) {
  // 不切换的情况
  if (index === config.currentIndex) {
    return;
  }

  // 终极目标 改变divimgs的marginleft
  var newLeft =  getCorrectMarginLeft(index)

  // 动画：就是当前的marginleft 经过一定的时间 逐步的变化到target marginleft
  animateBegin()

  // 设置其它状态
  config.currentIndex = index
  setDotsStatus()


  /**
   * 完成动画效果
   */
  function animateBegin() {
    // 清除之前的运动
    stopAnimate()
    // 1. 计算运动次数
    var number = Math.ceil( config.animate.total / config.animate.duration )
    // 当前运动的次数
    var curNumber = 0

    // 2. 总距离计算
    // 当前的marginleft
    var curLeft = parseFloat(config.doms.divImgs.style.marginLeft)
    var distance
    var totalWidth = config.imgNumber * config.imgWidth
    if (direction === 'right') {
      if (newLeft < curLeft) {
        distance = newLeft - curLeft
      } else {
        distance = -(totalWidth - Math.abs(newLeft - curLeft))
      }
    } else {
      if (newLeft > curLeft) {
        distance = newLeft - curLeft
      } else {
        distance = totalWidth - Math.abs(newLeft - curLeft)
      }
    }


    // 3. 计算每次运动的位移
    // 位移 = 总距离 / 次数
    var everyDis = distance / number

    config.animate.id = setInterval(function () {
      // 运动到达足够的次数后终止
      // 当前的marginleft加上一段位移
      curLeft += everyDis

      // 处理无缝轮播
      if (direction === 'right' && Math.abs(curLeft) >= (config.imgNumber + 0.5) * config.imgWidth) {
        curLeft += totalWidth
      }
      if (direction === 'left' && Math.abs(curLeft) <= 0.5 * config.imgWidth) {
        curLeft -=totalWidth
      }

      config.doms.divImgs.style.marginLeft = curLeft + 'px'
      curNumber++
      if (curNumber === number) {
        // 停止
        stopAnimate()
      }

    }, config.animate.duration)
  }

  /**
   * 停止动画
   */
  function stopAnimate() {
    clearInterval(config.animate.id)
    config.animate.id = null
  }

}


// 注册事件
function regEvent() {
  config.doms.divDots.onclick = function (e) {
    if (e.target.tagName === 'SPAN') {
      var index = Array.from(config.doms.divDots.children).indexOf(e.target) 
      switchTo(index, index > config.currentIndex ? 'right' : 'left')
    }
  }

  config.doms.divArrows.onclick = function (e) {
    if (e.target.className === 'item left') {
      // 左
      var index = config.currentIndex - 1
      if (index < 0) {
        index = config.imgNumber - 1
      }
      switchTo(index, 'left')
    } else {
      // 右
      var index = config.currentIndex + 1
      if (index > config.imgNumber - 1) {
        index = 0
      }
      switchTo(index, 'right')
    }
  }
}







