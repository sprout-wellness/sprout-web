export function arraysEqual(_array1: Array<{}>, _array2: Array<{}>) {
  if (!Array.isArray(_array1) || !Array.isArray(_array2)) {
    return false;
  }
  if (_array1.length !== _array2.length) {
    return false;
  }
  const arr1 = _array1.concat().sort();
  const arr2 = _array2.concat().sort();
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}
