import React, { useState, useEffect, useContext } from "react";
import { TooltipIcon } from "carbon-components-react";
import { withTranslation } from "react-i18next";
import ApiRequestService from "../../Services/ApiRequestService";
import StatusContext from "../../Context/StatusContext/StatusContext";
import {
  Cloud20,
  Cloudy20,
  Fog20,
  MixedRainHail20,
  PartlyCloudy20,
  Rain20,
  RainHeavy20,
  Snow20,
  Sun20,
} from "@carbon/icons-react";

const Weather = ({ t }: { t: any }) => {
  const statusContext = useContext(StatusContext);
  const apiService = new ApiRequestService(statusContext);
  const [weather, setWeather] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiService.getWeather();
      if (response) {
        setWeather(response);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const weatherIcon = (icon: any) => {
    const symbol = icon.raw.slice(0, -1);
    switch (symbol) {
      case "01":
        return <Sun20 />;
      case "02":
        return <PartlyCloudy20 />;
      case "03":
        return <Cloudy20 />;
      case "04":
        return <Cloud20 />;
      case "09":
        return <RainHeavy20 />;
      case "10":
        return <Rain20 />;
      case "11":
        return <MixedRainHail20 />;
      case "13":
        return <Snow20 />;
      case "50":
        return <Fog20 />;
      default:
        return <Sun20 />;
    }
  };

  return weather ? (
    <TooltipIcon
      tooltipText={weather.weather.description}
      className="bx--header__action weather-header-action"
    >
      {weatherIcon(weather.weather.icon)}
      <span className="weather-header-current">
        {weather.weather.temp.cur.toFixed(0)}°C
      </span>
    </TooltipIcon>
  ) : null;
};

export default withTranslation()(Weather);
