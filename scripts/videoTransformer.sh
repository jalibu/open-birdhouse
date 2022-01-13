#!/bin/bash
MEDIA_FOLDER=$1;
USE_SUDO=$2;
if [[ "$USE_SUDO" == "true" ]];
then
    echo "Executing with sudo..."
    find "$MEDIA_FOLDER" -name '*.mp4' -exec sh -c 'ffmpeg -i "$0" -c:v libvpx -crf 10 -b:v 1M -c:a libvorbis "${0%%.mp4}.webm" && sudo rm "${0%}"' {} \;
else
    echo "Executing as non-root..."
    find "$MEDIA_FOLDER" -name '*.mp4' -exec sh -c 'ffmpeg -i "$0" -c:v libvpx -crf 10 -b:v 1M -c:a libvorbis "${0%%.mp4}.webm" && rm "${0%}"' {} \;
fi
echo "Done transforming videos";
exit;
