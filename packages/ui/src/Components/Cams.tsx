import React, { useContext, useEffect, useState } from "react";
import { Tabs, Tab, Loading } from "carbon-components-react";
import { withTranslation } from "react-i18next";
import ApiRequestService from "../Services/ApiRequestService";
import { Cam } from "@open-birdhouse/common";
import spinner from "../spinner.svg";
import StatusContext from "../Context/StatusContext/StatusContext";


const Cams = ({ t }: { t: any }) => {
  const [cams, setCams] = useState<Cam[]>([]);
  const [activeCam, setActiveCam] = useState<number>(0);
  
  const statusContext = useContext(StatusContext)
  const apiService = new ApiRequestService(statusContext);

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
            style={{
              minHeight: "240px",
              maxHeight: "600px",
              maxWidth: "100%",
              background: "url(placeholder.jpeg) no-repeat scroll 0 0",
            }}
            alt={cam.name}
          />
        </Tab>
      ))}
    </Tabs>
  ) : (
    <div>
      <Loading withOverlay={false} />
      {`${t("LOADING")} ${t("CAMERAS.TITLE")}...`}
    </div>
  );
};

export default withTranslation()(Cams);
