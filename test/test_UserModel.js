
var UserController = require( "../controller/UserController" );

var userController = UserController();

// test getUserById

//userController.addUser('daniel', 'funky') ;
//userController.getUsers( function( err, result ) { if(err) console.log('error!'); else console.log(result[0].username); }  ) ;
//userController.getUserByUsername( 'devty1023@gmail.com', function( err, result) { if (err) console.log(err); else console.log(result); } ) ;
//userController.getUserByUsername( 'devty102@gmail.com', function( err, result) { if ( err | !result.length ) console.log('user not fonud'); else console.log(result); } ) ;


userController.removeUserTimestamp( "devty102", "1234",  function( err, result) { if ( err ) console.log(err); else console.log(result); } ) ;
userController.removeUserTimestamp( "lee832", "52af74143528965f0f000002",  function( err, result) { if ( err ) console.log(err); else console.log(result); } ) ;





// test is complete
console.log("TEST COMPLETE");
