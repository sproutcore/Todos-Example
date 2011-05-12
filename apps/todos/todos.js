// ==========================================================================
// Project:   Todos
// Copyright: ©2011 My Company, Inc.
// ==========================================================================

/*globals Todos*/
sc_require("views/overlay");

Todos = SC.Application.create({
  store: SC.Store.create().from("SC.BulkDataSource")
});

Todos.Todo = SC.Record.extend({
  title: SC.Record.attr(String),
  isDone: SC.Record.attr(Boolean, { defaultValue: NO, key: 'done' })
});

Todos.Todo.resourceName = 'todo';
Todos.store.commitRecordsAutomatically = true;

Todos.CreateTodoView = SC.TextField.extend({
  insertNewline: function() {
    var value = this.get('value');

    if (value) {
      Todos.todoListController.createTodo(value);
      this.set('value', '');
    }
  }
});

Todos.signInOverlayView = SC.OverlayView.create({
  templateName: 'sign_in'
});

Todos.onSignIn = function() {
  var query = SC.Query.local(Todos.Todo, {
    orderBy: 'id DESC'
  });
  var todos = Todos.store.find(query);
  Todos.todoListController.set('content', todos);
  Todos.signInOverlayView.hide();
};

Todos.userSessionController = SC.Object.create({
  isSignedIn: function(callback) {
    SC.Request.getUrl("/users/signed_in").json()
      .notify(this, 'didSignedInCheck', callback).send();
  },

  didSignedInCheck: function(response, callback) {
    callback(response.get("body")["signed_in"]);
  },

  signIn: function() {
    SC.Request.postUrl("/users/sign_in").json()
      .notify(this, 'didSignIn')
      .send({user: { email: this.get("email"), password: this.get("password")}});
  },

  didSignIn: function(response) {
    if(response.get("status") === 401) {
      alert('error');
    } else {
      Todos.onSignIn();
    }
  },

  signOut: function() {
    SC.Request.getUrl("/users/sign_out").json()
      .notify(this, 'didSignOut').send();
  },

  didSignOut: function(response) {
    console.log(response.body);
    window.location.reload();
  }
});

Todos.MarkDoneView = SC.Checkbox.extend({
  titleBinding: '.parentView.content.title',
  valueBinding: '.parentView.content.isDone'
});

Todos.StatsView = SC.TemplateView.extend({
  remainingBinding: 'Todos.todoListController.remaining',

  displayRemaining: function() {
    var remaining = this.get('remaining');
    return remaining + (remaining === 1 ? " item" : " items");
  }.property('remaining').cacheable()
});

Todos.todoListController = SC.ArrayController.create({
  createTodo: function(title) {
    Todos.store.createRecord(Todos.Todo, { title: title });
  },

  remaining: function() {
    return this.filterProperty('isDone', false).get('length');
  }.property('@each.isDone'),

  clearCompletedTodos: function() {
    this.filterProperty('isDone', true).forEach(function(todo) { todo.destroy(); });
  },

  allAreDone: function(key, value) {
    if (value !== undefined) {
      this.setEach('isDone', value);

      return value;
    } else {
      return this.get('length') && this.everyProperty('isDone', true);
    }
  }.property('@each.isDone')
});

Todos.TextFieldView = SC.TemplateView.extend(SC.TextFieldSupport, {

  classNames: ['text-field-view'],

  /* The 'name' attribute of the input. */
  name: '',

  /* The 'placeholder' attribute of the input. */
  placeholder: '',

  /* The 'title' attribute of the input. */
  title: '',

  /* The 'type' attribute of the input. */
  type: 'text',

  // These could be made into some generic displayProperties method like in theming.js
  // These could also check for a localize property like many controls do
  displayTitle: function() {
    var title = this.get('title');

    return title.loc();
  }.property('title').cacheable(),

  displayPlaceholder: function() {
    var placeholder = this.get('placeholder');

    return placeholder.loc();
  }.property('placeholder').cacheable(),

  template: SC.Handlebars.compile('<input {{bindAttr name="name" type="type" title="displayTitle" placeholder="displayPlaceholder"}}/>')

});

SC.ready(function() {
  Todos.mainPane = SC.TemplatePane.append({
    layerId: 'todos',
    templateName: 'todos'
  });

  Todos.userSessionController.isSignedIn(function(isSignedIn) {
    if(isSignedIn) {
      Todos.onSignIn();
    } else {
      Todos.signInOverlayView.show();
    }
  });
});
