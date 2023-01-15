//颜色格式转换
export function hexToHSL(hexColor) {
  let resultRgb = new Array(3).fill("");
  if (!/#/.test(hexColor)) {
    console.log(`不符合格式，已停止转换`);
    return;
  }
  let hexColors = hexColor.split(/#|/);
  let hexindex = "";
  let rgbIndex = 0;
  for (let index = 1; index < hexColors.length; index++) {
    hexindex += hexColors[index];
    if (index % 2 == 0) {
      resultRgb[rgbIndex] = parseInt("0x".concat(hexindex)) / 255.0;
      hexindex = "";
      rgbIndex++;
    }
  }
  return resultRgb;
}
export function hslToHex(h, s, l) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
