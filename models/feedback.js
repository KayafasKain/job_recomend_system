var mongoose = require('mongoose');

// feedback_scema
var feedback_scema = mongoose.Schema({
	like: {
		type: Number
	}
});

var feedback = module.exports = mongoose.model('feedback', feedback_scema);

// module.exports.refresh_clusters = function(newClusters, callback){

// 	Clusters.remove({},function(err, doc){
// 		newClusters.save(newClusters,function(err, doc){

// 		});
// 	});

// }
module.exports.add_feedback = function( obj, callback ){
	console.log(obj);
	obj.save( obj, function(err,doc){
		console.log(err);
		console.log("doc");
		callback();
	});

}

