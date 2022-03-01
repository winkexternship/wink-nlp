var winkNLP = require( './src/wink-nlp.js' );
// var its = require( '../src/its.js' );
// var as = require( '../src/as.js' );
var model = require( './test/test-model/model.js' );
var nlp = winkNLP( model );
var text = 'I have been running. I ran a lot. This is a parking lot.';
var doc = nlp.readDoc(text);
console.log(doc.out());
