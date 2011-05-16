Todos.TextFieldView = SC.TemplateView.extend(SC.TextFieldSupport, {

  classNames: ['text-field-view'],

  /* The 'name' attribute of the input. */
  name: '',

  /* The 'placeholder' attribute of the input. */
  placeholder: '',

  /* The 'title' attribute of the input. */
  title: '',

  /* The 'type' attribute of the input. */
  type: 'text',

  // These could be made into some generic displayProperties method like in theming.js
  // These could also check for a localize property like many controls do
  displayTitle: function() {
    var title = this.get('title');

    return title.loc();
  }.property('title').cacheable(),

  displayPlaceholder: function() {
    var placeholder = this.get('placeholder');

    return placeholder.loc();
  }.property('placeholder').cacheable(),

  template: SC.Handlebars.compile('<input {{bindAttr name="name" type="type" title="displayTitle" placeholder="displayPlaceholder"}}/>')

});
