export interface Colors {
  l1: string;
  l2: string;
  l3: string;
  l4: string;
}

export type PresetKeys = "green" | "winter" | "halloween";

const presetColors: Record<PresetKeys, Colors> = {
  green: {
    l1: "#9be9a8",
    l2: "#40c463",
    l3: "#30a14e",
    l4: "#216e39",
  },
  winter: {
    l1: "#B6E3FF",
    l2: "#54AEFF",
    l3: "#0969DA",
    l4: "#0757b4",
  },
  halloween: {
    l1: "#ffee4a",
    l2: "#ffc501",
    l3: "#fe9600",
    l4: "#c37300",
  },
};

export default presetColors;
