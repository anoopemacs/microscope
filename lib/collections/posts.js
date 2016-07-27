Posts = new Meteor.Collection('posts'); // Posts is kind of like database api??

//// below is disabled because Meteor.methods bypasses this anyway
// Posts.allow({
//   insert: function(userId, doc) {
//     // only allow posting if you are logged in
//     return !! userId;		// not not gives truth value
//   }
// });

Posts.allow({
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); }
});
// ownsDocument is defined in /lib/permissions.js

Posts.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following 2 fields:
    return (_.without(fieldNames, 'url', 'title').length > 0);
  }
})

// Meteor.methods(methods)
// Defines functions that can be invoked over the network by clients.
Meteor.methods({
  postInsert: function(postAttributes) {
    check(Meteor.userId(), String);
    check(postAttributes, {
      title: String,
      url: String
    });

    var postWithSameLink = Posts.findOne({url: postAttributes.url});
    if (postWithSameLink) {
      return {
	postExists: true,
	_id: postWithSameLink._id
      }
    }
    
    var user = Meteor.user();
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });
    var postId = Posts.insert(post);
    return {
      _id: postId
    };
  }
});
