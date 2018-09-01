var fs = require('fs');
var md = fs.readFileSync('./test.md', 'utf8');

var generateToc = require('./toc.js');

var newMd = generateToc(md);

fs.writeFileSync('./newMd.md', newMd, 'utf8')
