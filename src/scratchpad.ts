for (let radix = 2; radix <= 36; ++radix)
  for (
    let i = 1;
    i < Number.MAX_SAFE_INTEGER;
    i = Math.ceil(i * (1 + Math.random()))
  )
    console.assert(
      i.toString(radix) === toString(i, radix),
      JSON.stringify(
        {
          "                 i": i,
          " i.toString(radix)": i.toString(radix),
          "toString(i, radix)": toString(i, radix),
        },
        null,
        2
      )
    );

export function toString(number: number, radix: number) {
  const charByIndex = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  let result = "";
  while (number >= 1) {
    result = charByIndex[number % radix] + result;
    // eslint-disable-next-line no-param-reassign
    number = Math.floor(number / radix);
  }
  return result;
}
