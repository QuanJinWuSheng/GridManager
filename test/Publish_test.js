/**
 * Created by baukh on 17/4/17.
 * 注意: 公开方法在实际调用时 与 测试时方法不同, document.querySelector('table').GM('get');
 */
'use strict';
import {PublishMethod, publishMethodArray} from '../src/js/Publish';
import testData from '../src/data/testData';
import testData2 from '../src/data/testData2';
import { GM_VERSION, GM_PUBLISH_METHOD_LIST } from '../src/common/constants';

describe('publishMethodArray', function() {
	it('公开方法列表', function () {
		expect(publishMethodArray).toEqual(GM_PUBLISH_METHOD_LIST);
	});
});

/**
 * 验证类的属性及方法总量
 */
describe('Publish 验证类的属性及方法总量', function() {
	var getPropertyCount = null;
	beforeAll(function() {
		getPropertyCount = function(o){
			var n, count = 0;
			for(n in o){
				if(o.hasOwnProperty(n)){
					count++;
				}
			}
			return count;
		}
	});
	afterAll(function(){
		getPropertyCount = null;
	});
	it('Function count', function() {
		// es6 中 constructor 也会算做为对象的属性, 所以总量上会增加1
		expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(PublishMethod)))).toBe(16 + 1);
	});
});

describe('PublishMethod.init(table, settings, callback)', function() {
	let table = null;
	let arg = null;
	beforeAll(function(){
		// 存储console, 用于在测方式完成后原还console对象
		console._error = console.error;
		console._warn = console.warn;
		console.error = jasmine.createSpy("error");
		console.warn = jasmine.createSpy("error");

		table = document.createElement('table');
		document.body.appendChild(table);
		arg = null;
	});

	afterAll(function(){
		console.error = console._error;
		console.warn = console._warn;
		document.body.innerHTML = '';
		table = null;
		arg = null;
	});

	it('基础验证', function () {
		expect(PublishMethod.init).toBeDefined();
		expect(PublishMethod.init.length).toBe(3);
	});

	it('配置参为空', function () {
		PublishMethod.init(table);
		expect(console.error).toHaveBeenCalledWith('GridManager Error: ', 'init()方法中未发现有效的参数');
	});

	it('columnData 为空', function () {
		arg = {
			gridManagerName: 'test-publish'
		};
		PublishMethod.init(table, arg);
		expect(console.error).toHaveBeenCalledWith('GridManager Error: ', '请对参数columnData进行有效的配置');
	});

	// gridManagerName 为空
	it('gridManagerName 为空', function () {
		arg = {
			columnData: [{
				key: 'url',
				text: '链接'
			}]
		};
		PublishMethod.init(table, arg);
		expect(console.error).toHaveBeenCalledWith('GridManager Error: ', '请在html标签中为属性[grid-manager]赋值或在配置项中配置gridManagerName');
	});

	it('当前表格已经渲染', function () {
		arg = {
			gridManagerName: 'test-publish',
			columnData: [{
				key: 'url',
				text: '链接'
			}]
		};
		table.className = 'GridManager-ready';
		PublishMethod.init(table, arg);
		expect(console.error).toHaveBeenCalledWith('GridManager Error: ', '渲染失败,可能该表格已经渲染或正在渲染');
	});

	it('当前表格正在渲染', function () {
		arg = {
			gridManagerName: 'test-publish',
			columnData: [{
				key: 'url',
				text: '链接'
			}]
		};
		table.className = 'GridManager-loading';
		PublishMethod.init(table, arg);
		expect(console.error).toHaveBeenCalledWith('GridManager Error: ', '渲染失败,可能该表格已经渲染或正在渲染');
	});

	it('回调函数是否调用', function () {
		table.className = '';
		arg = {
			ajax_data: testData,
			gridManagerName: 'test-publish',
			supportSorting: true,
			supportRemind: true,
			columnData: [
				{
					key: 'name',
					width: '100px',
					text: '名称'
				},{
					key: 'info',
					text: '使用说明'
				},{
					key: 'url',
					text: 'url'
				},{
					key: 'createDate',
					text: '创建时间'
				},{
					key: 'lastDate',
					text: '最后修改时间'
				},{
					key: 'action',
					text: '操作',
					template: function(action, rowObject){
						return '<span class="plugin-action edit-action" learnLink-id="'+rowObject.id+'">编辑</span>'
							+'<span class="plugin-action del-action" learnLink-id="'+rowObject.id+'">删除</span>';
					}
				}
			]
		};

		let callback = jasmine.createSpy('callback');
		PublishMethod.init(table, arg, callback);
		expect(callback).toHaveBeenCalled();
	});
});

