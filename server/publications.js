Meteor.publish('posts', function() {
  return Posts.find(); 		// return a cursor to the Posts
});
