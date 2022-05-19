var allowed = require( './allowed.js' );
var its = require( '../src/its.js' );

var privateBM25 = require( './private-bm25-vectorizer.js' );

const bm25Vectorizer = function ( config ) {
    return privateBM25( config, its, allowed);
};

module.exports = bm25Vectorizer;