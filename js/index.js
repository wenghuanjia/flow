/* 
瀑布流
  效果：多列的不规则排列，每一列中有很多内容，每一项内容的高度不定，最后我们按照规则排列，三列之间不能相差太多高度
  实现：首先获取需要展示的数据（假设有50条，公三列），把50条数据中的前三条依次插入到三列中（目前有的列高有的列低），接下来在拿出三条数据，但是本次插入不是一次插入，而是需要现把当前三列按照高矮进行排序，哪个最矮，先给哪个插入内容，依次类推，把50条数据插入即可
*/
$(function () {
  // 当html结构加载完成才会执行这里的代码（闭包）
  // 1. 获取需要的数据
  // 真实项目中，我们第一页加载完成，当用户下拉到底部，开始获取第二页的内容，服务器端会给我们提供一个api获取数据的地址，并要求客户端把获取的是第几页的内容传递给服务器，服务器按照这个原理把对应不同的数据返回"分页技术"
  let page = 0,
    imgData = null,
    isRun = false; // 标识
  let queryData = () => {
    page++;
    $.ajax({
      url: `json/data.json?page=${page}`,
      method: 'get',
      async: false,
      dataType: 'json', // 把从服务器获取的json字符串转换为对象(jq内部会帮我们转换)
      success: result => {
        // result就是我们从服务器端获取的结果
        imgData = result;
      }
    });
  }
  queryData();
  // console.log(imgData)
  // 2. 数据绑定
  // 获取需要的元素
  let bindHTML = () => {
    let $boxList = $('.flowBox > li');
    for (let i = 0; i < imgData.length; i += 3) {
      $boxList.sort((a, b) => {
        return $(a).outerHeight() - $(b).outerHeight()
      }).each((index, curLi) => {
        let item = imgData[i + index];
        if (!item) return;
        let {
          id,
          pic,
          link,
          title
        } = item;
        $(` <a href="${link}">
                <div><img src="${pic}" alt=""></div>
                <span>${title}</span>
            </a>`).appendTo($(curLi))
      })
    }
    isRun = false;
  }
  bindHTML();
  // 当滚动到页面底部的时候，加载下一页的更多数据
  $(window).on('scroll', () => {
    let winH = $(window).outerHeight(),
      pageH = document.documentElement.scrollHeight || document.body.scrollHeight,
      scrollT = $(window).scrollTop();
    // console.log(winH, pageH, scrollT)
    // 卷曲的高度 大于 真实的高度 - 屏幕高度：距离底下还有100px，我们让其开始加载更多的数据
    if ((scrollT + 100) > (pageH - winH)) {
      // 隐性问题：人为操作滚动，这个在同一个操作内会被触发n次---重复操作限定
      if (isRun) return;
      isRun = true;
      if (page > 5) {
        alert('无数据')
        return
      }
      queryData();
      bindHTML();
    }
  })
});