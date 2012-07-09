---
layout: default
version: 1.0b
---

# Welcome to CanUI

CanUI brings the best of CanJS and jQuery++ together to help you build awesome user interfaces.
It is not supposed to be a full UI widget library but instead provides the building blocks you need
to create your own UI widgets the way you want them.

## Get CanUI

## Configuring CanUI

## Fills `$(element).fills([parent])`

[Fills](http://donejs.com/docs.html#!canui.fills) resizes an element so that it always fills out the remaining space of
a parent element. This is extremely useful for complex page layouts because Fills includes all margin, padding
and sibling element dimensions to calculate the size.

When no parent selector or jQuery element is passed, the elements direct parent element will be filled:

{% highlight javascript %}
// Fill the parent
$('#fill').fills();
// Fill the #container element
$('#fill').fills('#container');
{% endhighlight %}

Resize the container in the following example using the blue square to see how the `#fill` element adjusts its size correctly
to fill out the remaining space:

<iframe style="width: 100%; height: 370px" src="http://jsfiddle.net/HSWTA/embedded/result,html,js,css" allowfullscreen="allowfullscreen" frameborder="0">JSFiddle</iframe>


## TableScroll `$(element).tableScroll([fillParent])`

[TableScroll](http://donejs.com/docs.html#!canui.) makes a table scrollable while keeping headers and
footers fixed. This is useful for tables that display big amounts of data in a grid like widget.
A table like this:

{% highlight html %}
<div style="height: 200px; overflow: auto;">
  <table>
    <thead>
      <th>Firstname</th>
      <th>Lastname</th>
    </thead>
    <tbody><!-- ... --></tbody>
  </table>
</div>
{% endhighlight %}

Can be made scrollable like this:

{% highlight javascript %}
$('table').tableScroll();
{% endhighlight %}

The following example shows a scrollable table with header and footer:

<iframe style="width: 100%; height: 270px" src="http://jsfiddle.net/KHNyy/embedded/result,html,js,css" allowfullscreen="allowfullscreen" frameborder="0">JSFiddle</iframe>

### resize `$(element).resize()`

The `resize` event should be triggered on a scrollable table whenever the table dimensions
or column content changes:

{% highlight javascript %}
$('table').tableScroll();
$('table').find('td:first').html('AColumnNameThatIsLong');
$('table').resize();
{% endhighlight %}

### elements `$('table').tableScroll('elements')`

`$('table').tableScroll('elements')` returns an object with references to the `body`, `header`, `footer`
and `scrollBody` elements. This is different than the elements of the original table since TableScroll
changes the DOM to keep the header and footer elements fixed.
To add a class to the scroll body, for example, use this:

{% highlight javascript %}
$('table').tableScroll();
// Get the elements
var elements = $('table').tableScroll('elements');
// Add a class to scrollBody
elements.scrollBody.addClass('scollable');
{% endhighlight %}

### updateCols `$(element).tableScroll('updateCols')`

`$(element).tableScroll('updateCols')` should be called after a header or footer column has been updated, removed
or inserted. This will also trigger a `resize` event.

{% highlight javascript %}
$('table').tableScroll();
// Get the header element
var header = $('table').tableScroll('elements').header;
// Update the first heading column
header.find('th:first').html('NewColumnName');
// Update the columns
$('table').tableScroll('updateCols');
{% endhighlight %}

### rows `$(element).tableScroll('rows')`

`$(element).tableScroll('rows')` returns a jQuery collection containing all table rows. This can be used to
remove, insert or replace certain rows. A [resize](#tablescroll-resize) needs to be triggered after any modification.

{% highlight javascript %}
// Insert a new row at the end
$('<tr><td>John</td><td>Doe</td></tr>')
  .insertAfter($('#grid').grid('rows').last());
// Remove the second row
$('#grid').grid('rows').eq(1).remove();
// Resize everything
$('#grid').resize();
$('#grid').tableScroll('rows') // -> [<tr><td>New</td><td>User</td></tr>]
{% endhighlight %}


## Grid `$(element).grid(options)`

[Grid](http://donejs.com/docs.html#!canui.grid) provides a table that live binds to a
[can.Observe.List](http://donejs.com/docs.html#!can.Observe.List).
Along with [TableScroll](#tablescroll) this can be used to create a full grid widget.

Possible options:

- `emptyText` - The content to display when there are no items
- `loadingText` - The text to display when a deferred is being resolved
- `list` - The item provider described in more detail in the [list](#grid-list) section
- `columns` - The columns to display, see the [columns](#grid-column) section

With a markup like this:

{% highlight html %}
<div id="grid"></div>
{% endhighlight %}

And this `can.Observe.List`:

{% highlight javascript %}
var people = new can.Observe.List([{
    firstname : 'John',
    lastname : 'Doe',
    age : 42
  }, {
    firstname : 'First',
    lastname : 'Last',
    age : 26
  }
]);
{% endhighlight %}

The Grid can be initialized like this:

{% highlight javascript %}
$('#grid').grid({
  columns : [
    { header : 'First name', content : 'firstname' },
    { header : 'Last name', content : 'latname' },
    { header : 'Age', content : 'age' }
  ],
  list : people
});
{% endhighlight %}

The following example shows a grid that allows you to add new and remove items and reset the list
to its initial state:

<iframe style="width: 100%; height: 350px" src="http://jsfiddle.net/hY3AS/embedded/result,html,js,css" allowfullscreen="allowfullscreen" frameborder="0">JSFiddle</iframe>

### columns `$(element).grid('columns', [columns])`

Column definitions can be provided as a `can.Observe.List` or an array of objects. Each object
must at least contain:

- `header` - The header content.
- `content` - The content to display for this column. This can either be an attribute name
or a callback in the form of `function(observe, index)` that returns the content or a [can.compute](#) for the current column.

The following example creates a grid with a column that contains the combined first- and lastname:

{% highlight javascript %}
$('#grid').grid({
  columns : [{
      header : 'Name',
      content : function(observe) {
        return can.compute(function() {
          return observe.attr('firstname') + ' ' + observe.attr('lastname');
        });
      }
    },
    { header : 'Age', content : 'age' }
  ],
  list : people
});
{% endhighlight %}

It is also possible to render [EJS views](http://canjs.us/#can_ejs). For example an EJS script
that wraps a persons age into a custom element and adds a class if it is under 21:

{% highlight html %}
<script type="text/ejs" id="ageEJS">
<span <% if(person.attr('age') < 21) { %>class="underage"<% } %>>
  <%= person.attr('age') %>
</span>
</script>
{% endhighlight %}

{% highlight javascript %}
$('#grid').grid({
  columns : [
    { header : 'First name', content : 'firstname' },
    { header : 'Last name', content : 'latname' },
    {
      header : 'Age',
      content : function(observe) {
        return can.view('ageEJS', { person : observe });
      }
    }
  ],
  list : people
});
{% endhighlight %}

Columns are acessible as a `can.Observe.List`, which makes it easy to update its attributes:

{% highlight javascript %}
$('#grid').grid('columns').attr('0.header', 'Full name');
{% endhighlight %}

### list `$(element).grid('list', [list])`

There are several ways to provide the grid with a list of data. Usually it will be a `can.Observe.List` instance
that contains the observable objects. When passing a normal Array, it will be converted to an observable list.
Another option is to pass a `can.Deferred` that resolves to an observable list or array. The grid will show the
content of `loadingText` while the Deferred is being resolved.

This allows to directly pass `can.Model` requests:

{% highlight javascript %}
var Person = can.Model({
    findAll : 'GET /people',
    findOne : 'GET /people/{id}',
    create  : 'POST /people',
    update  : 'PUT /people/{id}',
    destroy : 'DELETE /people/{id}'
  }, {});

$('#grid').grid({
  columns : [{
      header : 'First name',
      attr : 'firstname'
    }, {
      header : 'Last name',
      attr : 'lastname'
    }
  ],
  list : Person.findAll()
});
{% endhighlight %}

The last option is to pass a `can.compute` which returns an array, a `can.Observe.List` or a `can.Deferred`.
As an example, this can be used to load the new data whenever a pagination observe changes:

{% highlight javascript %}
var paginator = new can.Observe({
    offset : 0,
    limit : 10
  });
$('#grid').grid({
  columns : [{
      header : 'First name',
      attr : 'firstname'
    }, {
      header : 'Last name',
      attr : 'lastname'
    }
  ],
  list : can.compute(function() {
    return Person.findAll({
      offset : paginator.attr('offset'),
      limit : paginator.attr('limit')
    });
  })
});
{% endhighlight %}

### items `$(element).grid('items', [rows])`

`$(element).grid('items', [rows])` returns a `can.Observe.List` of all items or all items for the given row elements.
It will return a single `can.Observe` if only one row is passed. This makes it easy to retrieve the observable
instance for a row that has been clicked:

{% highlight javascript %}
$('#grid tr').click(function() {
  var observe = $('#grid').grid('items', $(this));
});
{% endhighlight %}

### rows `$(element).grid('rows', [observes])`

`$(element).grid('rows', [observes])` returns a jQuery collection of all rows or all rows for the given observes.

## Get Help

This site highlights the most important features of CanUI. You can find the full API documentation on the
[DoneJS documentation](http://donejs.com/docs.html#!canui) page.

There are also several places you can go to ask questions or get help debugging problems.

### Twitter

Follow [@canui](http://twitter.com/#!/canui) for updates, announcements and quick answers to your questions.

### Forums

Visit the [Forums](http://forum.javascriptmvc.com/#Forum/canui) for questions requiring more than 140 characters. DoneJS has a thriving community that's always eager to help out.

### IRC

The DoneJS IRC channel (`#donejs` on **irc.freenode.net**) is an awesome place to hang out with fellow DoneJS users and get your questions answered quickly.

__Help Us Help You __

Help the community help you by using the [CanUI jsFiddle template](http://jsfiddle.net/). Just fork it and include the URL when you are asking for help.

### Get Help from Bitovi

Bitovi _(developers of CanUI)_ offers [training](http://bitovi.com/training/) and [consulting](http://bitovi.com/consulting/) for your team. They can also provide private one-on-one support staffed by their JavaScript/Ajax experts. [Contact Bitovi](mailto:contact@bitovi.com) if you're interested.

## Why CanUI

### Supported

CanUI is developed by [Bitovi](http://bitovi.com).  We're active on the forums, but should the need
arise, can also be hired for paid support, training, and development.

## Developing CanUI

To develop CanUI, add features, etc, you first must install DoneJS. DoneJS is the
parent project of CanUI and the 4.0 version of JavaSciptMVC. It has DocumentJS and
Steal as submodules that are used to generate the documentation and build the CanUI downloads.

### Installing

 1. `fork` [canui on github](https://github.com/jupiterjs/canui).
 2. Clone DoneJS with:

        git clone git@github.com:jupiterjs/donejs

 3. Open the donejs folder's .gitmodule file and change the URL of the `"canui"` submodule:

        url = git://github.com/jupiterjs/canui.git

    to your `fork`ed URL like

        url = git://github.com/justinbmeyer/canui.git

 4. Install all submodules by running

        cd donejs
        git submodule update --init --recursive

    Depending on your version of git, you might need to cd into each submodule and run `git checkout`.

### Developing

After [installing](#developing_canui__-installing) CanUI and DoneJS, you'll find
the

### Documentation

To edit canui.com, installing CanUI and DoneJS is not necessary. Simply *fork* and edit the
github pages's [index.md page](https://github.com/jupiterjs/canui/blob/gh-pages/index.md) online. Don't forget to
submit a pull request.

To edit the documentation at [DoneJS.com](http://doneJS.com/docs.html):

 1. [install](#developing_canui-installing) CanUI and DoneJS.
 2. Edit the markdown and js files in the `canui` folder.
 3. Generate the docs with:

        js site/scripts/doc.js

    View them at `site/docs.html`

 4. Submit a pull request.

### Making a build

To make a CanUI build, run:

    js canui/build/make.js

It puts the downloads in `canui/dist`. To build a specific version check out the [git tag](https://github.com/jupiterjs/canui/tags) you want to build and run the above command.

### Change Log

__1.0 Beta__

Released!