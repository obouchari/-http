// Using only http method
var http = $http({
	method: 'GET',
	url: 'http://pokeapi.co/api/v2/pokemon/1/',
	headers: {

	}
});

http.then(function(res) {
	console.log(res.status);
}, function(err) {
	console.log(err);
});

// Using Get
// var get = $http.get('http://website.com', {
// 	headers: {
// 		'Type': 'Using Get'
// 	}
// });
// console.log(get);

// Using Post


// Using Delete


// Using Put


// Using JSONP