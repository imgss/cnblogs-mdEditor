let ajaxUrl = "https://upload.cnblogs.com/imageuploader/CorsUpload";

// https://www.cnblogs.com/MainActivity/p/8550895.html
function dataURLtoFile(dataurl, filename) {//将base64转换为文件
  let arr = dataurl.split(','), 
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), 
      n = bstr.length, 
      u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    if (request.contentScriptQuery == "uploadFile") {
      let {file, filename, uploadType} = request;
      let formData = new FormData();
      formData.append("imageFile", dataURLtoFile(file, filename));
      formData.append("host", "www.cnblogs.com");
      formData.append("uploadType", uploadType);
      console.log(formData);
      fetch(ajaxUrl, {
        credentials: 'include',
        body: formData,
        method: 'POST',
        mode: 'cors'
      })
      .then(response => response.json())
      .then(res => sendResponse(res))
      .catch(error => {
        sendResponse({success: false});
      });
      return true;  // Will respond asynchronously.
    }
  });