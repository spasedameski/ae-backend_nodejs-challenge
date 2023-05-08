function transformObject(inputObj) {
  if (typeof inputObj === "number") {
    return inputObj + 1;
  }

  if (typeof inputObj === "string") {
    return `${inputObj} AE`;
  }

  if (Array.isArray(inputObj)) {
    return inputObj.map(transformObject);
  }

  if (typeof inputObj === "object" && inputObj !== null) {
    const newObj = {};

    for (const [key, value] of Object.entries(inputObj)) {
      newObj[key] = transformObject(value);
    }

    return newObj;
  }

  return inputObj;
}

const input = {
  a: 123,
  b: "abc",
  c: [1, 2, 3],
  d: {
    e: [4, 5, 6],
  },
};

const output = transformObject(input);

console.log(output);
