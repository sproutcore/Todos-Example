Todos.CreateProjectView = SC.TextField.extend({
  insertNewline: function() {
    var value = this.get('value');

    if (value) {
      Todos.projectsListController.createProject(value);
      this.set('value', '');
    }
  }
});
