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


function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function hslToHex(h, s, l) {
  return rgbToHex(h*255, s*255, l*255);
  
}
