const { JSDOM } = require('jsdom');
// Actually JSDOM doesn't compute layout. Let me just use pure math!

const deg2rad = Math.PI / 180;
function Rz(a) {
  const c = Math.cos(a * deg2rad), s = Math.sin(a * deg2rad);
  return [[c, -s, 0], [s, c, 0], [0, 0, 1]];
}
function Rx(a) {
  const c = Math.cos(a * deg2rad), s = Math.sin(a * deg2rad);
  return [[1, 0, 0], [0, c, -s], [0, s, c]];
}
function mul(A, B) {
  const C = [[0,0,0],[0,0,0],[0,0,0]];
  for(let i=0; i<3; i++)
    for(let j=0; j<3; j++)
      for(let k=0; k<3; k++)
        C[i][j] += A[i][k] * B[k][j];
  return C;
}
function apply(M, v) {
  return [
    M[0][0]*v[0] + M[0][1]*v[1] + M[0][2]*v[2],
    M[1][0]*v[0] + M[1][1]*v[1] + M[1][2]*v[2],
    M[2][0]*v[0] + M[2][1]*v[1] + M[2][2]*v[2]
  ];
}

// CSS applies right-to-left. 
// Board: rotateX(55) rotateZ(-45) means Rz applied first to local, then Rx.
const M_board = mul(Rx(55), Rz(-45));

// Option 1: rotateZ(45) rotateX(-55) means Rx(-55) applied first, then Rz(45).
const M_child1 = mul(Rz(45), Rx(-55));
const M_total1 = mul(M_board, M_child1);

// Option 2: rotateX(-55) rotateZ(45) means Rz(45) applied first, then Rx(-55).
const M_child2 = mul(Rx(-55), Rz(45));
const M_total2 = mul(M_board, M_child2);

console.log("Total 1 (rotateZ(45) rotateX(-55)):");
console.log(M_total1);

console.log("Total 2 (rotateX(-55) rotateZ(45)):");
console.log(M_total2);

