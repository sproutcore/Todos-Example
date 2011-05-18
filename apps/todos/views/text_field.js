Todos.TextField = SC.TextField.extend({
  placeholder: '',
  type: 'text',
  template: SC.Handlebars.compile('<input {{bindAttr  type="type" placeholder="placeholder"}}/>')
});
