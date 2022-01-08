import React, {
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import { Tag, TooltipIcon } from "carbon-components-react";
import "./Gallery.scss";
import { withTranslation } from "react-i18next";
import ApiRequestService from "../../Services/ApiRequestService";
import StatusContext from "../../Context/StatusContext/StatusContext";
import { Video, VideoApiResponse } from "@open-birdhouse/common";
import { Translation } from "react-i18next";
import { Information16 } from "@carbon/icons-react";
import GalleryModal from "./GalleryModal";

const Gallery = ({ t }: { t: any }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalVideo, setModalVideo] = useState<Video>();
  const statusContext = useContext(StatusContext);
  const apiService = new ApiRequestService(statusContext);
  const [galery, setGalery] = useState<VideoApiResponse>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await apiService.getGalery();
      if (response) {
        setGalery(response);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  return galery && galery?.videos?.length > 0 ? (
    <section>
      <h6>
        {t("GALLERY.TITLE")}
        <Translation>
          {(t) => (
            <TooltipIcon tooltipText={`${t("GALLERY.TAGS")}`}>
              <Information16 />{" "}
            </TooltipIcon>
          )}
        </Translation>
      </h6>
      <div className="gallery-grid bx--grid">
        <div className="bx--row">
          {galery.videos.map((video) => (
            <GaleryEntry
              key={`gallery-entry-${video.id}`}
              uri={galery.uri}
              video={video}
              setIsModalOpen={setIsModalOpen}
              setModalVideo={setModalVideo}
            />
          ))}
        </div>
      </div>
      <GalleryModal
        uri={galery.uri}
        isOpened={isModalOpen}
        modalVideo={modalVideo}
        handleClose={(): void => {
          setIsModalOpen(false);
        }}
      />
    </section>
  ) : null;
};

const GaleryEntry = ({
  uri,
  video,
  setIsModalOpen,
  setModalVideo,
}: {
  uri: string;
  video: Video;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setModalVideo: Dispatch<SetStateAction<Video | undefined>>;
}) => {
  return (
    <div
      key={`wrap-${video.id}`}
      className="gallery-col bx--col-lg-4 bx--col-md-2 bx--col-sm-2"
    >
      <img
        key={`img-${video.id}`}
        className="gallery-image"
        src={`${uri}/${video.imageUrl}`}
        alt={video.imageUrl}
        onClick={() => {
          setIsModalOpen(true);
          setModalVideo(video);
        }}
      />
      {video.annotations && (
        <div className="gallery-tags">
          <span className="gallery-date">
            {(() => {
              const date = new Date(`${video.date}`);
              return date.toLocaleString();
            })()}
          </span>
          {video?.annotations?.map((annotation) => (
            <Tag key={`tag-${video.id}-${annotation.name}`} type="blue">
              {annotation.name}
            </Tag>
          ))}
        </div>
      )}
    </div>
  );
};

export default withTranslation()(Gallery);
