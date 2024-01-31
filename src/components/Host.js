const getHost = (storyUrl) => {
  try {
    const urlString = new URL(storyUrl);
    const host = urlString.host;
    return host;
  } catch (error) {
    console.error(`Error parsing URL: ${storyUrl}`, error);
    return "";
  }
};

export default getHost;
