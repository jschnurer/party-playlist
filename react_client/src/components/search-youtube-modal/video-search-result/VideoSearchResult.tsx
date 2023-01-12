import React from "react";
import IYoutubeSearchResultItem from "../../../api/types/IYoutubeSearchResultItem";
import "./VideoSearchResult.scss";

interface IVideoSearchResultProps {
  video: IYoutubeSearchResultItem,
  onClick: (video: IYoutubeSearchResultItem) => void,
}

const VideoSearchResult: React.FC<IVideoSearchResultProps> = ({
  video,
  onClick,
}: IVideoSearchResultProps) => {
  return (
    <div className="youtube-search-result-item">
      <h4>
        {video.snippet.title}
      </h4>

      <div className="flex-row-narrow">
        <img
          src={video.snippet.thumbnails.default.url}
          alt=""
          style={{
            width: video.snippet.thumbnails.default.width,
            height: video.snippet.thumbnails.default.height,
          }}
        />

        <button
          className="primary"
          onClick={() => onClick(video)}
        >
          Suggest
        </button>
      </div>
    </div>
  );
};

export default VideoSearchResult;