import funcA from "./funcA";

const resultObj = {
  funcA,
  funcB
}

require.ensure(
  [],
  function () {
    const funcB = require("./funcB.js");
    resultObj.funcB = funcB.default
  },
  "funcB"
);

export default resultObj
