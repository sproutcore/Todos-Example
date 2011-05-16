Todos.projectsCollectionView = SC.TemplateCollectionView.extend({
  itemView: SC.TemplateView.extend({
    selectedBinding: "Todos.projectsListController.selected",
    isSelected: function() {
      var selected = this.get('selected'),
          content = this.get('content');

      return selected && content && selected === content;
    }.property("selected").cacheable(),

    mouseUp: function() {
      Todos.projectsListController.selectObject(this.get('content'));
    }
  })
});
