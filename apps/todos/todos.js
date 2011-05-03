// ==========================================================================
// Project:   Todos
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Todos */

Todos = SC.Application.create();

Todos.Todo = SC.Object.extend({
  title: null,
  isDone: false
});

Todos.todoListController = SC.ArrayController.create({
  content: [],

  createTodo: function(title) {
    var todo = Todos.Todo.create({ title: title });
    this.pushObject(todo);
  },

  remaining: function() {
    return this.filterProperty('isDone', false).get('length');
  }.property('@each.isDone'),

  clearCompletedTodos: function() {
    this.filterProperty('isDone', true).forEach(this.removeObject, this);
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

Todos.CreateTodoView = SC.TemplateView.extend(SC.TextFieldSupport, {
  insertNewline: function() {
    var value = this.get('value');

    if (value) {
      Todos.todoListController.createTodo(value);
      this.set('value', '');
    }
  }
});

Todos.ClearCompletedView = SC.TemplateView.extend({
  classNames: ['button'],

  mouseDown: function() {
    this.set('isActive', YES);
  },

  mouseUp: function() {
    this.set('isActive', NO);
    Todos.todoListController.clearCompletedTodos();
  },

  touchStart: function(touch) {
    this.mouseDown(touch);
    touch.allowDefault();
    return true;
  },

  touchesDragged: function(evt, touch) {
    evt.allowDefault();
    return true;
  },

  touchEnd: function(touch) {
    this.mouseUp(touch);
    return true;
  }
});

Todos.TodoListView = SC.TemplateCollectionView.extend({
  contentBinding: 'Todos.todoListController'
});

Todos.CheckboxView = SC.TemplateView.extend(SC.CheckboxSupport, {
  classNames: ['checkbox'],

  valueBinding: '.parentView.content.isDone',

  touchStart: function(touch) { },

  touchEnd: function(touch) {
    this.toggleProperty('value');
  }
});

Todos.StatsView = SC.TemplateView.extend({
  remainingBinding: 'Todos.todoListController.remaining',

  displayRemaining: function() {
    var remaining = this.get('remaining');

    return remaining + (remaining === 1 ? " item" : " items");
  }.property('remaining').cacheable()
});

Todos.MarkAllDoneView = SC.TemplateView.extend(SC.CheckboxSupport, {
  classNames: ['checkbox'],

  valueBinding: 'Todos.todoListController.allAreDone',

  touchStart: function(touch) { },

  touchEnd: function(touch) {
    this.toggleProperty('value');
  }
});

SC.ready(function() {
  Todos.mainPane = SC.TemplatePane.append({
    layerId: 'todos',
    templateName: 'todos',

    touchStart: function(touch) {
      touch.allowDefault();
    },

    touchesDragged: function(evt, touches) {
      evt.allowDefault();
    },

    touchEnd: function(touch) {
      touch.allowDefault();
    }
  });
});
