import presetColors, {
  type ColorsKeys,
  type Colors,
  type PresetKeys,
} from "../share/presetColors";
import {
  YEARLY_CONTRIBUTIONS_SELECT,
  USER_PROFILE_FRAME_SELECT,
  HIGHLIGHT_BLOB_SELECT,
} from "./domSelector";

function addListener(
  cbForHighlightBlob: (dom: Element | null) => void,
  cbForProgress: (dom: Element) => void
) {
  document.addEventListener("DOMContentLoaded", () => {
    const YEARLY_CONTRIBUTIONS_SELECT_NAME =
      YEARLY_CONTRIBUTIONS_SELECT.slice(1);

    const config = { childList: true, subtree: true };

    const callback: MutationCallback = (mutationList) => {
      for (const mutation of mutationList) {
        if (mutation.type === "childList") {
          for (const node of mutation.addedNodes) {
            if (!(node instanceof HTMLElement)) continue;
            const className = node.getAttribute("class");
            if (className?.includes(YEARLY_CONTRIBUTIONS_SELECT_NAME)) {
              cbForHighlightBlob(node.querySelector(HIGHLIGHT_BLOB_SELECT));
            }
            if (className?.includes("contribution-activity-listing")) {
              cbForProgress(node);
            }
            if (node.parentNode === domContainer) {
              cbForHighlightBlob(node.querySelector(HIGHLIGHT_BLOB_SELECT));
              cbForProgress(node);
            }
          }
        }
      }
    };

    const observer = new MutationObserver(callback);

    const domContainer = document.querySelector(USER_PROFILE_FRAME_SELECT);
    if (domContainer) {
      observer.observe(domContainer, config);
      cbForHighlightBlob(domContainer.querySelector(HIGHLIGHT_BLOB_SELECT));
      cbForProgress(domContainer);
    }
  });
}

function setCssVariableColor({ l1, l2, l3, l4 }: Colors) {
  const style = document.createElement("style");
  const styleText = `${USER_PROFILE_FRAME_SELECT} {--color-calendar-graph-day-L1-bg: ${l1};--color-calendar-graph-day-L2-bg: ${l2};--color-calendar-graph-day-L3-bg: ${l3};--color-calendar-graph-day-L4-bg: ${l4};}`;
  style.innerText = styleText;
  document.head.append(style);
}

function setColorForJsHighlightBlob(node: Element | null, color: string) {
  if (!node) return;
  node.setAttribute("fill", color);
  node.setAttribute("stroke", color);
}

function setColorForActivity(node: Element, colors: Colors) {
  for (const progressNode of node.querySelectorAll(".Progress-item")) {
    if (progressNode instanceof HTMLElement) {
      const bgColor = progressNode.style.backgroundColor;
      const hexColor = rgbToHex(bgColor);
      if (hexColor) {
        const mapColors = presetColors.green;
        let key: ColorsKeys | undefined;
        for (const [_key, value] of Object.entries(mapColors) as Array<
          [ColorsKeys, string]
        >) {
          if (value === hexColor) {
            key = _key;
          }
        }
        if (key) {
          progressNode.style.backgroundColor = colors[key];
        }
      }
    }
  }
}

function rgbToHex(rgb: string) {
  const matches = rgb.match(/\d+/g);
  if (!matches) {
    return false;
  }
  return "#" + matches.map((x) => (+x).toString(16).padStart(2, "0")).join("");
}

function init(preset: PresetKeys = "green", color: Colors | undefined) {
  let _color = presetColors[preset] || presetColors.green;
  if (color) {
    _color = {
      ..._color,
      ...color,
    };
  }
  const { l1 } = _color;
  setCssVariableColor(_color);
  setColorForJsHighlightBlob(document.querySelector(HIGHLIGHT_BLOB_SELECT), l1);
  addListener(
    (dom) => setColorForJsHighlightBlob(dom, l1),
    (dom) => setColorForActivity(dom, _color)
  );
}

chrome.storage.local.get().then(({ preset, color }) => {
  init(preset, color);
});
