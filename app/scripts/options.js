chrome.storage.sync.get({
  theme: 'dark',
  fontSize: 14
},function(items){
  console.log(items)
  current.innerHTML = items.theme || 1
  ft.textContent = items.fontSize
  document.getElementById('theme').value = items.theme
  document.getElementById('fontsize').value = items.fontSize
});
document.getElementById('theme').onchange = function(){
  current.innerHTML = this.value
  chrome.storage.sync.set({
    theme: this.value
  })
}
document.getElementById('fontsize').onchange = function(){
  console.log(this.value)
  ft.textContent = this.value
  chrome.storage.sync.set({
    fontSize: this.value
  })
}