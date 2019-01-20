module.exports = function generateToc(md){
  md = md.replace(/```[\s\S]*?```/g, '');
  console.log(/#\s123/.test(md));
  var re = /^\s*(#{1,6})\s+(.+)$/mg
  var tocList = []

  while(true){
    var match = re.exec(md)
    if(!match) break;
    console.log(match[0], match[1], match[2])
    tocList.push({
      level: match[1].length,
      content: match[2].replace('\n', ''),
      all: match[0]
    })
  }

  // 找出最大是几级标题
  var minLevel = Math.min(...tocList.map(t => t.level))

  //  - [提示](#提示)
  var tocStr = tocList
               .map(item => '  '.repeat(item.level - minLevel) + '- ' + `[${item.content}](#${item.content})` )
               .join('\n')

  //<a name="锚点" id="锚点"></a>
  for(let t of tocList){
    md = md.replace(t.all, `<a name="${t.content}" id="${t.content}"><h${t.level}>${t.content}</h${t.level}></a>`)
  }

  newMd = `#### 目录

${tocStr}

${md}
`
  return newMd
}