//https://www.cnblogs.com/
/**
 * 用于支持首页博文的排序功能
 * 支持按推荐/ 按阅读量/  按评论量/ 按默认排序
 */
(function(){
  if (/^https:\/\/www\.cnblogs\.com\/#?/.test(window.location.href)) {
    let $postList = $('#post_list');
    $postList.before(`<div class="sorter">
      <span class="btn recommend">按推荐</span>
      <span class="btn read">按阅读</span>
      <span class="btn comment">按评论</span>
      <span class="btn dft">按默认</span>
      <span class="btn">⇅</span>
    </div>`);
    let dftHTML;
    if ($('#tips_block').length === 1) {
      // 加载状态
      setDefaultHTML();
    } else {
      // 博文加载完毕
      dftHTML = $postList.html();
    }
    window.onhashchange = setDefaultHTML;

    function setDefaultHTML(){
      let timer = setInterval(function() {
        let postLength = $('#post_list .post_item').length;
        if (postLength > 0) {
          dftHTML = $postList.html();
          clearInterval(timer);
        }
      }, 100);
    }

    // 按推荐排序
    $('.sorter .recommend').click(function() {
      let sortFunction = (el1, el2) => $(el2).find('.diggnum').text() - $(el1).find('.diggnum').text();
      sort(sortFunction);
    });

    // 按阅读量排序
    $('.sorter .read').click(function() {
      function sortFunction(el1, el2) {
        let read_el1 = $(el1).find('.article_view>a');
        let read_el2 = $(el2).find('.article_view>a');
        return read_el2.text().trim().slice(3, -1) - read_el1.text().trim().slice(3, -1);
      };
      sort(sortFunction);
    });

    // 按评论排序
    $('.sorter .comment').click(function() {
      function sortFunction(el1, el2) {
        let comment_el1 = $(el1).find('.article_comment>.gray');
        let comment_el2 = $(el2).find('.article_comment>.gray');
        return comment_el2.text().trim().slice(3, -1) - comment_el1.text().trim().slice(3, -1);
      };
      sort(sortFunction);
    });

    // 默认排序
    $('.sorter .dft').click(function() {
      $postList.html(dftHTML);
    });
  
    (a,b) => $(a).find('.diggnum').text() - $(b).find('.diggnum').text();
  }
  function sort(sortFunction) {
    let $0 = document.getElementById('post_list');
    $0.innerHTML = Array.from($0.children).sort(sortFunction).map(el => el.outerHTML).join('');
  }
})();
