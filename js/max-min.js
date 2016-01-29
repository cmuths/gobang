var evaluate = require("./evaluate");
var gen = require("./gen");
var role = require("./role");
var SCORE = require("./score.js");
var win = require("./win.js");

var MAX = 9999999;
var MIN = -1*MAX;

/*
 * max min search
 * white is max, black is min
 */
var maxmin = function(board, deep) {
  var best = MIN;
  var points = gen(board);
  var bestPoints = [];
  deep = deep === undefined ? 3 : deep;

  points.forEach(function(p) {
    board[p[0]][p[1]] = role.com;
    var v = min(board, deep-1, MIN, MAX);

    //console.log(v, p);
    //如果跟之前的一个好，则把当前位子加入待选位子
    if(v == best) {
      bestPoints.push(p);
    }
    //找到一个更好的分，就把以前存的位子全部清除
    if(v > best) {
      best = v;
      bestPoints = [];
      bestPoints.push(p);
    }
    board[p[0]][p[1]] = role.empty;
  });
  var result = bestPoints[Math.floor(bestPoints.length * Math.random())];
  return result;
}

var min = function(board, deep, alpha, beta) {
  var v = evaluate(board);
  if(deep <= 0 || win(board) || alpha >= beta) {
    return v;
  }

  var best = MAX;
  var points = gen(board);

  points.forEach(function(p) {
    board[p[0]][p[1]] = role.hum;
    var v = max(board, deep-1, alpha, best < beta ? best : beta);
    if(v < best ) {
      best = v;
    }
    board[p[0]][p[1]] = role.empty;
  });
  return best ;
}


var max = function(board, deep, alpha, beta) {
  var v = evaluate(board);
  if(deep <= 0 || win(board) || alpha >= beta) {
    return v;
  }

  var best = MIN;
  var points = gen(board);

  points.forEach(function(p) {
    board[p[0]][p[1]] = role.com;
    var v = min(board, deep-1, best > alpha ? best : alpha, beta);
    if(v > best) {
      best = v;
    }
    board[p[0]][p[1]] = role.empty;
  });
  return best;
}

module.exports = maxmin;