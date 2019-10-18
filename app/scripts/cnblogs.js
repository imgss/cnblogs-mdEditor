"use strict";

//获取设置
const getSetting = function() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({ theme: "3024-night", fontSize: 14 }, function(items) {
      resolve(items);
    });
  });
};
getSetting().then(config => {
  // 当前页面是设置页面时 
  const cssTextarea = document.getElementById("Edit_txbSecondaryCss");
  if (cssTextarea) {
    initSettingEditors(cssTextarea);
  } else {
    // 加入icon样式
    initIconStyle();
    // 初始化markdown editor
    initMdEditor(config);
  }
});

function updateWordsCounter(str) {
  let len = str.replace(/\s|\n|\r/gm, "").length;
  document.querySelector(".word-count").textContent = `字数：${len}字`;
}

function generateToc(md) {
  // 过滤掉代码块中的 # 号
  md = md.replace(/```[\s\S]*?```/g, "");

  let re = /^\s*(#{1,6})\s+(.+)$/gm;
  let tocList = [];

  while (true) {
    let match = re.exec(md);
    if (!match) break;
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
      `<a name="${t.content}" id="${t.content}"><h${t.level}>${t.content}</h${t.level}></a>\n`
    );
  }

  let newMd = `#### 目录

${tocStr}

${md}
`;
  return newMd;
}

function initEmoji(cm) {
  let emojis = Object.values(emoji_list).map(e => e.char);

  const emojiBoard = $(`<div id="emojiBoard" style="display:none"></div>`);
  emojiBoard.html(emojis.map(e => `<span>${e}</span>`).join(""));
  // 插入emoji
  emojiBoard.click(function(e) {
    e.stopPropagation();
    if (e.target.nodeName === "SPAN") {
      let cursor = cm.getCursor();
      cm.replaceRange(e.target.textContent, cursor, cursor);
    }
  }).appendTo(document.body);

  document.body.onclick = function() {
    emojiBoard.hide();
  };
}

function initIconStyle() {
  let link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://at.alicdn.com/t/font_871145_xnvcmxbtu8h.css";
  document.head.appendChild(link);
}

function initSettingEditors(cssTextarea) {
  CodeMirror.fromTextArea(cssTextarea, {
    mode: "css",
    lineWrapping: true,
    theme: "default ",
    lineNumbers: true
  });
  const htmlTextareas = document.querySelectorAll(
    "#Edit_EditorBody,#Edit_txbPageBeginHtml,#Edit_txbPageEndHtml"
  );
  Array.from(htmlTextareas).forEach(function(textarea) {
    CodeMirror.fromTextArea(textarea, {
      mode: {
        name: "htmlmixed",
        scriptTypes: [
          { matches: /\/x-handlebars-template|\/x-mustache/i, mode: null }
        ]
      },
      lineWrapping: false,
      theme: "default ",
      lineNumbers: false
    });
    textarea.nextElementSibling.style =
      "height:300px;width:850px;padding:5px 10px;";
  });
}

