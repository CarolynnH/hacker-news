import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import ConvertTime from "./components/ConvertTime";
import "./App.css";
import { Link } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import getHost from "./components/Host";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [topStories, setTopStories] = useState([]);
  const [storiesDt, setStoriesDt] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 30;

  useEffect(() => {
    getTopStories();
  }, []);

  useEffect(() => {
    if (topStories.length > 0) {
      getStoriesData();
    }
  }, [topStories, currentPage]);

  useEffect(() => {
    setTotalPages(Math.ceil(topStories.length / itemsPerPage));
  }, [topStories.length, itemsPerPage]);

  const getTopStories = async () => {
    const response = await fetch(
      `https://hacker-news.firebaseio.com/v0/topstories.json`
    );
    const data = await response.json();
    setTopStories(data.reverse()); //descending order
  };
  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage);
    // Scroll to the top when the page changes
    window.scrollTo(0, 0);
  };

  const getStoriesData = async () => {
    try {
      setLoading(true);
      const concurrencyLimit = 10;
      const response = await Promise.all(
        topStories.map(async (storyId, index) => {
          if (index % concurrencyLimit === 0) {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Add a delay between batches
          }
          const response = await fetch(
            `https://hacker-news.firebaseio.com/v0/item/${storyId}.json?printpretty`
          );
          const data = await response.json();
          return data;
        })
      );

      setStoriesDt(response);
    } catch (error) {
      console.error("Error fetching stories data", error);
    } finally {
      setLoading(false);
    }
  };

  const paginateData = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return storiesDt.slice(startIndex, endIndex);
  };
  const paginatedData = paginateData();

  return (
    <div className="App">
      <Navbar />

      <div className="app-container">
        {loading && <LoadingSpinner />}
        {paginatedData.map((item, index) => (
          <div key={item.id}>
            <div className="story">
              <span className="index">
                {currentPage * itemsPerPage + index + 1}
              </span>
              <div>
                <a
                  className="title"
                  href={item.url}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {item.title}
                </a>
                <span className="host">({getHost(item.url)})</span>
                <p className="subtext">
                  <span className="subitem">{item.score} points</span>
                  <span className="subitem">
                    by <b>{item.by}</b>
                  </span>
                  <span className="subitem">
                    {ConvertTime({ unixTimestamp: item.time })}
                  </span>
                  <span className="subitem">|</span>
                  <span className="subitem">
                    <Link className="comments" to={`/comments/${item.id}`}>
                      {item.kids?.length || 0} comments
                    </Link>
                  </span>
                </p>
              </div>
            </div>
            <span className="line" />
          </div>
        ))}
      </div>

      <ReactPaginate
        previousLabel={"previous"}
        nextabel={"next"}
        breakLabel={"..."}
        pageCount={totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={({ selected }) => handlePageChange(selected)}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </div>
  );
};

export default App;
