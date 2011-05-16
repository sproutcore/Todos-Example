Todos.userSessionController = SC.Object.create({
  isSignedIn: function(callback) {
    SC.Request.getUrl("/users/signed_in").json()
      .notify(this, 'didSignedInCheck', callback).send();
  },

  didSignedInCheck: function(response, callback) {
    callback(response.get("body")["signed_in"]);
  },

  signIn: function() {
    SC.Request.postUrl("/users/sign_in").json()
      .notify(this, 'didSignIn')
      .send({user: { email: this.get("email"), password: this.get("password")}});
  },

  didSignIn: function(response) {
    if(response.get("status") === 401) {
      alert('error');
    } else {
      this.onSignIn();
    }
  },

  signOut: function() {
    SC.Request.getUrl("/users/sign_out").json()
      .notify(this, 'didSignOut').send();
  },

  didSignOut: function(response) {
    window.location.reload();
  },

  onSignIn: function() {
    var projects = Todos.store.find(Todos.Project);
    Todos.projectsListController.set('content', projects);

    Todos.signInOverlayView.hide();
  }
});
