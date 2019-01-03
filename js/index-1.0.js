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
    imgData = null;
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
  // 传递一个对象，返回对应的结构字符串
  let queryHTML = ({
    id,
    pic,
    link,
    title
  } = {}) => {
    // console.log(1)
    return `<a href="${link}">
    <div><img src="${pic}" alt=""></div>
    <span>${title}</span>
</a>`
  }
  let $boxList = $('.flowBox > li'),
    // 将类数组转换为数组  借用原型上的slice方法，将方法中的this改为对应的
    boxList = [].slice.call($boxList);
  // 把jq类数组对象转换为数组（get不能传参，传参数就是获取数组中的某一项了）
  // console.log($boxList.get())
  for (let i = 0; i < imgData.length; i += 3) {
    let item1 = imgData[i],
      item2 = imgData[i + 1],
      item3 = imgData[i + 2];
    // 接下来要把获取的item依次插入到每一个li中，但是绝对不是按照顺序插入，我们需要先按照每一个li的现有高度给li进行排序（小->大），按照最新的顺序依次插入即可
    boxList.sort((a, b) => a.offsetHeight - b.offsetHeight)
    if (item1) {
      boxList[0].innerHTML += queryHTML(item1);
    }
    if (item2) {
      boxList[1].innerHTML += queryHTML(item2);
    }
    if (item3) {
      boxList[2].innerHTML += queryHTML(item3);
    }
  }
});