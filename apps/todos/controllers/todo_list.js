Todos.todoListController = SC.ArrayController.create({
  contentBinding: "Todos.projectsListController.todos",

  createTodo: function(title) {
    var project = Todos.projectsListController.get('selected');
    var todo = Todos.store.createRecord(Todos.Todo, { title: title, project: project });
    todo.addObserver('id', function() {
      project.get('todos').addInverseRecord(todo);
    });
  },

  remaining: function() {
    return this.filterProperty('isDone', false).get('length');
  }.property('@each.isDone'),

  clearCompletedTodos: function() {
    var project = Todos.projectsListController.get('selected');
    this.filterProperty('isDone', true).forEach(function(t) {
      project.get('todos').removeInverseRecord(t);
      t.destroy();
    });
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
