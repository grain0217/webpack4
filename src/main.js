var foo = require('./CommonJsModule');
console.log(foo.foo);
setTimeout(() => {
  console.log(foo.foo);
  console.log(require('./CommonJsModule').foo);
}, 1000);