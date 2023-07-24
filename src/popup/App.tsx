import { Radio, Button, ColorPicker, message } from "antd";
import { useState, type PropsWithChildren, useEffect } from "react";
import presetColors, {
  type PresetKeys,
  type ColorsKeys,
} from "../share/presetColors";

const presets = Object.keys(presetColors) as Array<PresetKeys>;

function Label({ children }: PropsWithChildren) {
  return (
    <span style={{ width: 127, paddingRight: 8, textAlign: "right" }}>
      {children}:
    </span>
  );
}

function Item({ children }: PropsWithChildren) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "8px 0px",
      }}
    >
      {children}
    </div>
  );
}

export default function App() {
  const [messageApi, contextHolder] = message.useMessage();
  const [preset, setPreset] = useState(presets[0]);
  const [color, setColor] = useState(presetColors[preset]);

  useEffect(() => {
    chrome.storage.local.get().then(({ preset, color: _color }) => {
      preset && setPreset(preset);
      _color &&
        setColor({
          ...color,
          ..._color,
        });
    });
  }, []);

  function handlePresetChange(value: PresetKeys) {
    setPreset(value);
    setColor(presetColors[value]);
  }

  function handleColorChange(key: ColorsKeys, value: string) {
    setColor({
      ...color,
      [key]: value,
    });
  }

  function handleSave() {
    chrome.storage.local
      .set({
        preset,
        color,
      })
      .then(() => {
        messageApi.open({
          type: "success",
          content: "saved",
        });
      });
  }

  return (
    <div style={{ width: 450, height: 400 }}>
      {contextHolder}
      <h1 style={{ textAlign: "center", padding: "30px 0px 0px" }}>
        Github Contributions Colorful
      </h1>
      <Item>
        <Label>Preset</Label>
        <Radio.Group
          value={preset}
          onChange={(e) => handlePresetChange(e.target.value)}
        >
          {presets.map((item) => (
            <Radio value={item}>{item}</Radio>
          ))}
        </Radio.Group>
      </Item>
      {(Object.entries(color) as Array<[ColorsKeys, string]>).map(
        ([key, value]) => {
          return (
            <Item>
              <Label>{key.toUpperCase()}</Label>
              <ColorPicker
                showText
                value={value}
                arrow={false}
                style={{ marginLeft: 50 }}
                onChange={(value) => {
                  handleColorChange(key, value.toHexString());
                }}
              />
            </Item>
          );
        }
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: 24,
        }}
      >
        <Button style={{ padding: "0 50px" }} onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}
