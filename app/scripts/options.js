chrome.storage.sync.get({
  theme: 'dark'
},function(items){
  current.innerHTML = items.theme || 1
  document.getElementById('theme').value = items.theme
});
document.getElementById('theme').onchange = function(){
  current.innerHTML = this.value
  chrome.storage.sync.set({
    theme: this.value
  })
}