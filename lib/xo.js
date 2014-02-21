var _ = require('lodash');

(function () {
   "use strict";
}());

var XO = function (number) { 
  this.the_field = [null, null, null, null, null, null, null, null, null];
  this.pecking_order = _.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  this.the_player = 'X';
  this.the_opponent = 'O';
  this.memory = [];
};

XO.prototype.field = function() {
  return this.the_field;
};

XO.prototype.play = function(pos) {
  this.the_field[pos] = this.the_player;
};
XO.prototype.player = function(indicator) {
  this.the_player = indicator;
  if (this.the_player == 'O'){
    this.the_opponent = 'X';
  }
};
XO.prototype.move = function() {
  if (this.won_before()){
    var pos = this.prev_win_position();
    this.the_field[pos] = this.the_opponent;
    return pos;
  }

  // TODO: 
  // 4) look for any available moves

  for(var pos = 0; pos< this.the_field.length; pos++){
    var the_pos = this.pecking_order[pos];
    if (this.the_field[the_pos] === null) {
      if(this.lost(the_pos)){
        continue;
      }
      this.the_field[the_pos] = this.the_opponent;
      return the_pos;
    }
  }
  if (this.some_not_tried_before()){
    var pos = this.untried_position();
    this.the_field[pos] = this.the_opponent;
    return pos;
  }
  // for(var pos = 0; pos< this.the_field.length; pos++){
  //   var the_pos = this.pecking_order[pos];
  //   if (this.the_field[the_pos] === null) {
  //     this.the_field[the_pos] = this.the_opponent;
  //     return the_pos;
  //   }
  // }
};
XO.prototype.load_field = function(field_to_load) {
  this.the_field = field_to_load.split("");
  for(var pos in this.the_field){
    this.the_field[pos] = this.the_field[pos].trim();
    if(_.isEmpty(this.the_field[pos])){
      this.the_field[pos] = null;
    }
  }
};
XO.prototype.lost = function(position) {
  return _.some(this.memory, {field: this.field_string(), position: position, result: 'L'})
};
XO.prototype.won_before = function() {
  return _.some(this.memory, {field: this.field_string(), result: 'W'});
};
XO.prototype.tried_before = function(position) {
  return _.some(this.memory, {field: this.field_string(), position: position})
};

XO.prototype.untried_position = function() {
  for(var i = 0; i< this.the_field.length; i++){
    if(!_.isEmpty(this.the_field[i])){
      continue;
    }
    if(!this.tried_before(i)){
      return i;
    }
  }  
};
XO.prototype.some_not_tried_before = function() {
  if (this.untried_position){
    return true;
  }
  return false;
};

XO.prototype.prev_win_position = function() {
  // TODO: refactoring opportunity!
  for(var i = 0; i< this.memory.length; i++){
    var recollection = this.memory[i];
    if (recollection.field == this.field_string() && recollection.result == 'W'){
      return recollection.position;
    }
  }
};
XO.prototype.won = function(position) {
  return _.some(this.memory, {field: this.field_string(), position: position, result: 'W'})
};
XO.prototype.field_string = function() {
  return _.reduce(this.the_field, function(foo, pos) { return foo + (_.isEmpty(pos) ? ' ' : pos) });
};
XO.prototype.remember = function(field, position, result) {
  this.memory.push({field: field, position: position, result: result});
};

module.exports = XO;
