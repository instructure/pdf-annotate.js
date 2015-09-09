export default function abstractFunction(name) {
  return function () {
    throw new Error(name + ' is not implemented');
  };
}
