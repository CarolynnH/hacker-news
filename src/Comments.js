import React, { useState, useEffect } from "react";
import "./Comments.css";
import { useParams } from "react-router-dom";
import ConvertTime from "./components/ConvertTime";
import Navbar from "./components/Navbar/Navbar";
import getHost from "./components/Host";
import parse from "html-react-parser";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
const Comment = ({ commentID }) => {
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState(null);
  const [showReplies, setShowReplies] = useState(false);

  useEffect(() => {
    const fetchCommentData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${commentID}.json?printpretty`
        );
        const data = await response.json();
        setComment(data);
      } catch (error) {
        console.error("Error fetching comment data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCommentData();
  }, [commentID]);

  const handleToggleReplies = () => {
    setShowReplies(!showReplies);
  };
  if (!comment) {
    // Comment data is still being fetched
    return <LoadingSpinner />;
  }
  return (
    <div className="comment">
      <span className="username">{comment.by}</span>{" "}
      {typeof comment.text === "string" ? (
        <p className="replies">{parse(comment.text)}</p>
      ) : (
        <p className="replies">{comment.text}</p>
      )}
      <span className="time">
        {ConvertTime({ unixTimestamp: comment.time })}
      </span>
      <span className="reply-btn">Reply</span>
      <span className="line" />
      {comment.kids && comment.kids.length > 0 && (
        <div className="nested-comments">
          {showReplies &&
            comment.kids.map((replyID) => (
              <Comment key={replyID} commentID={replyID} />
            ))}
          <span className="reply-action" onClick={handleToggleReplies}>
            {showReplies ? (
              <>
                <IoMdArrowDropup />
                Hide Replies
              </>
            ) : (
              <>
                <IoMdArrowDropdown />
                Show Replies
              </>
            )}
          </span>
        </div>
      )}
    </div>
  );
};

const Comments = () => {
  const { storyID } = useParams();
  const [storiesDt, setStoriesDt] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getStoriesData();
  }, []);

  const getStoriesData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${storyID}.json`
      );
      const data = await response.json();
      setStoriesDt(data);
    } catch (error) {
      console.error("Error fetching stories data", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      {loading && <LoadingSpinner />}
      <div className="comment-container">
        <a
          className="story-title"
          href={storiesDt.url}
          target="_blank"
          rel="noreferrer noopener"
        >
          {storiesDt.title}
        </a>
        <span className="host">({getHost(storiesDt.url)})</span>{" "}
        <div className="subitems">
          {storiesDt.score} points | by {storiesDt.by}{" "}
          {ConvertTime({ unixTimestamp: storiesDt.time })}{" "}
        </div>
        {storiesDt.kids && storiesDt.kids.length > 0 ? (
          <div>
            <span className="comment-numbers">
              {" "}
              {storiesDt.kids.length} Comments
            </span>
            {storiesDt.kids.map((commentID) => (
              <Comment key={commentID} commentID={commentID} />
            ))}
          </div>
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </>
  );
};

export default Comments;
