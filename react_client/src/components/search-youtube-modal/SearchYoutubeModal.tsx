import React, { useContext, useRef, useState } from "react";
import IYoutubeSearchResultItem from "../../api/types/IYoutubeSearchResultItem";
import YoutubeApi from "../../api/YoutubeApi";
import TextInput from "../inputs/TextInput";
import Modal from "../modal/Modal";
import { RequestorContext } from "../requestor/Requestor";
import { ToasterContext } from "../toaster/Toaster";
import "./SearchYoutubeModal.scss";
import VideoSearchResult from "./video-search-result/VideoSearchResult";

interface ISearchYoutubeModalProps {
  onClose(): void,
  onAddSong(title: string, id: string): void,
}

const SearchYoutubeModal: React.FC<ISearchYoutubeModalProps> = ({
  onClose,
  onAddSong,
}: ISearchYoutubeModalProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [searchText, setSearchText] = useState("");
  const toaster = useContext(ToasterContext);
  const requestor = useContext(RequestorContext);
  const [videos, setVideos] = useState<IYoutubeSearchResultItem[]>([]);

  const onSearchYoutube = async () => {
    if (searchText.trim().length < 3) {
      toaster?.showToast({
        type: "error",
        message: "You must type at least 3 character to search Youtube.",
      });
      return;
    }

    const searchResults = await requestor?.trackRequest(YoutubeApi.searchVideos(searchText));

    setVideos(searchResults?.items || []);
  };

  return (
    <Modal
      allowDrag
      allowResize
      initialWidth={500}
      head={
        <form
          ref={formRef}
          onSubmit={e => {
            e.preventDefault();
            onSearchYoutube();
          }}
          className="flex-row-narrow search-form"
        >
          <TextInput
            onChange={setSearchText}
            value={searchText}
            autoFocus
            placeholder="Search Youtube..."
            maxLength={200}
          />

          <button
            className="primary"
          >
            search
          </button>
        </form>
      }
      body={
        <div className="flex-col-narrow">
          {videos.length === 0 &&
            "No videos found. Use the search box above to search for videos."
          }

          {videos.map(v =>
            <VideoSearchResult video={v} key={v.id.videoId} onClick={v => onAddSong(v.snippet.title, v.id.videoId)} />
          )}
        </div>
      }
      foot={
        <>
          <button onClick={onClose}>Done</button>
        </>
      }
    />
  );
};

export default SearchYoutubeModal;