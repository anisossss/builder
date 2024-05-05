import React, { useState } from "react";

const JsonViewer = () => {
  const [jsonData, setJsonData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = JSON.parse(evt.target.result);
      setJsonData(data);
      setCurrentPage(1);
    };
    reader.readAsText(file);
  };

  const displayKeyValue = (key, value) => {
    if (typeof value === "object" && value !== null) {
      return (
        <div className="mt-2 mb-6 p-4 bg-white shadow rounded-lg text-left border-l-4 border-pink-300">
          <h2 className="font-bold text-lg text-gray-700">{key}:</h2>
          {Array.isArray(value)
            ? value.map((item, index) => (
                <div
                  key={index}
                  className="p-2 bg-purple-100 rounded-lg my-2 border border-purple-300"
                >
                  {typeof item === "object" && item !== null ? (
                    displayKeyValue(
                      Object.keys(item)[0],
                      item[Object.keys(item)[0]]
                    )
                  ) : (
                    <p className="italic">{item}</p>
                  )}
                </div>
              ))
            : Object.keys(value).map((subKey) =>
                displayKeyValue(subKey, value[subKey])
              )}
        </div>
      );
    } else {
      return <p className="italic">{JSON.stringify(value, null, 2)}</p>;
    }
  };

  const pageContent = () => {
    if (!jsonData) return null;
    const keys = Object.keys(jsonData);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return keys
      .slice(start, end)
      .map((key) => displayKeyValue(key, jsonData[key]));
  };

  const setupPagination = () => {
    const totalItems = Object.keys(jsonData || {}).length;
    const pageCount = Math.ceil(totalItems / itemsPerPage);
    return [...Array(pageCount).keys()].map((i) => (
      <button
        key={i}
        className={`px-4 py-2 rounded-full ${
          currentPage === i + 1
            ? "bg-blue-400 text-white"
            : "bg-yellow-200 text-gray-700"
        } hover:bg-blue-300`}
        onClick={() => setCurrentPage(i + 1)}
      >
        {i + 1}
      </button>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-10 bg-gradient-to-r from-green-100 to-blue-100 font-sans leading-normal tracking-normal">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
        Enhanced and Paginated JSON Viewer
      </h1>
      <input
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="mb-6 block mx-auto text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-200 file:text-gray-700 hover:file:bg-pink-300"
      />
      <div className="text-center">{pageContent()}</div>
      <div className="flex justify-center space-x-2 mt-4">
        {setupPagination()}
      </div>
    </div>
  );
};

export default JsonViewer;
