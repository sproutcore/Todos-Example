Todos.projectsListController = SC.ArrayController.create(SC.SelectionSupport, {
  allowsMultipleSelection: NO,
  allowsEmptySelection: NO,

  init: function() {
    var controller = this;
    this.addObserver('content.firstObject', function() {
      if (!this.get('hasSelection')) {
        this.selectObject(this.get('content.firstObject'));
      }
    });
  },

  selected: function() {
    return this.get('selection').firstObject();
  }.property('selection').cacheable(),

  todos: function() {
    var selected = this.get('selected');
    if(selected) {
      return selected.get('todos');
    }
  }.property('selected').cacheable(),

  createProject: function(name) {
    Todos.store.createRecord(Todos.Project, {name: name});
  }
});