function initMdEditor(config) {
  const textarea = $("#Editor_Edit_EditorBody")[0];
  if (!textarea) return;

  // 不改变除markdown外的其他编辑器
  let tips = $("#edit_body_tip").text();
  if (!/Markdown/.test(tips)) {
    return;
  }

  // 不显示默认的上传图片按钮
  $("#edit_body>img").hide();

  // 初始化博客文本编辑器
  const editor = CodeMirror.fromTextArea(textarea, {
    mode: {
      name: "gfm",
      tokenTypeOverrides: {
        emoji: "emoji"
      }
    },
    value: "",
    lineWrapping: true,
    theme: "default " + config.theme,
    allowDropFileTypes: ["image/png", "image/jpeg"],
    lineNumbers: false
  });
  initEmoji(editor);

  function  setSelectionColor(color) {
    const selection = editor.getSelection();
    if (selection) {
      editor.replaceSelection(`<span style="color:${color}">${selection}</span>`);
    }
  }

  // 修复「恢复」缓存的功能
  $("#Posts").click(function(e) {
    if (e.target.textContent === "恢复") {
      setTimeout(function() {
        editor.setValue(textarea.value);
      }, 0);
    }
  });
 $(textarea).css({fontSize: config.fontSize});

  editor.on("change", function(target) {
    let value = target.getValue();
    textarea.value = value;
    updateWordsCounter(value);
  });

  // 右键快捷菜单
  editor.on("contextmenu", function(cm, e) {
    e.preventDefault();
    const selection = cm.getSelection();
    const posi = cm.getCursor();
    if (selection) {
      const widget = $(`<ul class="menu">
        <li class='color'>设置字体颜色</li>
      </ul>`)[0];
      cm.addWidget(posi, widget);
      cm.myWidget = widget;
      $(widget).on('click', 'li.color', function() {
        setSelectionColor($('#colorInput').val());
      });
    }
  });

  $(document.body).click(function() {
    if (editor.myWidget) {
      editor.myWidget.remove();
    }
  });

  initPasteUploadImage(editor);
  $(".CodeMirror").pasteUploadImage();

  // 初始化菜单
  const menu = new Menu([
    {
      text: "全屏模式",
      className: "icon-full",
      listener: function() {
        let codeEl = $(".CodeMirror")[0];
        codeEl.webkitRequestFullScreen();
        // 退出全屏时重置宽高
        document.addEventListener("webkitfullscreenchange", function() {
          if (codeEl.style.width === "100vw") {
            codeEl.style.width = "";
            codeEl.style.height = "";
          } else {
            codeEl.style.width = "100vw";
            codeEl.style.height = "100vh";
          }
        });
      }
    },
    {
      text: "🖼上传图片",
      listener: function() {
        alert("将图片拖到编辑器中即可");
      }
    },
    {
      text: "📜生成目录",
      listener: function(e) {
        e.stopPropagation();
        let md = editor.getValue();
        let newMd = generateToc(md);
        editor.setValue(newMd);
      }
    },
    {
      text: "📐显示行数",
      listener: function() {
        editor.setOption("lineNumbers", !editor.getOption("lineNumbers"));
      }
    },
    {
      text: "主题切换",
      template: `<span class="iconfont">🎨主题切换 <select id="themePicker"></select></span>`,
      mounted: function() {
        const options = [
          "default",
          "3024-night",
          "abcdef",
          "ambiance",
          "base16-dark",
          "base16-light",
          "bespin",
          "blackboard",
          "cobalt",
          "colorforth",
          "darcula",
          "dracula",
          "duotone-dark",
          "duotone-light",
          "eclipse",
          "elegant",
          "erlang-dark",
          "gruvbox-dark",
          "hopscotch",
          "icecoder",
          "idea",
          "isotope",
          "lesser-dark",
          "liquibyte",
          "lucario",
          "material",
          "material-darker",
          "material-palenight",
          "material-ocean",
          "mbo",
          "mdn-like",
          "midnight",
          "monokai",
          "moxer",
          "neat",
          "neo",
          "night",
          "nord",
          "oceanic-next",
          "panda-syntax",
          "paraiso-dark",
          "paraiso-light",
          "pastel-on-dark",
          "railscasts",
          "rubyblue",
          "seti",
          "shadowfox",
          "solarized dark",
          "solarized light",
          "the-matrix",
          "tomorrow-night-bright",
          "tomorrow-night-eighties",
          "ttcn",
          "twilight",
          "vibrant-ink",
          "xq-dark",
          "xq-light",
          "yeti",
          "yonce",
          "zenburn"
        ];

        $('#themePicker')
        .html(options.map(o => `<option>${o}</option>`).join(''))
        .val(config.theme || 'default')
        .change(e => {
          editor.setOption("theme", e.target.value);
          chrome.storage.sync.set({
            theme: e.target.value
          });
        });
      }
    },
    {
      text: "😂emoji",
      className: "emoji",
      listener: function(e) {
        e.stopPropagation();
        $("#emojiBoard").css({top: e.pageY, left: e.pageX}).show();
      }
    },
    {
      template:
        '<span class="iconfont doutu">🌚斗图<input type="search" placeholder="搜索表情包" id="search"><span id="cnblog-md-editor-imgs" class="hidden"></span></span>',
      mounted: function() {
        let search = $("#search");
        search.on(
          "input",
          throttle(function(e) {
            if (!e.target.value) {
              return;
            }
            $.get(
              `https://www.doutula.com/api/search?keyword=${e.target.value}&mime=0`
            ).then(function(data) {
              if (data.status === 1) {
                let html = data.data.list.map(img => {
                  return `<img src=${img.image_url}>`;
                });
                $("#cnblog-md-editor-imgs").html(html);
              }
            });
          }, 200)
        );

        function throttle(fn, delay = 500, context) {
          var isLock = false;
          return function() {
            if (isLock) return;
            isLock = true;
            let arg = arguments;
            setTimeout(function() {
              fn.apply(context, arg);
              isLock = false;
            }, delay);
          };
        }

        $("#cnblog-md-editor-imgs").on("click", function(e) {
          e.stopPropagation();
          if (e.target.nodeName !== "IMG") {
            return;
          }
          let cursor = editor.getCursor();
          let imgHtml = `<img width="30%" src="${e.target.src}" >`; // 默认插入图片是30%
          editor.replaceRange(imgHtml, cursor, cursor);
          $("#cnblog-md-editor-imgs").addClass("hidden");
        });

        $(document.body).click(function() {
          $("#cnblog-md-editor-imgs").addClass("hidden");
        });
        $(".editor-menu").click(function(e) {
          e.stopPropagation();
        });

        $("#search").on("focus", function() {
          $("#cnblog-md-editor-imgs").removeClass("hidden");
        });
      }
    },
    {
      template:
        '<span class="iconfont"><span id="colorLabel">🌈字体颜色</span><input type="color" style="width:40px" id="colorInput"></span>',
      mounted: function() {
        $("#colorInput").change(function(e) {
          setSelectionColor(e.target.value);
        });

        $("#colorLabel").click(function() {
          setSelectionColor($('#colorInput').val());
        });
      }
    },
    {
      text: "🈳️盘古之白",
      className: "pangu",
      listener: function() {
        let md = editor.getValue();
        let newMd = pangu.spacing(md);
        editor.setValue(newMd);
      }
    },
    {
      text: "🧮字数",
      className: "word-count"
    }
  ]);
  menu.render();
  updateWordsCounter(textarea.value);
}

