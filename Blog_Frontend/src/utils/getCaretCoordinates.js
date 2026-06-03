const MIRROR_PROPERTIES = [
  "boxSizing", "width", "height", "overflowX", "overflowY",
  "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth",
  "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
  "fontStyle", "fontVariant", "fontWeight", "fontStretch", "fontSize",
  "fontSizeAdjust", "lineHeight", "fontFamily", "textAlign", "textTransform",
  "textIndent", "textDecoration", "letterSpacing", "wordSpacing", "wordBreak",
];

export const getCaretCoordinates = (element, position) => {
  const mirror = document.createElement("div");
  document.body.appendChild(mirror);

  const computed = window.getComputedStyle(element);
  mirror.style.position = "absolute";
  mirror.style.visibility = "hidden";
  mirror.style.top = "-9999px";
  mirror.style.left = "-9999px";
  mirror.style.whiteSpace = "pre-wrap";
  mirror.style.wordWrap = "break-word";

  MIRROR_PROPERTIES.forEach((prop) => {
    mirror.style[prop] = computed[prop];
  });

  mirror.textContent = element.value.substring(0, position);

  const span = document.createElement("span");
  span.textContent = "​";
  mirror.appendChild(span);

  const coordinates = {
    top: span.offsetTop + parseInt(computed.borderTopWidth),
    left: span.offsetLeft + parseInt(computed.borderLeftWidth),
  };

  document.body.removeChild(mirror);
  return coordinates;
};
