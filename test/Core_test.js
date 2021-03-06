/**
 * Created by baukh on 17/4/19.
 */
'use strict';
import { jTool } from '../src/js/Base';
import Core from '../src/js/Core';
/**
 * 验证类的属性及方法总量
 */
describe('Core 验证类的属性及方法总量', function() {
	var getPropertyCount = null;
	beforeEach(function() {
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
	afterEach(function(){
		getPropertyCount = null;
	});
	it('Function count', function() {
		// es6 中 constructor 也会算做为对象的属性, 所以总量上会增加1
		expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(Core)))).toBe(5 + 1);
	});
});

describe('Core.refresh($table, callback)', function() {
	it('基础验证', function () {
		expect(Core.refresh).toBeDefined();
		expect(Core.refresh.length).toBe(2);
	});
});

describe('Core.removeRefreshingClass($tableWrap)', function() {
	var tableWrap = null;
	var $tableWrap = null;
	var $refreshAction = null;
	beforeEach(function() {
		tableWrap = `
					<div class="table-wrap">
						<div class="page-toolbar">
							<div class="refresh-action"><i class="iconfont icon-shuaxin"></i></div>
						</div>
					</div>`;
		document.body.innerHTML = tableWrap;
		$tableWrap = jTool('.table-wrap');
		$refreshAction = jTool('.refresh-action', $tableWrap);
	});
	afterEach(function(){
		tableWrap = null;
		$tableWrap = null;
		$refreshAction = null;
		document.body.innerHTML = '';
	});

	it('基础验证', function () {
		expect(Core.removeRefreshingClass).toBeDefined();
		expect(Core.removeRefreshingClass.length).toBe(1);
	});

	it('删除效果', function () {
		expect($refreshAction.hasClass('refreshing')).toBe(false);

		$refreshAction.addClass('refreshing');
		expect($refreshAction.hasClass('refreshing')).toBe(true);

		jasmine.clock().install();
		Core.removeRefreshingClass($tableWrap);
		jasmine.clock().tick(2000);
		expect($refreshAction.hasClass('refreshing')).toBe(false);
		jasmine.clock().uninstall();
	});
});

describe('Core.driveDomForSuccessAfter($table, settings, response, callback)', function() {
	beforeEach(function() {
		// 存储console, 用于在测方式完成后原还console对象
		console._error = console.error;
		console.error = jasmine.createSpy("error");
	});
	afterEach(function(){
		console.error = console._error;
		console._error = null;
	});

	it('基础验证', function () {
		expect(Core.driveDomForSuccessAfter).toBeDefined();
		expect(Core.driveDomForSuccessAfter.length).toBe(4);
	});

	it('数据错误提示文本', function () {
		Core.driveDomForSuccessAfter(null, null, null, null);
		expect(console.error).toHaveBeenCalledWith('GridManager Error: ', '请求数据失败！请查看配置参数[ajax_url或ajax_data]是否配置正确，并查看通过该地址返回的数据格式是否正确');
	});
});

describe('Core.createDOM($table)', function() {
	it('基础验证', function () {
		expect(Core.createDOM).toBeDefined();
		expect(Core.createDOM.length).toBe(1);
	});
});

describe('Core.initVisible($table)', function() {
	it('基础验证', function () {
		expect(Core.initVisible).toBeDefined();
		expect(Core.initVisible.length).toBe(1);
	});
});
