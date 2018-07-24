'use strict';

console.log('hello wolrd');
var textarea = document.getElementById('Editor_Edit_EditorBody');
console.log(chrome.storage)
var getSetting = function(){
    return new Promise((resolve, jeject) => {
        chrome.storage.sync.get({theme: 'dark'}, function(items){
            resolve(items)
        });
    });
}

getSetting().then(items => {
console.log(items.theme)
var editor = CodeMirror.fromTextArea(textarea, {
  mode:  'markdown',
  value: '',
  theme: 'default ' +  (items.theme === 'dark' ? '3024-night' : ''),
  allowDropFileTypes: ['image/png', 'image/jpeg'],
  lineNumbers: false
});
editor.on('change', function(target, e){
  textarea.value = target.getValue()
})
editor.on('drop', function(target, e){
  console.log(e.dataTransfer.files)
})
textarea.addEventListener('input', function(){
  editor.doc.setValue(this.value)
});

// 上传图片 author: cnblogs.com

(function ($) {
  var $this;
  var $host;
  var $textarea = $('#Editor_Edit_EditorBody');
  var $ajaxUrl = 'https://upload.cnblogs.com/imageuploader/CorsUpload';    

  $.fn.pasteUploadImage = function (host) {
      $this = $(this);
      $host = host;
      $this.on('paste', function (event) {
          var filename, image, pasteEvent, text;
          pasteEvent = event.originalEvent;
          if (pasteEvent.clipboardData && pasteEvent.clipboardData.items) {
              image = isImage(pasteEvent);
              if (image) {                   
                  filename = getFilename(pasteEvent) || generateFilename();
                  text = "{{" + filename + "(uploading...)}}";
                  pasteText(text);
                  var file = image.getAsFile();
                  event.preventDefault();
                  return uploadFile(file, filename, 'Paste');
              }
          }
      });
      $this.on('drop', function (event) {
          var filename, image, pasteEvent, text;
          pasteEvent = event.originalEvent;
          if (pasteEvent.dataTransfer && pasteEvent.dataTransfer.files) {
              image = isImageForDrop(pasteEvent);
              if (image) {
                  event.preventDefault();
                  filename = pasteEvent.dataTransfer.files[0].name || generateFilename();
                  text = "{{" + filename + "(uploading...)}}";
                  pasteText(text);
                  return uploadFile(image, filename, 'Drop');
              }
          }
      });
  };

  $textarea.on('input', function(){
      editor.doc.setValue(this.value)
  })

  var pasteText = function (text) {
      var afterSelection, beforeSelection, caretEnd, caretStart, textEnd;
      caretStart = $textarea[0].selectionStart;
      caretEnd = $textarea[0].selectionEnd;
      textEnd = $textarea.val().length;
      beforeSelection = $textarea.val().substring(0, caretStart);
      afterSelection = $textarea.val().substring(caretEnd, textEnd);
      $textarea.val(beforeSelection + text + afterSelection);
      $textarea.get(0).setSelectionRange(caretStart + text.length, caretEnd + text.length);
      return $textarea.trigger("input");
  };
  var isImage = function (data) {
      var i, item;
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
  var isImageForDrop = function (data) {
      var i, item;
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
  var getFilename = function (e) {
      var value;
      if (window.clipboardData && window.clipboardData.getData) {
          value = window.clipboardData.getData("Text");
      } else if (e.clipboardData && e.clipboardData.getData) {
          value = e.clipboardData.getData("text/plain");
      }
      value = value.split("\r");
      return value[0];
  };    
  var uploadFile = function (file, filename, uploadType) {
      var formData = new FormData();
      formData.append('imageFile', file);
      formData.append("host", $host);
      formData.append("uploadType", uploadType);

      $.ajax({
          url: $ajaxUrl,
          data: formData,
          type: 'post',
          timeout: 300000,
          processData: false,
          contentType: false,
          dataType: 'json',
          xhrFields: {
              withCredentials: true
          },
          success: function (data) {
              if (data.success) {
                  return insertToTextArea(filename, data.message);
              }
              replaceLoadingTest(filename);
              alert("上传失败! " + data.message)
          },
          error: function (xOptions, textStatus) {
              replaceLoadingTest(filename);
              alert("上传失败! " + xOptions.responseText);
          }
      });
  };
  var insertToTextArea = function (filename, url) {
      return $textarea.val(function (index, val) {
          return val.replace("{{" + filename + "(uploading...)}}", "![](" + url + ")" + "\n");
      }).trigger('input');
  };
  var replaceLoadingTest = function (filename) {
      return $textarea.val(function (index, val) {
          return val.replace("{{" + filename + "(uploading...)}}", filename + "\n");
      }).trigger('input');
  };
  var generateFilename = function () {
      return 'uploading-image-' + Math.floor(Math.random() * 1000000) + '.png';
  };
})(jQuery);
$('.CodeMirror').pasteUploadImage('www.cnblogs.com');
})