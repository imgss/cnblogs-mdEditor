"这个功能可以说是让我们这些用mpvue的等的很焦灼，眼看着项目的大小一天天地逼近2M，mpvue还不能很好地支持分包加载，这可咋整？好消息是最近mpvue要支持分包加载了，不过目前在develop分支下面。下面我们一步步来看看怎么初始化一个支持分包加载的mpvue项目，以及不平滑的完成对老项目的改造。

### clone mpvue-quickstart模板

初始化一个mpvue项目是基于mpvue-quickstart项目模板的，使用的是下面的命令:

```bash
vue init mpvue/mpvue-quickstart my-project
```

但是这样是基于quickstart的master分支创建的项目，所以我们可以把这个模板clone下来，然后切换到develop分支上，再基于本地的模板创建一个新的mpvue项目，以下是一通（猛如虎的）操作:

```bash
git clone https://github.com/mpvue/mpvue-quickstart.git
cd mpvue-quickstart
git branch develop #切换到开发分支
```

这时，在项目的template/src目录下会有一个app.json文件，表明你现在在开发分支上。

#### 注意⚠️

datdattt
  ##### 提示

  66666666666

## 分包体验

首先用本地分mpvue模板初始化一个项目,参考vue-cli使用本地模板的[文档](https://github.com/vuejs/vue-cli/tree/v2#local-templates):

```bash
vue init ../mpvue-quickstart demo # 替换模板路径为相对于你项目的相对路径
```
可以看到我们将模板替换成了本地的模板，后面的操作就熟悉了。

### 初始化之后

初始化好项目之后，我们来写一个分包加载的demo。进入项目目录，我们可以看到一个json文件，就是上面提到的app.json。然后参考小程序文档，加入subpackages的相关配置：

```js

{
  "pages": [
    "pages/index/main",
    "pages/logs/main"  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#fff",
    "navigationBarTitleText": "WeChat",
    "navigationBarTextStyle": "black"
  },
  "subPackages": [
    {
      "root": "pages/pA",
      "pages": [
        "a/main"
      ]
    }
  ]
}

```
然后在pages/下，新建pA/a目录，在目录下再新建两个文件，`main.js`和`index.vue`，最终目录结构如下图所示:

<img width="300px" src="https://images2018.cnblogs.com/blog/1016471/201808/1016471-20180817223857688-655855736.png"/>

后面的操作就跟之前的mpvue开发过程一致了，这里不再赘述。直接贴上相关代码:

```html

index/index.vue 主包

...

<a href="../pA/a/main">分包</a> 跳转到分包
...

```
当点击上面的链接时，手机上会首先出现正在加载模块，然后跳转到build出来的`pages/pA/a/mian`页面,表示分包生效。

### 现有项目的分包改造

对于想将现有项目改造成支持分包的朋友，可能要麻烦一点，还要踩一点坑。下面我就详细说一下我们的改造过程以及遇到的坑。下面内容主要参考[issue 672](https://github.com/Meituan-Dianping/mpvue/issues/672)

- 将项目备份一份，包括依赖

	没有人希望分包改造不成功，还把原来能跑的搞的不能跑了，所以，先将整个项目复制一份，然后在副本里搞
    
- 升级依赖

    ```bash

    cnpm i mpvue-loader@1.1.0-rc.1 --save

    cnpm i webpack-mpvue-asset-plugin@0.1.0-rc.1 --save

    ```

- 修改webpack配置

	在这一步，会修改build目录下的`webpack.base.conf.js`,`webpack.prod.conf.js`,`webpack.dev.conf.js`三个文件，具体细节参考[这里](https://github.com/mpvue/mpvue-quickstart/pull/39/files)
    
- 修改config目录下的配置

	打开 config/index.js,将`assetsSubDirectory`字段的值由static改成''
    
    ```js
    ...
    assetsSubDirectory: ''// 去掉static
    ...
    ```

- 将app.json的配置从main.js中移出来，命名为main.json

	之前mpvue将app.json写到main.js的export中，现在把它拿到同级目录下，新建一个main.json文件（注意是main.json，不是app.json），按小程序文档的格式粘贴进去。
    
![uploading-image-666580.png](https://images2018.cnblogs.com/blog/1016471/201808/1016471-20180823220142058-70937048.png)
    ￼
最后 `npm run dev`看看有没有跑起来(完)
￼
最近写东西越来越水了。。。"