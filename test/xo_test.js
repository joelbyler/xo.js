require('should');
var assert = require('assert');
var _ = require('lodash');
var XO = require(__dirname + '/../lib/xo');

describe('XO', function() {
  describe('field', function() {
    var xo;
    beforeEach(function(){
      xo = new XO();
    });
    it('has a 9 position field', function() {
      xo.field().length.should.equal(9);
    });
    it('lets me play a move on the field', function() {
      xo.play(0);
      xo.field()[0].should.not.equal(null);
    });
    it('lets me play an X', function() {
      xo.player('X');
      xo.play(0);
      xo.field()[0].should.equal('X');
    });
    it('lets me play an O', function() {
      xo.player('O');
      xo.play(0);
      xo.field()[0].should.equal('O');
    });
  });
  describe('move', function () {
    var xo;
    beforeEach(function(){
      xo = new XO();
    });
    it('uses first position with no experience', function() {
      xo.move();
      _.contains(xo.field(),'O').should.be.true;
    });
    it('keeps player and opponent indicators separate', function() {
      xo.player('O');
      xo.move();
      _.contains(xo.field(),'X').should.be.true;
    });
    it('uses next position with no experience when first is taken', function() {
      xo.play(0);
      xo.move();
      _.contains(xo.field(),'O').should.be.true;
    });
    it('moves using only open spaces', function() {
      xo.load_field('XXXXXXXX ');
      xo.move();
      assert.deepEqual(xo.field(),['X','X','X','X','X','X','X','X','O']);
    });
  });
  describe('play', function () {
    var xo;
    beforeEach(function(){
      xo = new XO();
    });
    it('plays a different postion each time', function() {
      xo.move();
      var xo2 = new XO();
      xo2.move();
      assert.notDeepEqual(xo.field(),xo2.field());
    });
    context('losing history', function() {
      beforeEach(function(){
        xo.remember('O  X X   ', 1, 'L');
        xo.load_field('O  X X   ');
      });
      it('knows how it lost last time', function() {
        xo.lost(1).should.be.true;
      });
      it('knows not to make the same mistake', function() {
        xo.move().should.not.equal(1);
      });
      it('knows to try something new', function() {
        xo.remember('O  X X   ', 1, 'L');
        xo.remember('O  X X   ', 2, 'L');
        xo.remember('O  X X   ', 4, 'L');
        xo.remember('O  X X   ', 6, 'L');
        xo.remember('O  X X   ', 7, 'L');
        xo.move().should.equal(8);
      });
    })
    context('winning history', function() {
      beforeEach(function(){
        xo.remember('O  X X  O', 4, 'W');
        xo.load_field('O  X X  O');
      });
      it('knows how it won last time', function() {
        xo.won(4).should.be.true;
      });
      it('knows how to win again', function() {
        xo.move().should.equal(4);
      });
      // it('even knows when pattern is reversed!', function() {
      //   xo.load_field('  OX XO  ');
      //   xo.move().should.equal(4);
      // })
    })
    context('recognizes a pattern', function() {
      it('can find the vertical mirror of a field', function() {
        xo.vert_mirror('ABCDEFGHI').should.equal('CBAFEDIHG');
      });
      it('can find the horizontal mirror of a field', function() {
        xo.horz_mirror('ABCDEFGHI').should.equal('GHIDEFABC');
      });
      it('can rotate the field 90 degrees', function() {
        xo.rotate_90('ABCDEFGHI').should.equal('GDAHEBIFC');
      });
      it('can rotate the field 180 degrees', function() {
        xo.rotate_180('ABCDEFGHI').should.equal('IHGFEDCBA');
      });
      it('can rotate the field 270 degrees', function() {
        xo.rotate_270('ABCDEFGHI').should.equal('CFIBEHADG');
      });
      it('knows a position mirrored vertically', function() {
        xo.position_vert_mirror(0).should.equal(2);
      });
      it('knows a position mirrored horizontally', function() {
        xo.position_horz_mirror(0).should.equal(6);
      });
      it('knows a position rotated 90', function() {
        xo.position_rotate_90(0).should.equal(6);
      });
      it('knows a position rotated 180', function() {
        xo.position_rotate_180(0).should.equal(8);
      });
      it('knows a position rotated 270', function() {
        xo.position_rotate_270(0).should.equal(2);
      });
    });
  });
});

