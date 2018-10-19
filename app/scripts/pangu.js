/*!
 * pangu.js
 * --------
 * @version: 3.3.0
 * @homepage: https://github.com/vinta/pangu.js
 * @license: MIT
 * @author: Vinta Chen <vinta.chen@gmail.com> (https://github.com/vinta)
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("pangu", [], factory);
	else if(typeof exports === 'object')
		exports["pangu"] = factory();
	else
		root["pangu"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var Pangu = __webpack_require__(1).Pangu;
	
	// https://developer.mozilla.org/en/docs/Web/API/Node/nodeType
	var COMMENT_NODE_TYPE = 8;
	
	var BrowserPangu = function (_Pangu) {
	  _inherits(BrowserPangu, _Pangu);
	
	  function BrowserPangu() {
	    _classCallCheck(this, BrowserPangu);
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(BrowserPangu).call(this));
	
	    _this.topTags = /^(html|head|body|#document)$/i;
	    _this.ignoreTags = /^(script|code|pre|textarea)$/i;
	    _this.spaceSensitiveTags = /^(a|del|pre|s|strike|u)$/i;
	    _this.spaceLikeTags = /^(br|hr|i|img|pangu)$/i;
	    _this.blockTags = /^(div|h1|h2|h3|h4|h5|h6|p)$/i;
	
	    // TODO
	    // this.ignoreClasses
	    // this.ignoreAttributes
	    return _this;
	  }
	
	  _createClass(BrowserPangu, [{
	    key: 'canIgnoreNode',
	    value: function canIgnoreNode(node) {
	      var parentNode = node.parentNode;
	
	      while (parentNode && parentNode.nodeName && parentNode.nodeName.search(this.topTags) === -1) {
	        if (parentNode.nodeName.search(this.ignoreTags) >= 0 || parentNode.isContentEditable || parentNode.getAttribute('g_editable') === 'true') {
	          return true;
	        }
	
	        parentNode = parentNode.parentNode;
	      }
	
	      return false;
	    }
	  }, {
	    key: 'isFirstTextChild',
	    value: function isFirstTextChild(parentNode, targetNode) {
	      var childNodes = parentNode.childNodes;
	
	      // 鍙垽鏂风涓€鍊嬪惈鏈� text 鐨� node
	      for (var i = 0; i < childNodes.length; i++) {
	        var childNode = childNodes[i];
	        if (childNode.nodeType !== COMMENT_NODE_TYPE && childNode.textContent) {
	          return childNode === targetNode;
	        }
	      }
	
	      return false;
	    }
	  }, {
	    key: 'isLastTextChild',
	    value: function isLastTextChild(parentNode, targetNode) {
	      var childNodes = parentNode.childNodes;
	
	      // 鍙垽鏂峰€掓暩绗竴鍊嬪惈鏈� text 鐨� node
	      for (var i = childNodes.length - 1; i > -1; i--) {
	        var childNode = childNodes[i];
	        if (childNode.nodeType !== COMMENT_NODE_TYPE && childNode.textContent) {
	          return childNode === targetNode;
	        }
	      }
	
	      return false;
	    }
	  }, {
	    key: 'spacingNodeByXPath',
	    value: function spacingNodeByXPath(xPathQuery, contextNode) {
	      // 鍥犵偤 xPathQuery 鏈冩槸鐢� text() 绲愬熬锛屾墍浠ラ€欎簺 nodes 鏈冩槸 text 鑰屼笉鏄� DOM element
	      // snapshotLength 瑕侀厤鍚� XPathResult.ORDERED_NODE_SNAPSHOT_TYPE 浣跨敤
	      // https://developer.mozilla.org/en-US/docs/DOM/document.evaluate
	      // https://developer.mozilla.org/en-US/docs/Web/API/XPathResult
	      var textNodes = document.evaluate(xPathQuery, contextNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	
	      var currentTextNode = void 0;
	      var nextTextNode = void 0;
	
	      // 寰炴渶涓嬮潰銆佹渶瑁￠潰鐨勭瘈榛為枊濮嬶紝鎵€浠ユ槸鍊掑簭鐨�
	      for (var i = textNodes.snapshotLength - 1; i > -1; --i) {
	        currentTextNode = textNodes.snapshotItem(i);
	
	        if (this.canIgnoreNode(currentTextNode)) {
	          nextTextNode = currentTextNode;
	          continue;
	        }
	
	        var newText = this.spacing(currentTextNode.data);
	        if (currentTextNode.data !== newText) {
	          currentTextNode.data = newText;
	        }
	
	        // 铏曠悊宓屽鐨� <tag> 涓殑鏂囧瓧
	        if (nextTextNode) {
	          // TODO
	          // 鐝惧湪鍙槸绨″柈鍦板垽鏂风浉閯扮殑涓嬩竴鍊� node 鏄笉鏄� <br>
	          // 钀竴閬囦笂宓屽鐨勬绫ゅ氨涓嶈浜�
	          if (currentTextNode.nextSibling && currentTextNode.nextSibling.nodeName.search(this.spaceLikeTags) >= 0) {
	            nextTextNode = currentTextNode;
	            continue;
	          }
	
	          // currentTextNode 鐨勬渶寰屼竴鍊嬪瓧 + nextTextNode 鐨勭涓€鍊嬪瓧
	          var testText = currentTextNode.data.toString().substr(-1) + nextTextNode.data.toString().substr(0, 1);
	          var testNewText = this.spacing(testText);
	          if (testNewText !== testText) {
	            // 寰€涓婃壘 nextTextNode 鐨� parent node
	            // 鐩村埌閬囧埌 spaceSensitiveTags
	            // 鑰屼笖 nextTextNode 蹇呴爤鏄涓€鍊� text child
	            // 鎵嶈兘鎶婄┖鏍煎姞鍦� nextTextNode 鐨勫墠闈�
	            var nextNode = nextTextNode;
	            while (nextNode.parentNode && nextNode.nodeName.search(this.spaceSensitiveTags) === -1 && this.isFirstTextChild(nextNode.parentNode, nextNode)) {
	              nextNode = nextNode.parentNode;
	            }
	
	            var currentNode = currentTextNode;
	            while (currentNode.parentNode && currentNode.nodeName.search(this.spaceSensitiveTags) === -1 && this.isLastTextChild(currentNode.parentNode, currentNode)) {
	              currentNode = currentNode.parentNode;
	            }
	
	            if (currentNode.nextSibling) {
	              if (currentNode.nextSibling.nodeName.search(this.spaceLikeTags) >= 0) {
	                nextTextNode = currentTextNode;
	                continue;
	              }
	            }
	
	            if (currentNode.nodeName.search(this.blockTags) === -1) {
	              if (nextNode.nodeName.search(this.spaceSensitiveTags) === -1) {
	                if (nextNode.nodeName.search(this.ignoreTags) === -1 && nextNode.nodeName.search(this.blockTags) === -1) {
	                  if (nextTextNode.previousSibling) {
	                    if (nextTextNode.previousSibling.nodeName.search(this.spaceLikeTags) === -1) {
	                      nextTextNode.data = ' ' + nextTextNode.data;
	                    }
	                  } else {
	                    // dirty hack
	                    if (!this.canIgnoreNode(nextTextNode)) {
	                      nextTextNode.data = ' ' + nextTextNode.data;
	                    }
	                  }
	                }
	              } else if (currentNode.nodeName.search(this.spaceSensitiveTags) === -1) {
	                currentTextNode.data = currentTextNode.data + ' ';
	              } else {
	                var panguSpace = document.createElement('pangu');
	                panguSpace.innerHTML = ' ';
	
	                // 閬垮厤涓€鐩磋鍔犵┖鏍�
	                if (nextNode.previousSibling) {
	                  if (nextNode.previousSibling.nodeName.search(this.spaceLikeTags) === -1) {
	                    nextNode.parentNode.insertBefore(panguSpace, nextNode);
	                  }
	                } else {
	                  nextNode.parentNode.insertBefore(panguSpace, nextNode);
	                }
	
	                // TODO
	                // 涓昏鏄兂瑕侀伩鍏嶅湪鍏冪礌锛堥€氬父閮芥槸 <li>锛夌殑闁嬮牠鍔犵┖鏍�
	                // 閫欏€嬪仛娉曟湁榛炶牏锛屼絾鏄笉绠￠倓鏄厛纭笂
	                if (!panguSpace.previousElementSibling) {
	                  if (panguSpace.parentNode) {
	                    panguSpace.parentNode.removeChild(panguSpace);
	                  }
	                }
	              }
	            }
	          }
	        }
	
	        nextTextNode = currentTextNode;
	      }
	    }
	  }, {
	    key: 'spacingNode',
	    value: function spacingNode(contextNode) {
	      var xPathQuery = './/*/text()[normalize-space(.)]';
	      this.spacingNodeByXPath(xPathQuery, contextNode);
	    }
	  }, {
	    key: 'spacingElementById',
	    value: function spacingElementById(idName) {
	      var xPathQuery = 'id("' + idName + '")//text()';
	      this.spacingNodeByXPath(xPathQuery, document);
	    }
	  }, {
	    key: 'spacingElementByClassName',
	    value: function spacingElementByClassName(className) {
	      var xPathQuery = '//*[contains(concat(" ", normalize-space(@class), " "), "' + className + '")]//text()';
	      this.spacingNodeByXPath(xPathQuery, document);
	    }
	  }, {
	    key: 'spacingElementByTagName',
	    value: function spacingElementByTagName(tagName) {
	      var xPathQuery = '//' + tagName + '//text()';
	      this.spacingNodeByXPath(xPathQuery, document);
	    }
	  }, {
	    key: 'spacingPageTitle',
	    value: function spacingPageTitle() {
	      var xPathQuery = '/html/head/title/text()';
	      this.spacingNodeByXPath(xPathQuery, document);
	    }
	  }, {
	    key: 'spacingPageBody',
	    value: function spacingPageBody() {
	      // // >> 浠绘剰浣嶇疆鐨勭瘈榛�
	      // . >> 鐣跺墠绡€榛�
	      // .. >> 鐖剁瘈榛�
	      // [] >> 姊濅欢
	      // text() >> 绡€榛炵殑鏂囧瓧鍏у锛屼緥濡� hello 涔嬫柤 <tag>hello</tag>
	      //
	      // [@contenteditable]
	      // 甯舵湁 contenteditable 灞€х殑绡€榛�
	      //
	      // normalize-space(.)
	      // 鐣跺墠绡€榛炵殑闋熬鐨勭┖鐧藉瓧鍏冮兘鏈冭绉婚櫎锛屽ぇ鏂煎叐鍊嬩互涓婄殑绌虹櫧瀛楀厓鏈冭缃彌鎴愬柈涓€绌虹櫧
	      // https://developer.mozilla.org/en-US/docs/XPath/Functions/normalize-space
	      //
	      // name(..)
	      // 鐖剁瘈榛炵殑鍚嶇ū
	      // https://developer.mozilla.org/en-US/docs/XPath/Functions/name
	      //
	      // translate(string, "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz")
	      // 灏� string 杞夋彌鎴愬皬瀵紝鍥犵偤 XML 鏄� case-sensitive 鐨�
	      // https://developer.mozilla.org/en-US/docs/XPath/Functions/translate
	      //
	      // 1. 铏曠悊 <title>
	      // 2. 铏曠悊 <body> 搴曚笅鐨勭瘈榛�
	      // 3. 鐣ラ亷 contentEditable 鐨勭瘈榛�
	      // 4. 鐣ラ亷鐗瑰畾绡€榛烇紝渚嬪 <script> 鍜� <style>
	      //
	      // 娉ㄦ剰锛屼互涓嬬殑 query 鍙渻鍙栧嚭鍚勭瘈榛炵殑 text 鍏у锛�
	      var xPathQuery = '/html/body//*/text()[normalize-space(.)]';
	      var _arr = ['script', 'style', 'textarea'];
	      for (var _i = 0; _i < _arr.length; _i++) {
	        var tag = _arr[_i];
	        // 鐞嗚珫涓婇€欏咕鍊� tag 瑁￠潰涓嶆渻鍖呭惈鍏朵粬 tag
	        // 鎵€浠ュ彲浠ョ洿鎺ョ敤 .. 鍙栫埗绡€榛�
	        // ex: [translate(name(..), "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz") != "script"]
	        xPathQuery += '[translate(name(..),"ABCDEFGHIJKLMNOPQRSTUVWXYZ","abcdefghijklmnopqrstuvwxyz")!="' + tag + '"]';
	      }
	      this.spacingNodeByXPath(xPathQuery, document);
	    }
	
	    // TODO: 鏀彺 callback 鍜� promise
	
	  }, {
	    key: 'spacingPage',
	    value: function spacingPage() {
	      this.spacingPageTitle();
	      this.spacingPageBody();
	    }
	  }]);
	
	  return BrowserPangu;
	}(Pangu);
	
	var pangu = new BrowserPangu();
	
	exports = module.exports = pangu;
	exports.Pangu = BrowserPangu;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// CJK is short for Chinese, Japanese and Korean.
	//
	// The constant cjk contains following Unicode blocks:
	// 	\u2e80-\u2eff CJK Radicals Supplement
	// 	\u2f00-\u2fdf Kangxi Radicals
	// 	\u3040-\u309f Hiragana
	// 	\u30a0-\u30ff Katakana
	// 	\u3100-\u312f Bopomofo
	// 	\u3200-\u32ff Enclosed CJK Letters and Months
	// 	\u3400-\u4dbf CJK Unified Ideographs Extension A
	// 	\u4e00-\u9fff CJK Unified Ideographs
	// 	\uf900-\ufaff CJK Compatibility Ideographs
	//
	// For more information about Unicode blocks, see
	// 	http://unicode-table.com/en/
	//  https://github.com/vinta/pangu
	
	// ANS is short for Alphabets, Numbers and Symbols (`~!@#$%^&*()-_=+[]{}\|;:'",<.>/?).
	//
	// CAUTION: those ANS in following constants do not contain all symbols above.
	
	// cjkQuote >> 璺� Go 鐗堝樊浜嗕竴鍊� '
	// quoteCJK >> 璺� Go 鐗堝樊浜嗕竴鍊� '
	var cjkQuote = /([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])(["])/g;
	var quoteCJK = /(["])([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/g;
	var fixQuote = /(["']+)(\s*)(.+?)(\s*)(["']+)/g;
	var fixSingleQuote = /([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])( )(')([A-Za-z])/g;
	
	var hashANSCJKhash = /([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])(#)([A-Za-z0-9\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]+)(#)([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/g;
	var cjkHash = /([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])(#([^ ]))/g;
	var hashCJK = /(([^ ])#)([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/g;
	
	var cjkOperatorANS = /([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])([\+\-\*\/=&\\|<>])([A-Za-z0-9])/g;
	var ansOperatorCJK = /([A-Za-z0-9])([\+\-\*\/=&\\|<>])([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/g;
	
	var cjkBracketCJK = /([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])([\(\[\{<\u201c]+(.*?)[\)\]\}>\u201d]+)([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/g;
	var cjkBracket = /([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])([\(\[\{<\u201c>])/g;
	var bracketCJK = /([\)\]\}>\u201d<])([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/g;
	var fixBracket = /([\(\[\{<\u201c]+)(\s*)(.+?)(\s*)([\)\]\}>\u201d]+)/;
	
	var fixSymbol = /([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])([~!;:,\.\?\u2026])([A-Za-z0-9])/g;
	
	var cjkANS = /([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])([A-Za-z0-9`\$%\^&\*\-=\+\\\|/@\u00a1-\u00ff\u2022\u2027\u2150-\u218f])/g;
	var ansCJK = /([A-Za-z0-9`~\$%\^&\*\-=\+\\\|/!;:,\.\?\u00a1-\u00ff\u2022\u2026\u2027\u2150-\u218f])([\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff])/g;
	
	var Pangu = function () {
	  function Pangu() {
	    _classCallCheck(this, Pangu);
	  }
	
	  _createClass(Pangu, [{
	    key: 'spacing',
	    value: function spacing(text) {
	      var newText = text;
	
	      newText = newText.replace(cjkQuote, '$1 $2');
	      newText = newText.replace(quoteCJK, '$1 $2');
	      newText = newText.replace(fixQuote, '$1$3$5');
	      newText = newText.replace(fixSingleQuote, '$1$3$4');
	
	      newText = newText.replace(hashANSCJKhash, '$1 $2$3$4 $5');
	      newText = newText.replace(cjkHash, '$1 $2');
	      newText = newText.replace(hashCJK, '$1 $3');
	
	      newText = newText.replace(cjkOperatorANS, '$1 $2 $3');
	      newText = newText.replace(ansOperatorCJK, '$1 $2 $3');
	
	      var oldText = newText;
	      var tmpText = newText.replace(cjkBracketCJK, '$1 $2 $4');
	      newText = tmpText;
	      if (oldText === tmpText) {
	        newText = newText.replace(cjkBracket, '$1 $2');
	        newText = newText.replace(bracketCJK, '$1 $2');
	      }
	      newText = newText.replace(fixBracket, '$1$3$5');
	
	      newText = newText.replace(fixSymbol, '$1$2 $3');
	
	      newText = newText.replace(cjkANS, '$1 $2');
	      newText = newText.replace(ansCJK, '$1 $2');
	
	      return newText;
	    }
	  }, {
	    key: 'spacingText',
	    value: function spacingText(text) {
	      var callback = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];
	
	      try {
	        var newText = this.spacing(text);
	        callback(null, newText);
	      } catch (err) {
	        callback(err);
	      }
	    }
	  }]);
	
	  return Pangu;
	}();
	
	var pangu = new Pangu();
	
	exports = module.exports = pangu;
	exports.Pangu = Pangu;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=pangu.js.map