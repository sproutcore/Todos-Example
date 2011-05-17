sc_require('data_sources/local_storage');

// **Todos** is a simple app that demonstrates how to build data-driven
// applications in SproutCore.
//
// This file contains all of its models, views, and controllers. You can also
// find its Handlebars file in `resources/templates/todos.handlebars`.
//
// Note: Class definitions start with uppercase letters, like `Todos.Todo`.
// Instances of classes, or singletons, start with a lowercase letter: `Todos.todoListController`.



// ## Namespace

// Create your application's namespace. All of your models, views and
// controllers will be defined here.
Todos = SC.Application.create();

// ## Models

// Create an instance of SC.Store, where all of your application
// data will be stored.
Todos.store = SC.Store.create({
  // Use the local storage adapter to persist new records
  dataSource: 'SC.LocalStorageDataSource',

  // Tell the store to automatically save to local storage
  // as soon as a new record is created, or an existing record is
  // modified.
  commitRecordsAutomatically: true
});

// Define the Todo model.
Todos.Todo = SC.Record.extend({
  title: SC.Record.attr(String),
  isDone: SC.Record.attr(Boolean, { defaultValue: false }),
  createdAt: SC.Record.attr(SC.DateTime),

  // The string used by the localStorage adapter to uniquely identify
  // this model type.
  localStorageKey: 'todo'
});

// Create a query that matches all records of type `Todos.Todo`.
Todos.allTodosQuery = SC.Query.local(Todos.Todo);

// ## Controller

// A controller that represents the list of Todo objects.
//
// An SC.ArrayController acts like a proxy to an underlying array. You can
// treat the array controller like the original array, and bind views to it,
// but can create additional properties that contain aggregate information
// about the members of the underlying array.
//
// The other advantage of using an array controller is that you can swap out
// the underlying array at any time. Because all of the views in this
// application are bound to the controller, they will all update automatically.
Todos.todoListController = SC.ArrayController.create({

  // Find all of the records that match our query, then tell
  // the array controller that it should represent this array.
  content: Todos.store.find(Todos.allTodosQuery),

  // Define a method for creating new todos.
  // Creates a new todo with the passed title, then adds it
  // to the datastore.
  //
  // Because this array controller is backed by a live query, it will be
  // updated automatically.
  createTodo: function(title) {
    var todo = Todos.store.createRecord(Todos.Todo, {
      title: title,
      createdAt: (+new Date())
    });
  },

  // This function is what's called a **computed property**. Computed
  // properties are functions that can be treated as properties, which means
  // it's easy to bind your views to them.
  //
  // In this case, this function represents the number of incomplete todos.
  // It returns the number of Todo objects whose `isDone` property is `false`.
  // `filterProperty()` is an enumerable helper that returns an array; we just
  // return the length of that array.
  remaining: function() {
    return this.filterProperty('isDone', false).get('length');

    // Here we do two things: We tell SproutCore to treat this function as a
    // computed property, by using the `property()` function annotation.
    //
    // We also provide a list of **dependent keys**. A dependent key is a
    // property that this computed property relies on to compute its value.
    // If any of the dependent keys changes, this computed property is updated
    // automatically.
    //
    // In this case, we're telling SproutCore "recompute this property any time
    // the `isDone` property on an item in this array changes."
  }.property('@each.isDone'),

  // Define a method that finds all completed todos and destroys them.
  clearCompletedTodos: function() {
    var completedTodos = this.filterProperty('isDone', true);
    completedTodos.forEach(function(todo) {
      todo.destroy();
    });
  },

  // A Boolean computed property that indicates whether all todos have been
  // completed or not. This computed property supports both setting and getting.
  allAreDone: function(key, value) {
    // Determine if `allAreDone` is being set by checking `value` parameter. If
    // not undefined, set all `isDone` properties of the todos to the passed
    // value.
    if (value !== undefined) {
      this.setEach('isDone', value);

      return value;
    } else {
      // Return true if all todos are done and there is more than zero todos.
      return this.get('length') && this.everyProperty('isDone', true);
    }
  }.property('@each.isDone')

});

// ## Views

// Here we define all of the custom views for our application. Note that most
// views will be defined in the Handlebars template. You only need to describe
// custom views in JavaScript when they implement custom event handling.

// The text field users use to create a new todo. When the user presses the
// return key, the view should send a `createTodo` action to the controller.
Todos.CreateTodoView = SC.TextField.extend({
  insertNewline: function() {
    var value = this.get('value');

    if (value) {
      Todos.todoListController.createTodo(value);
      this.set('value', '');
    }
  }
});

// A view that displays the number of todos remaining.
Todos.StatsView = SC.TemplateView.extend({
  remainingBinding: 'Todos.todoListController.remaining',

  // Computed property that properly pluralizes the number of todos remaining.
  // For example, the number 2 becomes "2 items".
  displayRemaining: function() {
    var remaining = this.get('remaining');
    return remaining + (remaining === 1 ? " item" : " items");
  }.property('remaining').cacheable()
});

// Once the page has loaded, tells SproutCore to append the HTML template
// to the DOM.
SC.ready(function() {
  Todos.mainPane = SC.TemplatePane.append({
    layerId: 'todos',
    templateName: 'todos'
  });
});

