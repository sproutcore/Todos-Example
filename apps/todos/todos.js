// ==========================================================================
// Project:   Todos
// Copyright: ©2011 My Company, Inc.
// ==========================================================================

/*globals Todos*/
Todos = SC.Application.create({
  store: SC.Store.create().from("SC.BulkDataSource")
});

Todos.Todo = SC.Record.extend({
  title: SC.Record.attr(String),
  isDone: SC.Record.attr(Boolean, { defaultValue: NO, key: 'done' }),
  project: SC.Record.toOne("Todos.Project", {
    inverse: "todos", isMaster: NO
  })
});
Todos.Todo.resourceName = 'todo';

Todos.Project = SC.Record.extend({
  name: SC.Record.attr(String),
  todos: SC.Record.toMany("Todos.Todo", {
    inverse: "project", isMaster: YES
  })
});
Todos.Project.resourceName = 'project';

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

SC.ready(function() {
  Todos.mainPane = SC.TemplatePane.append({
    layerId: 'todos',
    templateName: 'todos'
  });

  Todos.userSessionController.isSignedIn(function(isSignedIn) {
    if(isSignedIn) {
      Todos.userSessionController.onSignIn();
    } else {
      Todos.signInOverlayView.show();
    }
  });
});
