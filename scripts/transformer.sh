#!/bin/bash
VIDEOS=~/recordings/
find "$VIDEOS" -name '*.mp4' -exec sh -c 'ffmpeg -i "$0" -c:v libvpx -crf 10 -b:v 1M -c:a libvorbis "${0%%.mp4}.webm" && rm "${0%}"' {} \;
curl http://localhost:3001/api/gallery/refresh
exit;
