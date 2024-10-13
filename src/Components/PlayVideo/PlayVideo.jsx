import "./PlayVideo.css";
// import video1 from "../../assets/video.mp4";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/save.png";
// import jack from "../../assets/jack.png";
import user_profile from "../../assets/user_profile.jpg";
import { useEffect, useState } from "react";
import { value_converter } from "../../data";
import moment from "moment";
import { useParams } from "react-router-dom";

const PlayVideo = () => {
  const { videoId } = useParams()
  const [apiData, setApiData] = useState(null);
  const [channelData, setchannelData] = useState(null);
  const [commentData, setcommentData] = useState([]);

  const fetchVideoData = async () => {
    // Fetching video data
    const videoDetailsUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${
      import.meta.env.VITE_YT_DATA_API_KEY
    }`;
    await fetch(videoDetailsUrl)
      .then((response) => response.json())
      .then((data) =>         
        setApiData(data.items[0])
      );
  };
  const fetchOtherData = async () => {
    // Fetching channel data
    const channelDetailsUrl = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${import.meta.env.VITE_YT_DATA_API_KEY}`

    await fetch(channelDetailsUrl)
      .then((response) => response.json())
      .then((data) => setchannelData(data.items[0]));

    const commentUrl = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${import.meta.env.VITE_YT_DATA_API_KEY}`;

    await fetch(commentUrl)
      .then((response) => response.json())
      .then((data) => setcommentData(data.items));
  };

  useEffect(() => {
    fetchVideoData();
  }, [videoId]);

  useEffect(() => {
    fetchOtherData();
  }, [apiData]);

  
  return (
    <div className="play-video">
      {/* <video src={video1} controls autoPlay muted></video> */}
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
      <h3>{apiData ? apiData.snippet.title : "Title Here"}</h3>
      <div className="play-video-info">
        <p>
          {apiData ? value_converter(apiData.statistics.viewCount) : "16k"}{" "}
          views &bull;{" "}
          {apiData ? moment(apiData.snippet.publishedAt).fromNow() : ""}
        </p>
        <div>
          <span>
            <img src={like} alt="like-icon" />
            {apiData ? value_converter(apiData.statistics.likeCount) : 175}
          </span>
          <span>
            <img src={dislike} alt="dislike-icon" />
          </span>
          <span>
            <img src={share} alt="share-icon" />
            Share
          </span>
          <span>
            <img src={save} alt="save-icon" />
            Save
          </span>
        </div>
      </div>
      <hr />
      <div className="publisher">
        <img
          src={channelData ? channelData.snippet.thumbnails.default.url : ""}
          alt="jack"
        />
        <div>
          <p>{apiData ? value_converter(apiData.snippet.channelTitle) : ""}</p>
          <span>
            {channelData
              ? value_converter(channelData.statistics.subscriberCount)
              : ""}{" "}
            Subscribers
          </span>
        </div>
        <button>Subscribe</button>
      </div>
      <div className="vid-description">
        <p>
          {apiData
            ? apiData.snippet.description.slice(0, 250)
            : "Description Here"}
        </p>
        <hr />
        <h4>
          {apiData ? value_converter(apiData.statistics.commentCount) : 177}{" "}
          Comments
        </h4>
        {commentData.map((item, idx) => (
          <div className="comment" key={idx}>
            <img
              src={
                item.snippet.topLevelComment.snippet.authorProfileImageUrl ||
                user_profile
              }
              alt="user_profile"
            />
            <div>
              <h3>
                {item.snippet.topLevelComment.snippet.authorDisplayName}{" "}
                <span>{moment(item.snippet.topLevelComment.snippet.publishedAt).fromNow()}</span>
              </h3>
              <p>
                {item.snippet.topLevelComment.snippet.textDisplay}
              </p>
              <div className="comment-action">
                <img src={like} alt="like-icon" />
                <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                <img src={dislike} alt="dislike-icon" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayVideo;
