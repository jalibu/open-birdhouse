import { Video } from "@open-birdhouse/common";
import { Link, Modal } from "carbon-components-react";
import React from "react";

export default function GalleryModal({
  isOpened,
  handleClose,
  modalVideo,
  uri,
}: {
  isOpened: boolean;
  handleClose: () => void;
  modalVideo: Video | undefined;
  uri: string;
}): JSX.Element | null {
  return modalVideo ? (
    <Modal
      className="gallery-modal"
      iconDescription="Close"
      modalHeading="Recording"
      onRequestClose={handleClose}
      open={isOpened}
      passiveModal
      size="sm"
    >
      <div className="bx--modal-content__text">
        <img src={`${uri}/${modalVideo?.imageUrl}`} alt={modalVideo?.id} />
        <p>
          {(() => {
            const date = new Date(`${modalVideo?.date}`);
            return date.toLocaleString();
          })()}
        </p>
        <p>
          <Link download href={`${uri}/${modalVideo?.videoUrl}`}>
            Download Video (
            {`${
              modalVideo?.filesize
                ? (modalVideo?.filesize / 1000000).toFixed(1)
                : 0
            } MB`}
            )
          </Link>
        </p>
      </div>
    </Modal>
  ) : null;
}
