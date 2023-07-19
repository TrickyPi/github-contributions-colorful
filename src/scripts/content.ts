import presetColors, {
  type Colors,
  type PresetKeys,
} from "../share/presetColors";
import {
  YEARLY_CONTRIBUTIONS_SELECT,
  USER_PROFILE_FRAME_SELECT,
  HIGHLIGHT_BLOB_SELECT,
} from "./domSelector";

function addListener(cb: (dom: Element | null) => void) {
  const YEARLY_CONTRIBUTIONS_SELECT_NAME = YEARLY_CONTRIBUTIONS_SELECT.slice(1);

  const config = { childList: true, subtree: true };

  const callback: MutationCallback = (mutationList) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        for (const node of mutation.addedNodes) {
          if (
            node instanceof HTMLElement &&
            node.getAttribute("class") === YEARLY_CONTRIBUTIONS_SELECT_NAME
          ) {
            cb(node.querySelector(HIGHLIGHT_BLOB_SELECT));
          }
        }
      }
    }
  };

  const observer = new MutationObserver(callback);

  const domContainer = document.querySelector(USER_PROFILE_FRAME_SELECT);
  domContainer && observer.observe(domContainer, config);
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
  addListener((dom: Element | null) => setColorForJsHighlightBlob(dom, l1));
}

chrome.storage.local.get().then(({ preset, color }) => {
  init(preset, color);
});
