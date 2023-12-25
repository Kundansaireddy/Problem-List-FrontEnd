import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [collectionData, setCollectionData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/collections")
      .then((response) => {
        setCollections(response.data.sort());
      })
      .catch((error) => {
        console.error("Error fetching collections:", error);
      });
  }, []);

  const fetchCollectionData = (collectionName) => {
    setSelectedCollection(collectionName);
    axios
      .get(`http://localhost:3001/collections/${collectionName}`)
      .then((response) => {
        setCollectionData(response.data);
      })
      .catch((error) => {
        console.error(`Error fetching data from ${collectionName}:`, error);
      });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim() !== "") {
      const sortedCollections = collections.sort((a, b) =>
        a.toLowerCase().includes(e.target.value.toLowerCase()) ? -1 : 1
      );
      setCollections(sortedCollections);
    } else {
      setCollections(collections.sort());
    }
  };

  return (
    <div className="app">
      <div className="app__navbar">QUESTION LIST</div>

      <div className="app__sidebar">
        <h2>Companies</h2>
        <input
          className="app__input"
          type="text"
          placeholder="Search companies.."
          value={searchTerm}
          onChange={handleSearch}
        />
        <ul className="app__user-list">
          {collections.map((collection, index) => {
            const displayName =
              collection.charAt(0).toUpperCase() + collection.slice(1, -1);
            return (
              <li key={index} onClick={() => fetchCollectionData(collection)}>
                <button className="displayNameButton">{displayName}</button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="app__problem-list">
        {selectedCollection && collectionData.length ? (
          <div>
            <h2>
              Problem links :{" "}
              {selectedCollection.charAt(0).toUpperCase() +
                selectedCollection.slice(1, -1)}
            </h2>
            <ul>
              {collectionData.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.problem_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.problem_name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>
            {selectedCollection
              ? "No problem links found."
              : "Select a company to view its data."}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
