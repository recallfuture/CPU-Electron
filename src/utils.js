export function formatNum(num, bit = 10, length = 0) {
  let result;

  if (typeof num === "undefined") {
    // console.warn(`格式化失败：${num}`);
    result = "0";
  } else {
    result = num.toString(bit);
  }

  while (result.length < length) {
    result = "0" + result;
  }
  return result;
}
