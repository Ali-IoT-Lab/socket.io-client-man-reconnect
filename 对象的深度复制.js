const _default = {
  a: {
    aa: "aaa",
    bb:{
      "bbb":"bbbb"
    }
  },
  b: "bb"
};
let _shade = {};
const extend = require("extend");
let _result = extend(true,{},_default)
console.log("result  ",_result);
console.log("shade   ",_shade);
console.log("default ",_default);