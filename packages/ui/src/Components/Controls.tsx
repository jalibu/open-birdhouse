import React, { useContext, useEffect, useState } from "react";
import {
  Toggle,
  Select,
  SelectItem,
  SelectSkeleton,
  ToggleSmallSkeleton,
} from "carbon-components-react";
import { withTranslation } from "react-i18next";
import ApiRequestService from "../Services/ApiRequestService";
import {
  GenericControl,
  RgbLedControl,
  SwitchControl,
} from "@open-birdhouse/common";
import StatusContext from "../Context/StatusContext/StatusContext";

const Controls = ({ t }: { t: any }) => {
  const [controls, setControls] = useState<GenericControl[]>();

  const statusContext = useContext(StatusContext);
  const apiService = new ApiRequestService(statusContext);

  const postControls = async (controls: GenericControl[]) => {
    apiService.setControls(controls);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiService.getControls();
      if (response) {
        setControls(response);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return controls ? (
    <section>
      <h6>{t("CONTROLS.TITLE")}</h6>
      {controls.map((control) => {
        if (control.type === "SWITCH") {
          const switchControl = control as SwitchControl;
          return (
            <Toggle
              id={`toggle-${switchControl.id}`}
              key={`toggle-${switchControl.id}`}
              toggled={switchControl.isOn}
              labelA={`${switchControl.name}  ${t("CONTROLS.OFF")}`}
              labelB={`${switchControl.name}   ${t("CONTROLS.ON")}`}
              onToggle={(toggled) => {
                switchControl.isOn = toggled;
                const newControls = [...controls];
                setControls(newControls);
                postControls(newControls);
              }}
            />
          );
        } else if (control.type === "RGB_LED") {
          const rgbLedControl = control as RgbLedControl;
          return (
            <div key={`div-${rgbLedControl.id}`}>
              <Toggle
                id={`toggle-${rgbLedControl.id}`}
                key={`toggle-${rgbLedControl.id}`}
                toggled={rgbLedControl.isOn}
                labelA={`${rgbLedControl.name}  ${t("CONTROLS.OFF")}`}
                labelB={`${rgbLedControl.name}  ${t("CONTROLS.ON")}`}
                onToggle={(toggled) => {
                  rgbLedControl.isOn = toggled;
                  const newControls = [...controls];
                  setControls(newControls);
                  postControls(newControls);
                }}
              />
              <Select
                id={`select-${rgbLedControl.id}`}
                value={rgbLedControl.color}
                helperText={t("CONTROLS.ROOM_LIGHT_COLOR")}
                key={`select-${rgbLedControl.id}`}
                invalidText="A valid value is required"
                labelText=""
                onChange={(evt) => {
                  rgbLedControl.color = evt.currentTarget.value;
                  const newControls = [...controls];

                  setControls(newControls);
                  postControls(newControls);
                }}
              >
                <SelectItem text={t("CONTROLS.COLORS.WHITE")} value="WHITE" />
                <SelectItem text={t("CONTROLS.COLORS.RED")} value="RED" />
                <SelectItem text={t("CONTROLS.COLORS.GREEN")} value="GREEN" />
                <SelectItem text={t("CONTROLS.COLORS.BLUE")} value="BLUE" />
                <SelectItem text={t("CONTROLS.COLORS.CYAN")} value="CYAN" />
                <SelectItem
                  text={t("CONTROLS.COLORS.MAGENTA")}
                  value="MAGENTA"
                />
              </Select>
            </div>
          );
        } else {
          return null;
        }
      })}
    </section>
  ) : (
    <section>
      <h6>{t("CONTROLS.TITLE")}</h6>
      <ToggleSmallSkeleton />
      <ToggleSmallSkeleton />
      <ToggleSmallSkeleton />
      <SelectSkeleton />
    </section>
  );
};

export default withTranslation()(Controls);
