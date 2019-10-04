var container = document.querySelector('ul')

var loading = document.querySelector('.loading')

var noData = document.querySelector('.no-data')

// 是否正在获取数据
var isFetching = false  

// 获取的是第几页的数据
var page = 1

var hasMoreDate = true 

/**
 * 根据一个电影数据，创建一个电影项，并插入到容器中
 * @param {*} movie 
 */
function createLi(movie) {
  var li = document.createElement('li')
  li.innerHTML = `
    <a href="" class="cover">
    <img src=${movie.cover} alt="">
    </a>
    <h2>${movie.title}</h2>
    <p>
      ${movie.description}
    </p>
  `
  container.appendChild(li)
}

/**
 * 添加多个电影项
 * @param {*} movies 电影数组
 */
function createLis(movies) {
  movies.forEach(movie => {
    createLi(movie)
  });
}

/**
 * 获取电影数组 如果直接写返回值 意味着同步获取
 * @param {} callback 获取数据后执行的回调 
 */
function fetchDatas(callback) {
  setTimeout(() => {
    if (page === 3) {
      // 模拟没有数据了
      callback([])
      return;
    }
    var movies = movieData
    callback(movies)
    page ++
  }, 1000);
}

// fetchDatas(function (movies) {
//   console.log(movies)
// })

function getMoreMovies() {
  // 该函数某个时间段只能运行一次
  if (!hasMoreDate || isFetching) {
    return;
  }
  isFetching = true
  // 显示loading
  loading.style.display = 'block'
  // 隐藏
  fetchDatas(function (movies) {
    createLis(movies)
    loading.style.display = 'none'
    // 标记一下是否有数据
    if (movies.length === 0) {
      hasMoreDate = false
      // 显示tip
      noData.style.display = 'block'
    } 
    isFetching = false 
  })

}

getMoreMovies()

// 注册滚动条事件

window.onscroll = function () {
  // 无限滚动的核心代码
  var de = document.documentElement
  var scrollHeight = de.scrollHeight
  var scrollTop = de.scrollTop
  var clientHeight = de.clientHeight
  var bottom = scrollHeight - scrollTop - clientHeight

  if (bottom <= 60) {
     getMoreMovies()
  }
} 