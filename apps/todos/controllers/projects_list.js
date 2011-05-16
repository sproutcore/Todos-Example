Todos.projectsListController = SC.ArrayController.create({
  init: function() {
    this.addObserver('content', function(controller) {
      var projects = controller.get('content');
      projects.addObserver('length', function() {
        var selected = controller.get('selected');
        if(!selected) {
          controller.set('selected', projects.firstObject());
        }
      });
    });
  },

  todos: function() {
    var selected = this.get('selected');
    if(selected) {
      return selected.get('todos');
    }
  }.property('selected').cacheable()
});
