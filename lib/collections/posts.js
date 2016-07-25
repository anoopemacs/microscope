Posts = new Meteor.Collection('posts'); // Posts is kind of like database api??

//// below is disabled because Meteor.methods bypasses this anyway
// Posts.allow({
//   insert: function(userId, doc) {
//     // only allow posting if you are logged in
//     return !! userId;		// not not gives truth value
//   }
// });



// Meteor.methods(methods)
// Defines functions that can be invoked over the network by clients.
Meteor.methods({
  postInsert: function(postAttributes) {
    check(Meteor.userId(), String);
    check(postAttributes, {
      title: String,
      url: String
    });

    if (Meteor.isServer) {
      postAttributes.title += "(server)";
      // wait for 5 sec
      Meteor._sleepForMs(5000);
    }
    else {
      postAttributes.title += "(client)";
    }

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
