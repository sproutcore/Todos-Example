SC.OverlayView = SC.TemplateView.extend({
  classBinding: 'isVisible',
  classNames: ['overlay'],
  isVisible: false,

  show: function() {
    this.set('isVisible', true);
  },
  hide: function() {
    this.set('isVisible', false);
  }
});
