"use strict";

let textarea = document.getElementById("Editor_Edit_EditorBody");
let cssTextarea = document.getElementById('Edit_txbSecondaryCss');
let htmlTextareas = document.querySelectorAll('#Edit_EditorBody,#Edit_txbPageBeginHtml,#Edit_txbPageEndHtml');
// 不显示默认的上传图片按钮
let uploaderImg = document.querySelector('#edit_body>img')
if (uploaderImg) {
  uploaderImg.style.display = 'none'
}


//获取设置
let getSetting = function() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get({ theme: "dark", fontSize: 14 }, function(items) {
      resolve(items);
    });
  });
};

getSetting().then(items => {
  // 设置页面 https://i.cnblogs.com/Configure.aspx 初始化编辑器
  if (cssTextarea) {
    CodeMirror.fromTextArea(cssTextarea, {
      mode: "css",
      lineWrapping: true,
      theme: "default ",
      lineNumbers: true
    });
    Array.from(htmlTextareas).forEach(function(textarea){
      CodeMirror.fromTextArea(textarea, {
        mode: {
          name: "htmlmixed",
          scriptTypes: [{matches: /\/x-handlebars-template|\/x-mustache/i,
                         mode: null}]
        },
        lineWrapping: false,
        theme: "default ",
        lineNumbers: false
      });
      textarea.nextElementSibling.style = 'height:300px;width:850px;padding:5px 10px;';
    });

    return;
  }
  // 加入icon样式
  initIconStyle();

  // 初始化editor
  let tipEl = document.getElementById('edit_body_tip')
  if(tipEl){
    let tips = document.getElementById('edit_body_tip').textContent;
    // 不改变除markdown外的其他编辑器
    if (!/Markdown/.test(tips)) {
      return
    }
  }
  // 初始化博客文本编辑器
  if(!textarea) return;
  let editor = CodeMirror.fromTextArea(textarea, {
    mode: "markdown",
    value: "",
    lineWrapping: true,
    theme: "default " + (items.theme === "dark" ? "3024-night" : ""),
    allowDropFileTypes: ["image/png", "image/jpeg"],
    lineNumbers: false
  });
  initEmoji(editor);

  textarea.nextElementSibling.style.fontSize = items.fontSize + "px";

  editor.on("change", function(target, e) {
    let value = target.getValue();
    textarea.value = value;
    updateWordsCounter(value);
  });

  function updateWordsCounter(str){
    let len = str.replace(/\s|\n|\r/mg, '').length
    document.querySelector('.word-count').textContent = `字数统计：${len}字`
  }


  editor.on("drop", function(target, e) {
    console.log(e.dataTransfer.files);
  });

  // 上传图片 author: cnblogs.com
  (function($) {
    let $this;
    let $host;
    let cursorPosi;
    let $textarea = $("#Editor_Edit_EditorBody");
    let $ajaxUrl = "https://upload.cnblogs.com/imageuploader/CorsUpload";

    $.fn.pasteUploadImage = function(host) {
      $this = $(this);
      $host = host;
      $this.on("paste", function(event) {
        let filename, image, pasteEvent, text;
        pasteEvent = event.originalEvent;
        if (pasteEvent.clipboardData && pasteEvent.clipboardData.items) {
          image = isImage(pasteEvent);
          if (image) {
            filename = getFilename(pasteEvent) || generateFilename();
            text = "{{" + filename + "(uploading...)}}";
            pasteText(text);
            let file = image.getAsFile();
            event.preventDefault();
            return uploadFile(file, filename, "Paste");
          }
        }
      });
      $this.on("drop", function(event) {
        let filename, image, pasteEvent, text;
        pasteEvent = event.originalEvent;
        if (pasteEvent.dataTransfer && pasteEvent.dataTransfer.files) {
          image = isImageForDrop(pasteEvent);
          if (image) {
            event.preventDefault();
            filename =
              pasteEvent.dataTransfer.files[0].name || generateFilename();
            text = "{{" + filename + "(uploading...)}}";
            pasteText(text);
            return uploadFile(image, filename, "Drop");
          }
        }
      });
    };

    $textarea.on("input", function(e) {
      editor.doc.setValue(this.value);
      editor.setCursor(cursorPosi);
    });

    let pasteText = function(text) {
      let afterSelection, beforeSelection, caretEnd, caretStart, textEnd, posi;
      cursorPosi = editor.getCursor();
      caretStart = editor.indexFromPos(cursorPosi);
      caretEnd = caretStart;
      textEnd = $textarea.val().length;
      beforeSelection = $textarea.val().substring(0, caretStart);
      afterSelection = $textarea.val().substring(caretEnd, textEnd);
      $textarea.val(beforeSelection + text + afterSelection);
      $textarea
        .get(0)
        .setSelectionRange(caretStart + text.length, caretEnd + text.length);
      return $textarea.trigger("updateEditor", posi);
    };

    let isImage = function(data) {
      let i, item;
      i = 0;
      while (i < data.clipboardData.items.length) {
        item = data.clipboardData.items[i];
        if (item.type.indexOf("image") !== -1) {
          return item;
        }
        i++;
      }
      return false;
    };

    let isImageForDrop = function(data) {
      let i, item;
      i = 0;
      while (i < data.dataTransfer.files.length) {
        item = data.dataTransfer.files[i];
        if (item.type.indexOf("image") !== -1) {
          return item;
        }
        i++;
      }
      return false;
    };

    let getFilename = function(e) {
      let value;
      if (window.clipboardData && window.clipboardData.getData) {
        value = window.clipboardData.getData("Text");
      } else if (e.clipboardData && e.clipboardData.getData) {
        value = e.clipboardData.getData("text/plain");
      }
      value = value.split("\r");
      return value[0];
    };

    let uploadFile = function(file, filename, uploadType) {
      let formData = new FormData();
      formData.append("imageFile", file);
      formData.append("host", $host);
      formData.append("uploadType", uploadType);

      $.ajax({
        url: $ajaxUrl,
        data: formData,
        type: "post",
        timeout: 300000,
        processData: false,
        contentType: false,
        dataType: "json",
        xhrFields: {
          withCredentials: true
        },
        success: function(data) {
          if (data.success) {
            return insertToTextArea(filename, data.message);
          }
          replaceLoadingTest(filename);
          alert("上传失败! " + data.message);
        },
        error: function(xOptions, textStatus) {
          replaceLoadingTest(filename);
          alert("上传失败! " + xOptions.responseText);
        }
      });
    };

    let insertToTextArea = function(filename, url) {
      return $textarea
        .val(function(index, val) {
          return val.replace(
            "{{" + filename + "(uploading...)}}",
            "![" + filename + "](" + url + ")" + "\n"
          );
        })
        .trigger("input");
    };

    let replaceLoadingTest = function(filename) {
      return $textarea
        .val(function(index, val) {
          return val.replace(
            "{{" + filename + "(uploading...)}}",
            filename + "\n"
          );
        })
        .trigger("input");
    };

    let generateFilename = function() {
      return "uploading-image-" + Math.floor(Math.random() * 1000000) + ".png";
    };
  })(jQuery);

  $(".CodeMirror").pasteUploadImage("www.cnblogs.com");

  // 初始化菜单
  let menu = new Menu([
    {
      text: '全屏模式',
      className: 'icon-full',
      listener: function(){
        let codeEl = document.querySelector('.CodeMirror');
        codeEl.webkitRequestFullScreen();
        // 退出全屏时重置宽高
        document.addEventListener('webkitfullscreenchange', function(e){
          if(codeEl.style.width === '100vw'){
            codeEl.style.width = ''
            codeEl.style.height= ''
          } else {
            codeEl.style.width = '100vw'
            codeEl.style.height= '100vh'
          }
        });
      }
    },
    {
      text: '🖼上传图片',
      listener: function(){
        alert('将图片拖到编辑器中即可')
      }
    },
    {
      text: '📜生成目录',
      listener: function(e) {
        e.stopPropagation();
        let md = editor.getValue();
        let newMd = generateToc(md);
        editor.setValue(newMd);
      }
    },
    {
      text: '📐显示行数',
      listener: function(){
        editor.setOption('lineNumbers', !editor.getOption('lineNumbers'));
      }
    },
    {
      text: '😂emoji',
      className: 'emoji',
      listener: function(e){
        e.stopPropagation();
        let emojiBoard = document.getElementById('emojiBoard');
        emojiBoard.style=`top:${e.pageY}px;left:${e.pageX}px`;
        let isHidden = emojiBoard.hidden;
        emojiBoard.hidden = !isHidden;
      }
    },
    {
      template: '<span class="iconfont doutu">🌚斗图<input type="search" placeholder="搜索表情包" style="width:80px" id="search"><span id="cnblog-md-editor-imgs" class="hidden"></span></span>',
      mounted: function(){
        let colorInput = $('#search');
        colorInput.on('input', throttle(function(e){
          if( !e.target.value) {
            return;
          }
          $.get(`https://www.doutula.com/api/search?keyword=${e.target.value}&mime=0`)
          .then(function(data){
            if (data.status === 1) {
              let html = data.data.list.map(img => {
                return `<img src=${img.image_url}>`
              });
              $('#cnblog-md-editor-imgs').html(html);
            }
          });
        }, 200));

        function throttle(fn, delay = 500, context) {
          var isLock = false
          return function () {
            if (isLock) return;
            isLock = true;
            let arg = arguments
            setTimeout(function(){
              fn.apply(context, arg);
              isLock = false;
            }, delay);
          }
        }

        $('#cnblog-md-editor-imgs').on(
          'click', 
          function(e) {
            e.stopPropagation();
            if(e.target.nodeName !== 'IMG') {
              return;
            }
            let cursor = editor.getCursor();
            let imgHtml = `<img width="30%" src="${e.target.src}" >`; // 默认插入图片是30%
            editor.replaceRange(imgHtml, cursor, cursor);
            $('#cnblog-md-editor-imgs').addClass('hidden');
          }
        );

        $(document.body).click(function(){
          $('#cnblog-md-editor-imgs').addClass('hidden');
        });
        $('.editor-menu').click(function(e){
          e.stopPropagation();
        });

        $('#search').on('focus', function(){
          $('#cnblog-md-editor-imgs').removeClass('hidden');
        })
      }
    },
    {
      template: '<span class="iconfont">🌈字体颜色<input type="color" style="width:40px" id="colorInput"></span>',
      mounted: function(){
        let colorInput = $('#colorInput');
        colorInput.change(function(e) {
          let selection = editor.getSelection();
          if (selection) {
            editor.replaceSelection(`<span style="color:${e.target.value}">${selection}</span>`);
          }
        })
      }
    },
    {
      text: '🈳️盘古之白',
      className: 'pangu',
      listener: function(){
        let md = editor.getValue();
        let newMd = pangu.spacing(md);
        editor.setValue(newMd);
      }
    },
    {
      text: '🧮字数',
      className: 'word-count'
    }
  ])
  menu.render();
  updateWordsCounter(textarea.value);
});

