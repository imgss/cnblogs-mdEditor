'use strict';

console.log('hello wolrd');
var textarea = document.getElementById('Editor_Edit_EditorBody');
var editor = CodeMirror.fromTextArea(textarea, {
  mode:  'markdown',
  value: '',
  lineNumbers: false
});
console.log(editor);
editor.on('change', function(target, e){
  textarea.value = target.getValue()
  console.log(e)
})
textarea.addEventListener('input', function(){
  console.log(this.value)
  editor.doc.setValue(this.value)
})