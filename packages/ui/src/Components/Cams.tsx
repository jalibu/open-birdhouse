import React, { useEffect, useState } from "react";
import { Tabs, Tab, Loading } from "carbon-components-react";
import { withTranslation } from "react-i18next";
import ApiRequestService from "../Services/ApiRequestService";
import { Cam } from "@open-birdhouse/common";
import spinner from "../spinner.svg";
import { getByPlaceholderText } from "@testing-library/dom";

const apiService = new ApiRequestService();

const Cams = ({ t }: { t: any }) => {
  const [cams, setCams] = useState<Cam[]>([]);
  const [activeCam, setActiveCam] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiService.getCams();
      setCams(response);
      if (response.length > 0) {
        setActiveCam(0);
      }
    };
    fetchData();
  }, []);

  return cams.length > 0 ? (
    <Tabs
      onSelectionChange={(tabIndex) => {
        setActiveCam(tabIndex);
      }}
    >
      {cams.map((cam, camIndex) => (
        <Tab
          id={`tab-cam-${cam.id}`}
          key={`tab-cam-${cam.id}`}
          label={cam.name}
        >
            <img
              src={camIndex === activeCam ? cam.url : spinner}
              style={{ minHeight: "240px", maxHeight:"600px", background: 'url(placeholder.jpeg) no-repeat scroll 0 0' }}
              alt={cam.name}
            />
        </Tab>
      ))}
    </Tabs>
  ) : (
    <div>
      {t("CAMS.LOADING")}
      <Loading description={t("CAMS.LOADING")} withOverlay={false} />
    </div>
  );
};

export default withTranslation()(Cams);
