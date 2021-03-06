steal('jquery', 'funcunit', 'canui/list', 'can/view/ejs', function($) {
	module("can.ui.List");

	test("Initialize empty", function () {
		var emptyHtml = '<li>Nothing here...</li>',
			container = $('<ul>').appendTo('#qunit-test-area').list({
				view : '//canui/list/test.ejs',
				emptyContent : emptyHtml
			});

		equal(container.html(), emptyHtml, 'Set to empty text');
	});

	test("Initialize with observe list, live binding", function () {
		var people = new can.Observe.List([
			{
				name : 'John I',
				age : 10
			}, {
				name : 'John II',
				age : 18
			}
		]);

		var container = $('<ul>').appendTo('#qunit-test-area').list({
				view : '//canui/list/test.ejs',
				list : people
			});

		equal(container.find('li').length, 2, 'Two items rendered');
		equal($.trim(container.find('li:first').html()), 'John I', 'First li rendered');
		people[0].attr('name', 'John Updated');
		equal($.trim(container.find('li:first').html()), 'John Updated', 'First li updated');
		people.push(new can.Observe({ name : 'Dave', age : 23 }));
		equal(container.find('li').length, 3, 'New item rendered');
		equal($.trim(container.find('li:last').html()), 'Dave', 'Last li is new item');
		people.shift();
		equal(container.find('li').length, 2, 'Element removed');
		equal($.trim(container.find('li:first').html()), 'John II', 'First li shifted');
	});

	test("Initialize with Deferred", function() {
		var dfd = can.Deferred();

		var container = $('<ul>').appendTo('#qunit-test-area').list({
			view : '//canui/list/test.ejs',
			loadingContent : '<li>Loading</li>',
			list : dfd
		});

		equal(container.find('li:first').html(), 'Loading', 'Showing loading');
		dfd.resolve([
			{
				name : 'Deferred I',
				age : 10
			}, {
				name : 'Deferred II',
				age : 18
			}
		]);
		equal(container.find('li').length, 2, 'Two items rendered');
		equal($.trim(container.find('li:first').html()), 'Deferred I', 'First li rendered');
	});

	test("Initialize with compute", function() {
		var compute = can.compute([
			{
				name : 'Compute I',
				age : 10
			}, {
				name : 'Compute II',
				age : 18
			}
		]);

		var container = $('<ul>').appendTo('#qunit-test-area').list({
			view : '//canui/list/test.ejs',
			loadingContent : '<li>Loading</li>',
			emptyContent : '<li>Empty!</li>',
			list : compute
		});

		equal($.trim(container.find('li:first').html()), 'Compute I', 'First li rendered');
		compute([]);
		equal($.trim(container.find('li:first').html()), 'Empty!', 'Showing empty content after updating compute');
	});

	test("items", function() {
		var container = $('<ul>').appendTo('#qunit-test-area').list({
			view : '//canui/list/test.ejs',
			list : [
				{
					name : 'John I',
					age : 10
				}, {
					name : 'John II',
					age : 18
				}
			]
		});

		var list = container.list('items');
		equal(list.length, 2, 'Got two items');
		ok(list instanceof can.Observe.List, 'Converted to can.Observe.List');
		var item = container.list('items', container.find('li:eq(1)'));
		ok(item[0] instanceof can.Observe, 'Got can.Observe');
		equal(item[0].name, 'John II', 'Got correct item');
	});

	test('rowElements', function() {
		var people = new can.Observe.List([
			{
				name : 'John I',
				age : 10
			}, {
				name : 'John II',
				age : 18
			}
		]);

		var container = $('<ul>').appendTo('#qunit-test-area').list({
			view : '//canui/list/test.ejs',
			list : people
		});

		var el = container.list('rowElements', people[0]);
		equal(can.$.trim(el.html()), 'John I', 'Got element with correct HTML');
	});
})