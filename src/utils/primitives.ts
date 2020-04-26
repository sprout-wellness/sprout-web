export function arraysEqual({
  array1,
  array2,
}: {
  array1: Array<{}>;
  array2: Array<{}>;
}) {
  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    return false;
  }
  if (array1.length !== array2.length) {
    return false;
  }
  const arr1 = array1.concat().sort();
  const arr2 = array2.concat().sort();
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}
