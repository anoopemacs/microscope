// anoop: meteor uses CSS classes to identify things
Template.postEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    var currentPostId = this._id;
    var postProperties = {
      url: document.getElementById("url").value,
      title: document.getElementById("title").value
    }
    Posts.update(currentPostId, {$set: postProperties}, function(error) {
      // $set can be found in mongo db docs
      if (error) {
	// display the error to the user
	alert(error.reason);
      }
      else {
	Router.go('postPage', {_id: currentPostId});
      }
    })
  },
  'click .delete': function(e) {
    e.preventDefault();
    if (confirm("Delete this post?")) {
      var currentPostId = this._id;
      Posts.remove(currentPostId);
      Router.go('postsList');
    }
  }
})
