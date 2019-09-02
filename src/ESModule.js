export let foo = 1;
setTimeout(() => {
  foo = 2;
}, 500);
console.log('esmodule 内部执行')
export default foo
