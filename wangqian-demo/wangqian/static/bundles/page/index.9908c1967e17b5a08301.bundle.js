/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__index_less__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__index_less___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__index_less__);

// import '../common/css/layui-table-1.0.css'
// import '../common/js/component/layui-table-1.0.js'
// import '../common/js/component/common-1.0.js'


(function () {
	layui.use(['layer', 'table'], function () {
		let layer, table, type;
		layer = layui.layer;
		table = layui.table;
		type = 'product';
		//第一个实例

		function searchBlock() {
			let html = '';
			// 我分享的品种资料 product_name   reg_number   enterprise_name
			if (type == 'product') {
				html = ` <div class="search-div">
				   	  <div class="label-input-d">
			            <label class="label">品种名称</label>
			            <input class="input" type="text" name="product_name" placeholder="请输入品种名称">
			        </div>
				   	  <div class="label-input-d">
			           <label class="label">批准文号</label>
			           <input class="input" type="text" name="reg_number" placeholder="请输入批准文号"> 
			        </div>
				   	  <div class="label-input-d">
			           <label class="label">企业名称</label>
			           <input class="input" type="text" name="enterprise_name_p" placeholder="请输入企业名称"> 
			        </div>
				   	  <button class="search-btn">搜 索</button>
				   </div>
				   <div class="wrap-table">
			      	  <table id="LAY_table" lay-filter="LAY_table"></table>
			     </div>`;
				$('.content-w').attr('id', 'product-d').html(html);
			} else {
				//我分享的企业资料
				html = ` <div class="search-div">
				   	   	  <div class="label-input-d">
				             <label class="label">企业名称</label>
				             <input type="text" name="enterprise_name_e" placeholder="请输入企业名称">
				          </div>
				   	   	  <button class="search-btn">搜 索</button>
			   	     </div>
				   	 <div class="wrap-table">
				      	<table id="LAY_table" lay-filter="LAY_table"></table>
				     </div>`;
				$('.content-w').attr('id', 'enterprise-d').html(html);
			}
		}

		function tableClosFun() {
			let html = '';

			// 我分享的品种资料 product_name   reg_number   enterprise_name
			if (type == 'product') {
				// 品种资料
				return [//表头  name   reg_number   enterprise_name
				{ field: 'name', title: '品种名称', align: 'center', templet: function (d) {
						return d.related_exchange.material_detail.name;
					} }, { field: 'specification', title: '规格', align: 'center', templet: function (d) {
						return d.related_exchange.material_detail.specification;
					} }, { field: 'general_dosage', title: '剂型', align: 'center', templet: function (d) {
						return d.related_exchange.material_detail.general_dosage;
					} }, { field: 'reg_number', title: '批准文号', align: 'center', templet: function (d) {
						return d.related_exchange.material_detail.reg_number;
					} }, { field: 'manufacture_enterprise', title: '生产企业', align: 'center', templet: function (d) {
						return d.related_exchange.material_detail.manufacture_enterprise;
					} }, { field: 'more', title: '更多', align: 'center', templet: function (d) {
						var item = d.related_exchange.material_detail;
						// // 更多
						// var something3 = '<div class="div1"><ul>批准文号 : </ul><ul class="ul1">' + (item.reg_number || '--') + '</ul></div>'
						// var something2 = '<div class="div1"><ul>备注 : </ul><ul class="ul1">' + (item.sequence_code_mark || '--') + '</ul></div>'
						// var something1 = '<div class="div1"><ul>材质 : </ul><ul class="ul1">' + (item.drug_material ||  '--') + '</ul></div>'
						// var moreHtml = '<button class="more-m showthing" something="something">查看</button>';
						// return moreHtml + '<div class="divnone">' + something3 + something2 + (type == 'product' ? something1 : '') + '</div>';

						return `<div data-id="${item.reg_number || '--'}" data-material="${item.drug_material || '--'}" data-remark="${item.sequence_code_mark || '--'}" class="moreTd">查看</div>`;
					} }, { field: 'create_time', title: '分享日期', align: 'center', templet: function (d) {
						return d.create_time;
					} }, { field: 'opertation', title: '操作', align: 'center', templet: function (d) {
						return '<button class="layui-btn layui-btn-normal layui-btn-xs goDetail" lay-event="goDetail"   data-uuid=' + d.related_exchange.id + ' >查看详情</button><br><button class="layui-btn layui-btn-danger layui-btn-xs deltShare" lay-event="deltShare"  data-uuid=' + d.related_exchange.id + ' >删除分享</button>';
					} }];
			} else {
				//我分享的企业资料
				// 企业资料
				return [//表头
				{ field: 'name', title: '资料名称', align: 'center', templet: function (d) {
						return d.related_exchange.material_detail.name;
					} }, { field: 'manufacture_enterprise', title: '资料所属企业', align: 'center', templet: function (d) {
						return d.related_exchange.material_detail.manufacture_enterprise;
					} }, { field: 'create_time', title: '分享日期', align: 'center', templet: function (d) {
						return d.create_time;
					} }, { field: 'opertation', title: '操作', align: 'center', templet: function (d) {
						return '<button class="layui-btn layui-btn-normal layui-btn-xs goDetail" lay-event="goDetail"  data-uuid=' + d.related_exchange.id + ' >查看详情</button><br><button class="layui-btn layui-btn-danger layui-btn-xs deltShare" lay-event="deltShare" class="deltShare" data-uuid=' + d.related_exchange.id + ' >删除分享</button>';
					} }];
			}
		}

		function tableInit() {
			let tableObj = $.extend({
				elem: '#LAY_table',
				url: '/agreement/api/share/exchange/list/' + type + '/owner/', //数据接口
				cols: [tableClosFun()]
			}, $.commonTableData());
			table.render(tableObj);
		}

		// tableInit();
		(function () {
			searchBlock();
			tableInit();
		})();

		// 表格重载
		function tableReload() {
			table.reload('LAY_table', {
				page: { curr: 1 }
			});
		};
		// tab 切换
		$('.tab-nav-ul li').on('click', function () {
			$('.tab-nav-ul li').removeClass('active');
			type = $(this).attr('data-type');
			console.log('type', type);
			$(this).addClass('active');
			searchBlock();
			tableInit();
		});

		$(document).on('mouseover', '.showthing', function () {
			$(this).parent().find('.divnone').show();
		}).on('mouseout', '.showthing', function () {
			$(this).parent().find('.divnone').hide();
		});

		// 查看详情
		$(document).on('click', '.goDetail', function () {
			var uuid = $(this).attr('data-uuid');
			window.location = '/material/share/owner/exchange/detail/' + type + '/?id=' + uuid + '&type=' + type + '';
		});

		// 删除分享
		$(document).on('click', '.deltShare', function () {
			var exchange_id = $(this).attr('data-uuid');
			var _this = $(this);

			layer.open({
				'title': '消息提醒',
				'btn': ['确定', '取消'],
				'btnAlign': 'c',
				'content': '<p style="padding: 16px 0;text-align: center;">您确定要删除分享的首营吗</p>',
				yes: function () {
					let opt = {
						url: '/agreement/api/remove_exchange/' + type + '',
						type: 'DELETE',
						data: {
							'exchange_id': exchange_id
						}
					};
					$(document).ajax(opt, function (err, resp) {
						if (err) {
							layer.msg(err.responseJSON.detail);
							return;
						}
						if (resp) {
							if (resp.detail == "删除成功") {
								layer.msg(resp.detail);
								tableInit();
							} else {
								layer.msg(resp.detail);
							}
						}
					});
				}
			});
		});

		// 搜索
		// 	| enterprise | 企业名称 |    | product | 产品名称 |  | reg_number | 资料编号 |
		$(document).on('click', '.search-btn', function () {
			if (type == 'product') {
				//品种  product_name   reg_number   enterprise_name
				var enterprise_name_p = encodeURIComponent($('input[ name=enterprise_name_p ]').val());
				var product_name = encodeURIComponent($('input[ name=product_name ]').val());
				var reg_number = encodeURIComponent($('input[ name=reg_number ]').val());

				let tableObj = $.extend({
					elem: '#LAY_table',
					url: '/agreement/api/share/exchange/list/' + type + '/owner/?enterprise=' + enterprise_name_p + '&product=' + product_name + '&reg_number=' + reg_number + '', //数据接口
					cols: [tableClosFun()]
				}, $.commonTableData());
				table.render(tableObj);
			} else {
				var enterprise_name_e = encodeURIComponent($('input[ name=enterprise_name_e ]').val());

				let tableObj = $.extend({
					elem: '#LAY_table',
					url: '/agreement/api/share/exchange/list/' + type + '/owner/?enterprise=' + enterprise_name_e + '', //数据接口
					cols: [tableClosFun()]
				}, $.commonTableData());
				table.render(tableObj);
			}
		});

		//查看
		$('body').on('mouseenter', '.moreTd', function (e) {
			let top = $(this).offset().top - 80;
			let left = $(this).offset().left - 215 - 250;
			$('.more-hover').html(`<ul>
                <li>批准文号：<span>${e.target.dataset.id}</span></li>
                <li>材质：<span>${e.target.dataset.material}</span></li>
                <li>备注：<span>${e.target.dataset.remark}</span></li>                
            </ul>`).css({
				position: 'absolute',
				left: left,
				top: top
			}).stop().show();
		});
		$('body').on('mouseleave', '.moreTd', function (e) {
			$('.more-hover').hide();
		});
	});
})();

/***/ }),
/* 1 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);