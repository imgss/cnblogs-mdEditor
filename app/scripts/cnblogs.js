"use strict";

let textarea = document.getElementById("Editor_Edit_EditorBody");
//获取设置
let getSetting = function() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get({ theme: "dark", fontSize: 14 }, function(items) {
      resolve(items);
    });
  });
};

getSetting().then(items => {
  //初始化editor
  let editor = CodeMirror.fromTextArea(textarea, {
    mode: "markdown",
    value: "",
    lineWrapping: true,
    theme: "default " + (items.theme === "dark" ? "3024-night" : ""),
    allowDropFileTypes: ["image/png", "image/jpeg"],
    lineNumbers: false
  });

  textarea.nextElementSibling.style.fontSize = items.fontSize + "px";
  console.log(editor);

  editor.on("change", function(target, e) {
    textarea.value = target.getValue();
  });

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

  // 支持生成TOC
  function generateToc(md) {
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
        }></a>`
      );
    }

    let newMd = `#### 目录

${tocStr}

${md}
`;
    return newMd;
  }
  let tocBtn = document.createElement("div");
  tocBtn.textContent = "生成目录";
  tocBtn.style = `
display: inline-block;
color: #002C99;
font-size: 16px;
float: right;
text-shadow: 1px 1px 2px;
cursor: pointer`;
  tocBtn.animate(
    [{ transform: "translateX(10px)" }, { transform: "translateX(-10px)" }],
    {
      duration: 3000,
      direction: "alternate",
      iterations: Infinity
    }
  );
  tocBtn.addEventListener("click", function(e) {
    e.stopPropagation();
    let md = editor.getValue();
    let newMd = generateToc(md);
    editor.setValue(newMd);
  });

  document.querySelector('[title="上传图片"]').after(tocBtn);
});
