import React, {
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
  useRef,
} from "react";
import { Column, Grid, Pagination, Row, Tag } from "carbon-components-react";
import "./Gallery.scss";
import { withTranslation } from "react-i18next";
import ApiRequestService from "../../Services/ApiRequestService";
import StatusContext from "../../Context/StatusContext/StatusContext";
import { Video, VideoApiResponse } from "@open-birdhouse/common";
import { Translation } from "react-i18next";
import GalleryModal from "./GalleryModal";
import { Minimize16 } from "@carbon/icons-react";

const Gallery = ({ t }: { t: any }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalVideo, setModalVideo] = useState<Video>();
  const statusContext = useContext(StatusContext);
  const apiService = new ApiRequestService(statusContext);
  const [gallery, setGalery] = useState<VideoApiResponse>();
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const gallerySectionRef = useRef<HTMLHeadingElement>(null);

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

  return gallery && gallery?.videos?.length > 0 ? (
    <section ref={gallerySectionRef}>
      <Translation>
        {(t) => (
          <>
            <h6>{t("GALLERY.TITLE")}</h6>
          </>
        )}
      </Translation>
      <Grid className="gallery-grid">
        <Row>
          {gallery.videos
            .slice((page - 1) * pageSize, page * pageSize)
            .map((video) => (
              <GaleryEntry
                key={`gallery-entry-${video.id}-${video.filesize}`}
                uri={gallery.uri}
                video={video}
                setIsModalOpen={setIsModalOpen}
                setModalVideo={setModalVideo}
              />
            ))}
        </Row>
      </Grid>
      <Pagination
        backwardText={t("GALLERY.PAGINATION.BACKWARD")}
        forwardText={t("GALLERY.PAGINATION.FORWARD")}
        itemsPerPageText={t("GALLERY.PAGINATION.ITEMS")}
        page={1}
        onChange={({ page, pageSize }) => {
          gallerySectionRef.current?.scrollIntoView({
            behavior: "smooth"
          });
          setPage(page);
          setPageSize(pageSize);
        }}
        pageNumberText={t("GALLERY.PAGINATION.PAGE_NUMBER")}
        pageSize={12}
        pageSizes={[12, 24, 36]}
        totalItems={gallery.videos.length}
      />
      <GalleryModal
        uri={gallery.uri}
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
    <Column
      className="gallery-entry"
      sm={2}
      md={4}
      lg={4}
      key={`wrap-${video.id}-${video.filesize}`}
    >
      <img
        key={`img-${video.id}-${video.filesize}`}
        className="gallery-image"
        src={
          video.imageUrl.startsWith("http")
            ? video.imageUrl
            : `${uri}/${video.imageUrl}`
        }
        alt={video.imageUrl}
        onClick={() => {
          setModalVideo(video);
          setIsModalOpen(true);
        }}
      />
      <div className="gallery-tags">
        <span className="gallery-date">
          {(() => {
            const date = new Date(`${video.date}`);
            return date.toLocaleString([], {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            });
          })()}
        </span>
        {process.env.REACT_APP_SHOW_ANNOTATIONS === "true" &&
          video?.annotations?.map((annotation, index) => (
            <Tag
              key={`tag-${video.id}-${video.filesize}-${annotation.name}-${index}`}
              type="blue"
            >
              {annotation.name}
            </Tag>
          ))}
      </div>
    </Column>
  );
};

export default withTranslation()(Gallery);