function generateToc(md) {
  // 过滤掉代码块中的 # 号
  md = md.replace(/```[\s\S]*?```/g, '');

  let re = /^\s*(#{1,6})\s+(.+)$/gm;
  let tocList = [];

  while (true) {
    let match = re.exec(md);
    if (!match) break;
    console.log(match[0], match[1], match[2]);
    tocList.push({
      level: match[1].length,
      content: match[2].replace("\n", ""),
      all: match[0]
    });
  }

  // 找出最大是几级标题
  let minLevel = Math.min(...tocList.map(t => t.level));

  //  - [提示](#提示)
  let tocStr = tocList
    .map(
      item =>
        "  ".repeat(item.level - minLevel) +
        "- " +
        `[${item.content}](#${item.content})`
    )
    .join("\n");

  //<a name="锚点" id="锚点"></a>
  for (let t of tocList) {
    md = md.replace(
      t.all,
      `<a name="${t.content}" id="${t.content}"><h${t.level}>${t.content}</h${
        t.level
      }></a>\n`
    );
  }

  let newMd = `#### 目录

${tocStr}

${md}
`;
  return newMd;
}

function initEmoji (cm) {
  let emojis = Object.values(emoji_list).map(e => e.char)
  let dashBoard = document.createElement('div');
  dashBoard.id = 'emojiBoard';
  dashBoard.hidden = true;
  dashBoard.innerHTML = emojis.map(e => `<span>${e}</span>`).join('');
  // 插入emoji
  dashBoard.onclick = function(e){
    e.stopPropagation();
    if (e.target.nodeName === 'SPAN') {
      let cursor = cm.getCursor()
      cm.replaceRange(e.target.textContent, cursor, cursor);
    }
  }
  document.body.appendChild(dashBoard);

  document.body.onclick = function(){
    dashBoard.hidden = true;
  }
}

function initIconStyle(){
  let link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://at.alicdn.com/t/font_871145_xnvcmxbtu8h.css';
  document.head.appendChild(link);
}

function Menu(menuItems){
  this.menuList = [];
  this.menuItems = menuItems;
  if(Array.isArray(menuItems)){
    for(let menu of menuItems){
      this.addMenuItem(menu);
    }
  }
}
Menu.prototype.addMenuItem = function({text, className, listener, template}){
  if(template){
    let menuEl = $(template).click(listener)[0]
    this.menuList.push(menuEl)
  } else {
    let el = document.createElement('span');
    el.className = 'iconfont ' + className;
    el.textContent = text;
    if(listener){
      el.addEventListener('click', listener.bind(this.el));
    }
    this.menuList.push(el);
  }
}
Menu.prototype.render  = function(){
  let div = document.createElement('div');
  div.className = 'editor-menu';
  for(let menu of this.menuList){
    div.appendChild(menu);
  }
  document.querySelector('[title="上传图片"]').after(div);
  for (let menuItem of this.menuItems) {
    if (menuItem.mounted) {
      menuItem.mounted();
    }
  }
}