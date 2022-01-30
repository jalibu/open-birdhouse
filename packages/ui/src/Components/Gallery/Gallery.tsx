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
import { Content, Gallery } from "@open-birdhouse/common";
import { Translation } from "react-i18next";
import GalleryModal from "./GalleryModal";
import { VideoChat20 } from "@carbon/icons-react";

const ContentGallery = ({ t }: { t: any }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<Content>();
  const statusContext = useContext(StatusContext);
  const apiService = new ApiRequestService(statusContext);
  const [gallery, setGalery] = useState<Gallery>();
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

  return gallery && gallery?.contents?.length > 0 ? (
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
          {gallery.contents
            .slice((page - 1) * pageSize, page * pageSize)
            .map((content) => (
              <GaleryEntry
                key={`gallery-entry-${content.id}-${content.filesize}`}
                uri={gallery.uri}
                content={content}
                setIsModalOpen={setIsModalOpen}
                setModalContent={setModalContent}
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
            behavior: "smooth",
          });
          setPage(page);
          setPageSize(pageSize);
        }}
        pageNumberText={t("GALLERY.PAGINATION.PAGE_NUMBER")}
        pageSize={12}
        pageSizes={[12, 24, 36]}
        totalItems={gallery.contents.length}
      />
      <GalleryModal
        uri={gallery.uri}
        isOpened={isModalOpen}
        modalContent={modalContent}
        handleClose={(): void => {
          setIsModalOpen(false);
        }}
      />
    </section>
  ) : null;
};

const GaleryEntry = ({
  uri,
  content,
  setIsModalOpen,
  setModalContent,
}: {
  uri: string;
  content: Content;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setModalContent: Dispatch<SetStateAction<Content | undefined>>;
}) => {
  return (
    <Column
      className="gallery-entry"
      sm={2}
      md={4}
      lg={4}
      key={`wrap-${content.id}-${content.filesize}`}
    >
      <img
        key={`img-${content.id}-${content.filesize}`}
        className="gallery-image"
        src={
          content.imageUrl?.startsWith("http")
            ? content.imageUrl
            : `${uri}/${content.imageUrl}`
        }
        alt={content.imageUrl}
        onClick={() => {
          setModalContent(content);
          setIsModalOpen(true);
        }}
      />
      <div className="gallery-tags">
        <span className="gallery-date">
          {(() => {
            const date = new Date(`${content.date}`);
            return date.toLocaleString([], {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            });
          })()}
        </span>
        {content.videoUrl && <VideoChat20 />}
        {process.env.REACT_APP_SHOW_ANNOTATIONS === "true" &&
          content?.annotations?.map((annotation, index) => (
            <Tag
              key={`tag-${content.id}-${content.filesize}-${annotation.name}-${index}`}
              type="blue"
            >
              {annotation.name}
            </Tag>
          ))}
      </div>
    </Column>
  );
};

export default withTranslation()(ContentGallery);