describe('PublishMethod 非init方法验证', function() {
	let table = null;
	let arg = null;
	let trList = null;
	let gridManagerName = null;
	let queryValue = null;
	beforeAll(function () {
		// 存储console, 用于在测方式完成后原还console对象
		console._warn = console.warn;
		console.warn = jasmine.createSpy("warn");

		gridManagerName = 'test-publish';
		queryValue = {'ccname': 'baukh'};

		table = document.createElement('table');
		document.body.appendChild(table);
		arg = {
			ajax_data: testData,
			gridManagerName: gridManagerName,
			query: queryValue,
			columnData: [
				{
					key: 'name',
					width: '100px',
					text: '名称'
				},{
					key: 'info',
					text: '使用说明'
				},{
					key: 'url',
					text: 'url'
				},{
					key: 'createDate',
					text: '创建时间'
				},{
					key: 'lastDate',
					text: '最后修改时间'
				},{
					key: 'action',
					text: '操作',
					template: function(action, rowObject){
						return '<span class="plugin-action edit-action" learnLink-id="'+rowObject.id+'">编辑</span>'
							+'<span class="plugin-action del-action" learnLink-id="'+rowObject.id+'">删除</span>';
					}
				}
			]
		};
		PublishMethod.init(table, arg);
		trList = document.querySelectorAll('tbody tr');
	});

	afterAll(function () {
		table = null;
		arg = null;
		trList = null;
		gridManagerName = null;
		queryValue = null;
		console.warn = console._warn;
		document.body.innerHTML = '';
	});


	describe('PublishMethod.get(table)', function() {
		it('基础验证', function () {
			expect(PublishMethod.get).toBeDefined();
			expect(PublishMethod.get.length).toBe(1);
		});

		it('参数为空', function () {
			expect(PublishMethod.get()).toEqual({});
		});

		it('验证返回值', function () {
			// 抽取两个值进行较验
			expect(PublishMethod.get(table).gridManagerName).toBe(gridManagerName);
			expect(PublishMethod.get(table).sortKey).toBe('sort_');
		});
	});


	describe('PublishMethod.version()', function() {
		it('基础验证', function () {
			expect(PublishMethod.version()).toBeDefined();
			expect(PublishMethod.version.length).toBe(0);
		});

		it('返回值验证', function () {
			expect(PublishMethod.version()).toBe(GM_VERSION);
		});
	});

	describe('PublishMethod.getLocalStorage(table)', function() {
		it('基础验证', function () {
			expect(PublishMethod.getLocalStorage).toBeDefined();
			expect(PublishMethod.getLocalStorage.length).toBe(1);
		});

		it('参数为空', function () {
			expect(PublishMethod.getLocalStorage()).toEqual({});
		});

		it('验证返回值', function () {
			// 当前表格并不存在本地存储, 所以返回为空对象
			expect(PublishMethod.getLocalStorage(table)).toEqual({});
		});
	});

	describe('PublishMethod.clear(table)', function() {
		it('基础验证', function () {
			expect(PublishMethod.clear).toBeDefined();
			expect(PublishMethod.clear.length).toBe(1);
		});

		it('console提示文本', function () {
			PublishMethod.clear();
			expect(console.warn).toHaveBeenCalledWith('GridManager Warn: ', '用户记忆被全部清除: 通过clear()方法清除');
		});
	});


	describe('PublishMethod.getRowData(table, target)', function() {
		it('基础验证', function () {
			expect(PublishMethod.getRowData).toBeDefined();
			expect(PublishMethod.getRowData.length).toBe(2);
		});

		it('target为空', function () {
			expect(PublishMethod.getRowData(table)).toEqual({});
		});

		it('参数完整', function () {
			expect(PublishMethod.getRowData(table, trList[0])).toEqual(testData.data[0]);
			expect(PublishMethod.getRowData(table, trList[2])).toEqual(testData.data[2]);
		});
	});

	describe('PublishMethod.setSort(table, sortJson, callback, refresh)', function() {
		let callback1 = null;
		let callback2 = null;
		let callback3 = null;
		let sortJson = null;
		beforeEach(() => {
			callback1 = jasmine.createSpy('callback');
			callback2 = jasmine.createSpy('callback');
			callback3 = jasmine.createSpy('callback');
		});

		afterEach(() => {
			callback1 = null;
			callback2 = null;
			callback3 = null;
			sortJson = null;
		});
		it('基础验证', function () {
			expect(PublishMethod.setSort).toBeDefined();
			expect(PublishMethod.setSort.length).toBe(4);
		});

		it('执行', function () {
			sortJson = {
				name: 'DESC'
			};
			PublishMethod.setSort(table, sortJson, callback1);
			expect(callback1).toHaveBeenCalled();
			expect(PublishMethod.get(table).sortData.name).toBe('DESC');

			sortJson = {
				name: 'ASC'
			};
			PublishMethod.setSort(table, sortJson, callback2, false);
			expect(callback2).toHaveBeenCalled();
			expect(PublishMethod.get(table).sortData.name).toBe('ASC');

			// 传递无效的值
			sortJson = {
				name: undefined
			};
			PublishMethod.setSort(table, sortJson, callback3, false);
			expect(callback3).toHaveBeenCalled();
			expect(PublishMethod.get(table).sortData.name).toBe(undefined);

		});
	});

	describe('PublishMethod.showTh(table, target) or PublishMethod.hideTh(table, target)', function() {
		let firstTh = null;
		let lastTh = null;
		let firstTd = null;
		let lastTd = null;
		beforeAll(() => {
			firstTh = table.querySelector('thead th');
			lastTh = table.querySelector('thead th:last-child');
			firstTd = table.querySelector('tbody td');
			lastTd = table.querySelector('tbody td:last-child');
		});

		afterAll(() => {
			firstTh = null;
			lastTh = null;
			firstTd = null;
			lastTd = null;
		});

		it('基础验证', function () {
			expect(PublishMethod.showTh).toBeDefined();
			expect(PublishMethod.showTh.length).toBe(2);

			expect(PublishMethod.hideTh).toBeDefined();
			expect(PublishMethod.hideTh.length).toBe(2);
		});

		it('执行 hideTh', function () {
			expect(firstTh.getAttribute('th-visible')).toBe('visible');
			expect(firstTd.getAttribute('td-visible')).toBe('visible');
			expect(lastTh.getAttribute('th-visible')).toBe('visible');
			expect(lastTd.getAttribute('td-visible')).toBe('visible');

			PublishMethod.hideTh(table, firstTh);
			expect(firstTd.getAttribute('td-visible')).toBe('none');
		});

		it('执行 showTh', function () {
			expect(firstTh.getAttribute('th-visible')).toBe('none');
			expect(firstTd.getAttribute('td-visible')).toBe('none');
			expect(lastTh.getAttribute('th-visible')).toBe('visible');
			expect(lastTd.getAttribute('td-visible')).toBe('visible');

			PublishMethod.showTh(table, firstTh);
			expect(firstTh.getAttribute('th-visible')).toBe('visible');
			expect(firstTd.getAttribute('td-visible')).toBe('visible');
			expect(lastTh.getAttribute('th-visible')).toBe('visible');
			expect(lastTd.getAttribute('td-visible')).toBe('visible');
		});

		it('执行 showTh or hideTh', function () {
			expect(firstTh.getAttribute('th-visible')).toBe('visible');
			expect(firstTd.getAttribute('td-visible')).toBe('visible');
			expect(lastTh.getAttribute('th-visible')).toBe('visible');
			expect(lastTd.getAttribute('td-visible')).toBe('visible');

			PublishMethod.hideTh(table, [firstTh, lastTh]);
			expect(firstTh.getAttribute('th-visible')).toBe('none');
			expect(firstTd.getAttribute('td-visible')).toBe('none');
			expect(lastTh.getAttribute('th-visible')).toBe('none');
			expect(lastTd.getAttribute('td-visible')).toBe('none');

			PublishMethod.showTh(table, [firstTh, lastTh]);
			expect(firstTh.getAttribute('th-visible')).toBe('visible');
			expect(firstTd.getAttribute('td-visible')).toBe('visible');
			expect(lastTh.getAttribute('th-visible')).toBe('visible');
			expect(lastTd.getAttribute('td-visible')).toBe('visible');
		});
	});

	describe('PublishMethod.exportGridToXls(table, fileName, onlyChecked)', function() {
		it('基础验证', function () {
			expect(PublishMethod.exportGridToXls).toBeDefined();
			expect(PublishMethod.exportGridToXls.length).toBe(3);
		});

		it('执行', function () {
			expect(PublishMethod.exportGridToXls(table)).toBe(true);
		});
	});

	describe('PublishMethod.setQuery(table, query, isGotoFirstPage, callback)', function() {
		let callback1 = null;
		let callback2 = null;
		let callback3 = null;
		beforeEach(() => {
			callback1 = jasmine.createSpy('callback');
			callback2 = jasmine.createSpy('callback');
			callback3 = jasmine.createSpy('callback');
		});

		afterEach(() => {
			callback1 = null;
			callback2 = null;
			callback3 = null;
		});

		it('基础验证', function () {
			expect(PublishMethod.setQuery).toBeDefined();
			expect(PublishMethod.setQuery.length).toBe(4);
		});

		it('执行', function () {
			// query 为 init 时传递的参数值
			expect(PublishMethod.get(table).query).toEqual(queryValue);

			// query值为空, 不指定 isGotoFirstPage
			PublishMethod.setQuery(table, {}, callback1);
			expect(callback1).toHaveBeenCalled();
			expect(PublishMethod.get(table).query).toEqual({});

			// query值不为空, 指定 isGotoFirstPage = true
			PublishMethod.setQuery(table, {cc: 1}, true, callback2);
			expect(callback2).toHaveBeenCalled();
			expect(PublishMethod.get(table).query).toEqual({cc: 1});

			// query值为空对象, 指定 isGotoFirstPage = false
			PublishMethod.setQuery(table, {}, false, callback3);
			expect(callback3).toHaveBeenCalled();
			expect(PublishMethod.get(table).query).toEqual({});

			// 不传递query, 不指定 isGotoFirstPage
			PublishMethod.setQuery(table, undefined, false, callback3);
			expect(callback3).toHaveBeenCalled();
			expect(PublishMethod.get(table).query).toBeUndefined();

		});
	});

	describe('PublishMethod.setAjaxData(table, ajaxData)', function() {
		let checkAllTh = null;
		let checkOneTh = null;
		beforeAll(() => {
			checkAllTh = table.querySelector('thead th[gm-checkbox="true"] input');
			checkOneTh = table.querySelector('tbody td[gm-checkbox="true"] input');
		});

		afterAll(() => {
			checkAllTh = null;
			checkOneTh = null;
		});

		it('基础验证', function () {
			expect(PublishMethod.setAjaxData).toBeDefined();
			expect(PublishMethod.setAjaxData.length).toBe(2);
		});

		it('执行', function () {
			// 全选
			checkAllTh.click();
			expect(PublishMethod.getCheckedTr(table).length).toBe(testData.data.length);

			// 取消全选
			checkAllTh.click();
			expect(PublishMethod.getCheckedTr(table).length).toBe(0);

			// 将静态数据更换为 testData2
			PublishMethod.setAjaxData(table, testData2);

			// 全选
			checkAllTh.click();
			expect(PublishMethod.getCheckedTr(table).length).toBe(testData2.data.length);

			// 取消全选
			checkAllTh.click();
			expect(PublishMethod.getCheckedTr(table).length).toBe(0);

			// 将静态数据更换为 testData
			PublishMethod.setAjaxData(table, testData);

			// 全选
			checkAllTh.click();
			expect(PublishMethod.getCheckedTr(table).length).toBe(testData.data.length);

			// 取消全选
			checkAllTh.click();
			expect(PublishMethod.getCheckedTr(table).length).toBe(0);

		});
	});

	describe('PublishMethod.refreshGrid(table, isGotoFirstPage, callback)', function() {
		let callback1 = null;
		let callback2 = null;
		let callback3 = null;
		beforeAll(() => {
			callback1 = jasmine.createSpy('callback');
			callback2 = jasmine.createSpy('callback');
			callback3 = jasmine.createSpy('callback');
		});

		afterAll(() => {
			callback1 = null;
			callback2 = null;
			callback3 = null;
		});

		it('基础验证', function () {
			expect(PublishMethod.refreshGrid).toBeDefined();
			expect(PublishMethod.refreshGrid.length).toBe(3);
		});

		it('执行', function () {
			PublishMethod.refreshGrid(table, callback1);
			expect(callback1).toHaveBeenCalled();

			PublishMethod.refreshGrid(table, true, callback2);
			expect(callback2).toHaveBeenCalled();

			PublishMethod.refreshGrid(table, false, callback3);
			expect(callback3).toHaveBeenCalled();
		});
	});

	describe('PublishMethod.getCheckedTr(table)', function() {
		let checkAllTh = null;
		let checkOneTh = null;
		beforeAll(() => {
			checkAllTh = table.querySelector('thead th[gm-checkbox="true"] input');
			checkOneTh = table.querySelector('tbody td[gm-checkbox="true"] input');
		});

		afterAll(() => {
			checkAllTh = null;
			checkOneTh = null;
		});

		it('基础验证', function () {
			expect(PublishMethod.getCheckedTr).toBeDefined();
			expect(PublishMethod.getCheckedTr.length).toBe(1);
		});

		it('操作验证', function () {
			// 全选
			checkAllTh.click();
			expect(PublishMethod.getCheckedTr(table).length).toBe(testData.data.length);

			// 取消全选
			checkAllTh.click();
			expect(PublishMethod.getCheckedTr(table).length).toBe(0);

			// 选中第一个
			checkOneTh.click();
			expect(PublishMethod.getCheckedTr(table).length).toBe(1);

			// 全选
			checkAllTh.click();
			expect(PublishMethod.getCheckedTr(table).length).toBe(testData.data.length);

			// 取消全选
			checkAllTh.click();
			expect(PublishMethod.getCheckedTr(table).length).toBe(0);
		});
	});

	describe('PublishMethod.getCheckedTr(table)', function() {
		let checkAllTh = null;
		let checkOneTh = null;
		beforeAll(() => {
			checkAllTh = table.querySelector('thead th[gm-checkbox="true"] input');
			checkOneTh = table.querySelector('tbody td[gm-checkbox="true"] input');
		});

		afterAll(() => {
			checkAllTh = null;
			checkOneTh = null;
		});

		it('基础验证', function () {
			expect(PublishMethod.getCheckedData).toBeDefined();
			expect(PublishMethod.getCheckedData.length).toBe(1);
		});

		it('返回值', function () {
			expect(PublishMethod.getCheckedData(table).length).toEqual(0);
			expect(PublishMethod.getCheckedData(table)).toEqual([]);

			// 全选
			checkAllTh.click();
			expect(PublishMethod.getCheckedData(table).length).toBe(testData.data.length);
			expect(PublishMethod.getCheckedData(table)[0].createDate).toBe(testData.data[0].createDate);
			expect(PublishMethod.getCheckedData(table)[1].name).toBe(testData.data[1].name);
			expect(PublishMethod.getCheckedData(table)[2].age).toBe(testData.data[2].age);

			// 取消全选
			checkAllTh.click();
			expect(PublishMethod.getCheckedData(table).length).toBe(0);

			// 选中第一个
			checkOneTh.click();
			expect(PublishMethod.getCheckedData(table).length).toBe(1);
			expect(PublishMethod.getCheckedData(table)[0].createDate).toBe(testData.data[0].createDate);
			expect(PublishMethod.getCheckedData(table)[0].name).toBe(testData.data[0].name);
			expect(PublishMethod.getCheckedData(table)[0].age).toBe(testData.data[0].age);
			expect(PublishMethod.getCheckedData(table)[0].info).toBe(testData.data[0].info);
			expect(PublishMethod.getCheckedData(table)[0].operation).toBe(testData.data[0].operation);

			// 全选
			checkAllTh.click();
			expect(PublishMethod.getCheckedData(table).length).toBe(testData.data.length);
			expect(PublishMethod.getCheckedData(table)).toEqual(testData.data);

			// 取消全选
			checkAllTh.click();
			expect(PublishMethod.getCheckedData(table).length).toEqual(0);
			expect(PublishMethod.getCheckedData(table)).toEqual([]);
		});
	});

});

