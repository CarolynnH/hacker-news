const ConvertTime = ({ unixTimestamp }) => {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const secondsAgo = currentTimestamp - unixTimestamp;

  // Logic to convert seconds to a human-readable format
  if (secondsAgo < 60) {
    return `${secondsAgo} second${secondsAgo !== 1 ? "s" : ""}ago`;
  } else if (secondsAgo < 3600) {
    const minutesAgo = Math.floor(secondsAgo / 60);
    return `${minutesAgo} minute${minutesAgo !== 1 ? "s" : ""} ago`;
  } else if (secondsAgo < 86400) {
    const hoursAgo = Math.floor(secondsAgo / 3600);
    return `${hoursAgo} hour${hoursAgo !== 1 ? "s" : ""} ago`;
  } else {
    const daysAgo = Math.floor(secondsAgo / 86400);
    return `${daysAgo} day${daysAgo !== 1 ? "s" : ""} ago`;
  }
};

export default ConvertTime;
