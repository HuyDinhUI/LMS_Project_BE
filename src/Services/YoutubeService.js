import axios from "axios";

const Search = async (keyword) => {

  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: keyword,
          type: "video",
          maxResults: 10,
          key: process.env.YOUTUBE_API_KEY,
        },
      }
    );

    const videos = response.data.items.map((v) => ({
      id: v.id.videoId,
      title: v.snippet.title,
      description: v.snippet.description,
      thumbnail: v.snippet.thumbnails.medium.url,
      channelTitle: v.snippet.channelTitle,
    }));

    return {data: videos}

  } catch (err) {
    throw err;
  }
};

export const YoutubeService = {
  Search,
};
