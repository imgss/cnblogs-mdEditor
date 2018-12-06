# cnblogs md editor
-----

由于博客园的markdown编辑器不是很好用，撸了一个chrome插件，改善一下用户体验

## feature

- 支持设置主题(light/dark)
- 支持设置字体大小
- 支持生成toc目录
- 支持编辑器全屏
- 支持切换行数显示
- 支持emoji
- 支持[盘古之白](https://github.com/vinta/pangu.js)
- 支持高亮设置页面中的自定义css

**注意**:使用盘古之白时，emoji缩写的第一个冒号后面会被加空格，造成页面渲染不出表情，可通过在第一个冒号前面加空格解决

## TODO

- [x] 支持emoji

## 截图

- 高亮markdown代码

![效果图](https://raw.githubusercontent.com/imgss/cnblogs-mdEditor/master/images/mdeditor.png)

- 可生成博文目录

![加目录](https://raw.githubusercontent.com/imgss/cnblogs-mdEditor/master/images/shatter1.gif)

- 可添加盘古之白

![盘古之白](https://raw.githubusercontent.com/imgss/cnblogs-mdEditor/master/images/shatter2.gif)

- 可插入emoji表情

![emoji](https://raw.githubusercontent.com/imgss/cnblogs-mdEditor/master/images/emoji.png)

- 高亮自定义css
![高亮自定义css](https://raw.githubusercontent.com/imgss/cnblogs-mdEditor/master/images/css.png)

## 安装
- 在选项中将默认编辑器设为Markdown编辑器 https://i.cnblogs.com/Preferences.aspx#Editor
- 在浏览器中输入`chrome://extensions`
- 打开开发者模式
- clone仓库
- 点击加载已解压的扩展程序,选择clone下来的app文件夹
- 如果一切正常，打开新增随笔时即可看到变化

## 设置

目前支持设置主题（light 和 dark）
更多详情见: https://www.cnblogs.com/imgss/p/9368869.html

## issues

发现了bug，想到好的功能可以在[issues](https://github.com/imgss/cnblogs-mdEditor/issues)中提出

## lisence

MIT




