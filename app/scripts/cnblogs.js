'use strict';

console.log('hello wolrd');
var textarea = document.getElementById('Editor_Edit_EditorBody');
var editor = CodeMirror.fromTextArea(textarea, {
  mode:  'markdown',
  value: '',
  theme: 'default 3024-night',
  lineNumbers: false
});
editor.on('change', function(target, e){
  textarea.value = target.getValue()
})
textarea.addEventListener('input', function(){
  editor.doc.setValue(this.value)
})