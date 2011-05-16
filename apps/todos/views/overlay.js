Todos.OverlayView = SC.TemplateView.extend({
  classBinding: 'isVisible',
  classNames: ['overlay'],
  isVisible: false,

  show: function() {
    this.set('isVisible', true);
  },

  hide: function() {
    this.set('isVisible', false);
  },

  template: SC.Handlebars.compile('<div class="window"><div class="inner">{{view contentView}}</div></div>')
});
