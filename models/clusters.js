var mongoose = require('mongoose');

// Consumer Scema
var Clusters_scema = mongoose.Schema({
	name: "",
	users_ids: []	

});

var Clusters = module.exports = mongoose.model('clusters', Clusters_scema);

module.exports.refresh_clusters = function(newClusters, callback){

	Clusters.remove({},function(err, doc){
		newClusters.save(newClusters,function(err, doc){

		});
	});

}
module.exports.add_to_culsters = function( clustObj, newClusters, callback ){

	clustObj.find({ name: newClusters.name }, function(err, doc){
		if(doc && doc.users_ids){
			doc.users_ids.push(newClusters._id);
			clustObj.update({name: newClusters.name }, 
				{ 
					$set: 
						{ 
							users_ids:doc.users_ids
						}
				}, 
		    function(err, doc){

			});
		}else{

			clustObj.save({ name: newClusters.name, users_ids: [ newClusters._id ] }, function(){
				
			});

		}
	});


}

