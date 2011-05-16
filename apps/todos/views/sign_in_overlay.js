sc_require("views/overlay");

Todos.signInOverlayView = Todos.OverlayView.create({
  contentView: SC.TemplateView.create({
    templateName: 'sign_in'
  })
});
