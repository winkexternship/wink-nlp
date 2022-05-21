//     wink-nlp
//
//     Copyright (C) GRAYPE Systems Private Limited
//
//     This file is part of “wink-nlp”.
//
//     Permission is hereby granted, free of charge, to any
//     person obtaining a copy of this software and
//     associated documentation files (the "Software"), to
//     deal in the Software without restriction, including
//     without limitation the rights to use, copy, modify,
//     merge, publish, distribute, sublicense, and/or sell
//     copies of the Software, and to permit persons to
//     whom the Software is furnished to do so, subject to
//     the following conditions:
//
//     The above copyright notice and this permission notice
//     shall be included in all copies or substantial
//     portions of the Software.
//
//     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
//     ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
//     TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
//     PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
//     THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
//     DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
//     CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
//     CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
//     DEALINGS IN THE SOFTWARE.

//

var chai = require( 'chai' );
var mocha = require( 'mocha' );
var winkNLP = require( '../src/wink-nlp.js' );
var its = require( '../src/its.js' );
var model = require( './test-model/model.js' );
var documents = require( './data/sample-docs.js' );

var expect = chai.expect;
var describe = mocha.describe;
var it = mocha.it;

describe( 'summarizer test', function () {
  var nlp = winkNLP( model );

  it( 'summary for default pipeline', function () {
    expect( nlp.readDoc( documents.a ).out( its.summary ) ).to.deep.equal( documents.summ_a );
    expect( nlp.readDoc( documents.b ).out( its.summary ) ).to.deep.equal( documents.summ_b );
    expect( nlp.readDoc( documents.c ).out( its.summary ) ).to.deep.equal( documents.summ_c );
    expect( nlp.readDoc( documents.d ).out( its.summary ) ).to.deep.equal( documents.summ_d );
    expect( nlp.readDoc( documents.e ).out( its.summary ) ).to.deep.equal( documents.summ_e );
    expect( nlp.readDoc( documents.f ).out( its.summary ) ).to.deep.equal( documents.summ_f );
    expect( nlp.readDoc( documents.g ).out( its.summary ) ).to.deep.equal( documents.summ_g );
    expect( nlp.readDoc( documents.h ).out( its.summary ) ).to.deep.equal( documents.summ_h );
    expect( nlp.readDoc( documents.i ).out( its.summary ) ).to.deep.equal( documents.summ_i );
    expect( nlp.readDoc( documents.j ).out( its.summary ) ).to.deep.equal( documents.summ_j );
    expect( nlp.readDoc( documents.k ).out( its.summary ) ).to.deep.equal( documents.summ_k );
    expect( nlp.readDoc( documents.l ).out( its.summary ) ).to.deep.equal( documents.summ_l );
    expect( nlp.readDoc( documents.m ).out( its.summary ) ).to.deep.equal( documents.summ_m );
    expect( nlp.readDoc( documents.n ).out( its.summary ) ).to.deep.equal( documents.summ_n );
    expect( nlp.readDoc( documents.o ).out( its.summary ) ).to.deep.equal( documents.summ_q );
    expect( nlp.readDoc( documents.p ).out( its.summary ) ).to.deep.equal( documents.summ_p );
    expect( nlp.readDoc( documents.q ).out( its.summary ) ).to.deep.equal( documents.summ_q );
  } );

  it( 'summary for pipeline without pos', function () {
    nlp = winkNLP( model, [ 'sbd' ] );
    expect( nlp.readDoc( documents.h ).out( its.summary ) ).to.deep.equal( documents.summ_np_h );

  } );

} );

