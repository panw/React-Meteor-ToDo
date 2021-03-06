Tasks = new Mongo.Collection('tasks');

if (Meteor.isClient) {
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

  Meteor.subscribe('tasks');

  Meteor.startup(function () {
    React.render(<App />, document.getElementById('render-target'));
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.publish('tasks', function() {
      return Tasks.find();
    });
  });
}

Meteor.methods({
  addTask(text) {
    if(!Meteor.userId()) {
      throw new Meteor.Error('not authorized');
    }

    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },

  removeTask(taskId) {
    if(!Meteor.userId()) {
      throw new Meteor.Error('not authorized');
    }

    Tasks.remove(taskId);
  },

  setChecked(taskId, setChecked) {
    Tasks.update(taskId, {$set:{checked: setChecked}});
  }
});