describe('PublishMethod.destroy(table)', function() {
	let table = null;
	let arg = null;
	beforeEach(() => {
		arg = {
			ajax_data: testData,
			gridManagerName: 'test-publish',
			supportSorting: true,
			supportRemind: true,
			supportAjaxPage: true,
			columnData: [
				{
					key: 'name',
					width: '100px',
					text: '名称'
				},{
					key: 'info',
					text: '使用说明'
				},{
					key: 'url',
					text: 'url'
				},{
					key: 'createDate',
					text: '创建时间'
				},{
					key: 'lastDate',
					text: '最后修改时间'
				},{
					key: 'action',
					text: '操作',
					template: function(action, rowObject){
						return '<span class="plugin-action edit-action" learnLink-id="'+rowObject.id+'">编辑</span>'
							+'<span class="plugin-action del-action" learnLink-id="'+rowObject.id+'">删除</span>';
					}
				}
			]
		};
		table = document.createElement('table');
		document.body.appendChild(table);
		PublishMethod.init(table, arg);
	});

	afterEach(() => {
		table = null;
		arg = null;
		document.body.innerHTML = '';
	});

	it('基础验证', function () {
		expect(PublishMethod.destroy).toBeDefined();
		expect(PublishMethod.destroy.length).toBe(1);
	});

	it('验证移除效果', function () {
		// 全选
		expect(table.jToolEvent['clickth[gm-checkbox="true"] input[type="checkbox"]']).toBeDefined();
		expect(table.jToolEvent['clicktd[gm-checkbox="true"] input[type="checkbox"]']).toBeDefined();

		// 宽度调整
		expect(table.jToolEvent['mousedown.adjust-action']).toBeDefined();

		// 排序
		expect(table.jToolEvent['mouseup.sorting-action']).toBeDefined();

		// Hover
		expect(table.jToolEvent['mousemovetd']).toBeDefined();
		PublishMethod.destroy(table);
		expect(table.jToolEvent['clickth[gm-checkbox="true"] input[type="checkbox"]']).toBeUndefined();
		expect(table.jToolEvent['mousedown.adjust-action']).toBeUndefined();
		expect(table.jToolEvent['mouseup.sorting-action']).toBeUndefined();
		expect(table.jToolEvent['mousemovetd']).toBeUndefined();
	});
});