function initPasteUploadImage(editor) {
  // 上传图片 author: cnblogs.com
  let $this;
  let cursorPosi;
  let $textarea = $("#Editor_Edit_EditorBody");

  $.fn.pasteUploadImage = function() {
    $this = $(this);
    $this.on("paste", function(event) {
      let filename, image, pasteEvent, text;
      pasteEvent = event.originalEvent;
      if (pasteEvent.clipboardData && pasteEvent.clipboardData.items) {
        image = isImage(pasteEvent);
        if (image) {
          event.preventDefault();
          filename = getFilename(pasteEvent) || generateFilename();
          text = "{{" + filename + "(uploading...)}}";
          pasteText(text);
          let file = image.getAsFile();
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

  $textarea.on("input", function() {
    editor.doc.setValue(this.value);
    editor.setCursor(cursorPosi);
  });

  let pasteText = function(text) {
    console.log(text);
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
  // 上传图片
  let uploadFile = function(file, filename, uploadType) {
    var reader = new FileReader();
    reader.onload = function(e) {
      // chrome 73之后无法在content scripts中跨域请求
      // https://www.chromium.org/Home/chromium-security/extension-content-script-fetches
      chrome.runtime.sendMessage(
        {
          contentScriptQuery: "uploadFile",
          file: e.target.result,
          filename: filename,
          uploadType: uploadType
        },
        res => {
          if (res.success) {
            return insertToTextArea(filename, res.message);
          }
          replaceLoadingTest(filename);
          alert("上传失败! " + res.message);
        }
      );
    };
    reader.readAsDataURL(file);
  };
  // 上传文件后将图片地址插入编辑器
  let insertToTextArea = function(filename, url) {
    return $textarea
      .val(function(index, val) {
        let re = new RegExp(
          String.raw`(${filename})?\{\{${filename}\(uploading...\)\}\}`
        );
        return val.replace(re, "![" + filename + "](" + url + ")" + "\n");
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
}

function Menu(menuItems) {
  this.menuList = [];
  this.menuItems = menuItems;
  if (Array.isArray(menuItems)) {
    for (let menu of menuItems) {
      this.addMenuItem(menu);
    }
  }
}
Menu.prototype.addMenuItem = function({ text, className, listener, template }) {
  if (template) {
    let menuEl = $(template).click(listener)[0];
    this.menuList.push(menuEl);
  } else {
    let el = document.createElement("span");
    el.className = "iconfont " + className;
    el.textContent = text;
    if (listener) {
      el.addEventListener("click", listener.bind(this.el));
    }
    this.menuList.push(el);
  }
};
Menu.prototype.render = function() {
  let div = document.createElement("div");
  div.className = "editor-menu";
  for (let menu of this.menuList) {
    div.appendChild(menu);
  }
  document.querySelector('[title="上传图片"]').after(div);
  for (let menuItem of this.menuItems) {
    if (menuItem.mounted) {
      menuItem.mounted();
    }
  }
};
