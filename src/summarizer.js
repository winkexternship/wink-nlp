var BM25Vectorizer = require('../utilities/private-bm25-vectorizer.js');
var simmilarity = require('../utilities/similarity');
var constants = require( './constants.js' );
var tkSize = constants.tkSize;
var bits4lemma = constants.bits4lemma;
var posMask = constants.posMask;

const nonBowPreProcessing = function ( rdd ) {

    // required information
    const numOfSentences = rdd.sentences.length;
    const sentences = rdd.sentences;
    const tokens = rdd.tokens;
    const cache = rdd.cache;
    const currPipe = rdd.currPipe;
    const aptTokens = [];
    const paraStarts = [ 0 ];
    const aptPOS =  [ 'ADJ', 'ADV', 'NOUN', 'PROPN', 'VERB' ];

    // generation of aptTokens
    const para = [];
    for ( let i = 0; i < numOfSentences; i += 1 ) {
      const sen = [];
      for ( let j = sentences[i][0]; j <= sentences[i][1]; j += 1 ) {
        const normalizedToken = tokens[ ( j * tkSize ) + 1 ] > 65535 ? cache.value( cache.nox( tokens[ ( j * tkSize ) + 1 ] ) ) : cache.value( cache.normal( tokens[ j * tkSize ] ) );
        if ( cache.property( tokens[ j * tkSize ], 'tokenType' ) === 'word' && !cache.property( normalizedToken, 'isStopWord' ) ) {
          if ( currPipe.pos === false ) {
            sen.push( normalizedToken );
          } else if ( aptPOS.includes( cache.valueOf( 'pos', ( tokens[ ( j * tkSize ) + 2 ] & posMask ) >>> bits4lemma ) ) ) {
            sen.push( normalizedToken );
          }
        }
      }
      para.push(sen);
    }
    aptTokens.push(para);
    const textInfo = { aptTokens: aptTokens, paraStarts: paraStarts };
    return textInfo;

};

const bm25Bow = function ( aptTokens ) {

    // variables
    const numOfParagraphs = aptTokens.length;
    const bow = [];

    for ( let i = 0; i < numOfParagraphs; i += 1 ) {
      const bm25 = BM25Vectorizer();
      aptTokens[i].forEach( (colToken) => bm25.learn(colToken) );
      const para = [];
      for ( let j = 0; j < aptTokens[i].length; j += 1 ) {
        para.push(bm25.doc(j).bow());
      }
      bow.push(para);
    }

    return bow;

};

const createGraphCosine = function ( paraBow ) {

    const numOfSentences = paraBow.length;
    const senGraph = new Array(numOfSentences);

    for ( let i = 0; i < numOfSentences; i += 1) {
      senGraph[i] = new Array(numOfSentences);
    }

    for ( let i = 0; i < numOfSentences; i += 1) {
      senGraph[i][i] = 0;
        for ( let j = i + 1; j < numOfSentences; j += 1) {
          senGraph[i][j] = simmilarity.bow.cosine(paraBow[i], paraBow[j]);
          if ( !Number.isFinite(senGraph[i][j] )  )
            senGraph[i][j] = 0;
          senGraph[j][i] = senGraph[i][j];
        }
    }
    return senGraph;

};

const pagerankWithWeights = function ( paraSenGraph ) {

    const numOfSentences = paraSenGraph.length;
    const colSum = [];
    const weights = [];
    const maxIteration = 100;
    const dampingFactor = 0.85;
    const convergenceThreshold =  0.0001;
    let numOfConvergence = 0;

    for ( let i = 0; i < numOfSentences; i += 1) {
      colSum[i] = paraSenGraph[i].reduce((previousValue, currentValue) =>  previousValue + currentValue ,0);
    }

    for ( let i = 0; i < numOfSentences; i += 1) {
      weights.push({ idx: i, val: 1 / numOfSentences });
    }

    for ( let i = 0; i < maxIteration; i += 1) {
      for ( let j = 0; j < numOfSentences; j += 1) {
        let rank = 1 - dampingFactor;
        rank += dampingFactor * paraSenGraph[j].reduce((previousValue, currentValue, idx) => previousValue + ((currentValue / colSum[idx]) * weights[idx].val) ,0);
        if ( Math.abs(weights[j] - rank) <= convergenceThreshold ) {
          numOfConvergence += 1;
        }
        weights[j].val = rank;
      }
      if ( numOfConvergence === numOfSentences ) {
        break;
      }
    }
    weights.sort( (a, b) => b.val - a.val );
    return weights;
};

const summarizer = function ( rdd ) {

    const weights = [];
    const summaryInfo = {};

    const textInfo = nonBowPreProcessing( rdd );
    const bow = bm25Bow( textInfo.aptTokens );
    for ( let i = 0; i < textInfo.aptTokens.length; i += 1 ) {
        weights.push( pagerankWithWeights( createGraphCosine( bow[i], simmilarity ) ) );
    }
    summaryInfo.weights = weights;
    summaryInfo.paraStarts = textInfo.paraStarts;

    return summaryInfo;

};

module.exports = summarizer;
