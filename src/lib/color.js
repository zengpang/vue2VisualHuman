//颜色格式转换
export function hexToRGB(hexColor) {
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

function componentToHex(c) {
  let hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex(r, g, b) {
  r*=255;
  g*=255;
  b*=255;
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


