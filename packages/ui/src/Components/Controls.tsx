import React, { useContext, useEffect, useState } from "react";
import {
  FormGroup,
  Toggle,
  Select,
  SelectItem,
  Loading,
} from "carbon-components-react";
import { withTranslation } from "react-i18next";
import ApiRequestService from "../Services/ApiRequestService";
import { ControlsStatus } from "@open-birdhouse/common";
import StatusContext from "../Context/StatusContext/StatusContext";

const Controls = ({ t }: { t: any }) => {
  const [controls, setControls] = useState<ControlsStatus>();

  const statusContext = useContext(StatusContext);
  const apiService = new ApiRequestService(statusContext);

  const postControls = async (controls: ControlsStatus) => {
    apiService.setControls(controls);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiService.getControls();
      setControls(response);
    };
    fetchData();
  }, []);

  return controls ? (
    <FormGroup legendText={t("CONTROLS.TITLE")}>
      <Toggle
        id="toggle-outdoor-light"
        toggled={controls.outdoorLightOn}
        labelA={`${t("CONTROLS.OUTDOOR_LIGHT")}  ${t("CONTROLS.OFF")}`}
        labelB={`${t("CONTROLS.OUTDOOR_LIGHT")}  ${t("CONTROLS.ON")}`}
        onToggle={(toggled) => {
          const newControls = {
            ...controls,
            outdoorLightOn: toggled,
          };
          setControls(newControls);
          postControls(newControls);
        }}
      />
      <Toggle
        id="toggle-nightvision"
        toggled={controls.nightVisionOn}
        labelA={`${t("CONTROLS.NIGHTVISION")}  ${t("CONTROLS.OFF")}`}
        labelB={`${t("CONTROLS.NIGHTVISION")}  ${t("CONTROLS.ON")}`}
        onToggle={(toggled) => {
          const newControls = {
            ...controls,
            nightVisionOn: toggled,
          };
          setControls(newControls);
          postControls(newControls);
        }}
      />
      <Toggle
        id="toggle-room-light"
        toggled={controls.roomLightOn}
        labelA={`${t("CONTROLS.ROOM_LIGHT")}  ${t("CONTROLS.OFF")}`}
        labelB={`${t("CONTROLS.ROOM_LIGHT")}  ${t("CONTROLS.ON")}`}
        onToggle={(toggled) => {
          const newControls = {
            ...controls,
            roomLightOn: toggled,
          };
          setControls(newControls);
          postControls(newControls);
        }}
      />
      <Select
        value={controls.roomLightColor}
        helperText={t("CONTROLS.ROOM_LIGHT_COLOR")}
        id="room-light-color-select"
        invalidText="A valid value is required"
        labelText=""
        onChange={(evt) => {
          const newControls = {
            ...controls,
            roomLightColor: evt.currentTarget.value,
          };

          setControls(newControls);
          postControls(newControls);
        }}
      >
        <SelectItem text={t("CONTROLS.COLORS.WHITE")} value="WHITE" />
        <SelectItem text={t("CONTROLS.COLORS.RED")} value="RED" />
        <SelectItem text={t("CONTROLS.COLORS.GREEN")} value="GREEN" />
        <SelectItem text={t("CONTROLS.COLORS.BLUE")} value="BLUE" />
        <SelectItem text={t("CONTROLS.COLORS.CYAN")} value="CYAN" />
        <SelectItem text={t("CONTROLS.COLORS.MAGENTA")} value="MAGENTA" />
      </Select>
    </FormGroup>
  ) : (
    <div>
      <Loading withOverlay={false} />
      {`${t("LOADING")} ${t("CONTROLS.TITLE")}...`}
    </div>
  );
};

export default withTranslation()(Controls);
