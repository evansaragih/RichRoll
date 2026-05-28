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
function rnd(M) {
  return M.map(row => row.map(x => Math.abs(x) < 1e-10 ? 0 : parseFloat(x.toFixed(4))));
}

const M_board = mul(Rx(55), Rz(-45));
const M_child1 = mul(Rz(45), Rx(-55));
const M_total1 = mul(M_board, M_child1);
const M_child2 = mul(Rx(-55), Rz(45));
const M_total2 = mul(M_board, M_child2);

console.log("Total 1 (rotateZ(45) rotateX(-55)):");
console.log(rnd(M_total1));

console.log("Total 2 (rotateX(-55) rotateZ(45)):");
console.log(rnd(M_total2));

