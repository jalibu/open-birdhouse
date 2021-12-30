import React from "react";
import { FormGroup, Toggle, Select, SelectItem } from "carbon-components-react";
import { withTranslation } from "react-i18next";

const Controls = ({ t }: { t: any }) => (
  <FormGroup legendText={t("CONTROLS.TITLE")}>
    <Toggle
      id="toggle-outdoor-light"
      labelA={`${t("CONTROLS.OUTDOOR_LIGHT")}  ${t("CONTROLS.ON")}`}
      labelB={`${t("CONTROLS.OUTDOOR_LIGHT")}  ${t("CONTROLS.OFF")}`}
    />
    <Toggle
      id="toggle-indoor-light"
      labelA={`${t("CONTROLS.INDOOR_LIGHT")}  ${t("CONTROLS.ON")}`}
      labelB={`${t("CONTROLS.INDOOR_LIGHT")}  ${t("CONTROLS.OFF")}`}
    />
    <Select
      defaultValue="WHITE"
      helperText={t("CONTROLS.INDOOR_LIGHT_COLOR")}
      id="indoor-light-color-select"
      invalidText="A valid value is required"
      labelText=""
    >
      <SelectItem text={t("CONTROLS.COLORS.WHITE")} value="WHITE" />
      <SelectItem text={t("CONTROLS.COLORS.RED")} value="RED" />
      <SelectItem text={t("CONTROLS.COLORS.GREEN")} value="GREEN" />
      <SelectItem text={t("CONTROLS.COLORS.BLUE")} value="BLUE" />
      <SelectItem text={t("CONTROLS.COLORS.CYAN")} value="CYAN" />
      <SelectItem text={t("CONTROLS.COLORS.MAGENTA")} value="MAGENTA" />
    </Select>
  </FormGroup>
);

export default withTranslation()(Controls);
