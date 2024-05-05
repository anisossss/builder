import React, { useState } from "react";

const JsonViewer = () => {
  const [editData, setEditData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const [currentValue, setCurrentValue] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target.result);
        setEditData(data);
      } catch (error) {
        console.error("Failed to parse JSON:", error);
      }
    };
    reader.readAsText(file);
  };
  const updateObjectByPath = (object, path, value) => {
    let schema = object;
    const pList = path.split(".");
    const len = pList.length;
    for (let i = 0; i < len - 1; i++) {
      const elem = pList[i];
      if (!schema[elem]) schema[elem] = {};
      if (elem.includes("[")) {
        const match = elem.match(/(\w+)\[(\d+)\]/);
        if (match && match.length === 3) {
          schema = schema[match[1]][parseInt(match[2])];
        }
      } else {
        schema = schema[elem];
      }
    }

    const lastElem = pList[len - 1];
    if (lastElem.includes("[")) {
      const match = lastElem.match(/(\w+)\[(\d+)\]/);
      if (match && match.length === 3) {
        schema[match[1]][parseInt(match[2])] = value;
      }
    } else {
      schema[lastElem] = value;
    }
  };
  const handleEdit = () => {
    const newEditData = JSON.parse(JSON.stringify(editData));
    updateObjectByPath(newEditData, currentPath, currentValue);
    setEditData(newEditData);
    setIsEditing(false);
  };
  const handleModalChange = (e) => {
    setCurrentValue(e.target.value);
  };

  const openModal = (path, value) => {
    setCurrentPath(path);
    setCurrentValue(value);
    setIsEditing(true);
  };

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const renderSection = (sectionTitle, sectionData) => {
    if (typeof sectionData === "string") {
      return (
        <div className="mt-4">
          <h2 className="p-2 bg-red-100 rounded-lg my-2 border border-red-800">
            <span
              className="font-bold uppercase cursor-pointer"
              onClick={() => openModal(`${sectionTitle}`, sectionData)}
            >
              {capitalize(sectionTitle)}
            </span>
          </h2>
          <div
            className="ml-4 mt-8 cursor-pointer"
            onClick={() => openModal(`${sectionTitle}`, sectionData)}
          >
            {sectionData}
          </div>
        </div>
      );
    }

    return (
      <div className="mt-4">
        <h2
          className="p-2 bg-red-100 rounded-lg my-2 border border-red-800 uppercase"
          onClick={() =>
            openModal(`${sectionTitle}.title`, sectionData.title || "")
          }
        >
          <span className="font-bold uppercase">
            {capitalize(sectionData.title || sectionTitle)}
          </span>
        </h2>
        <div className="ml-4 mt-8 h-30">
          {Object.entries(sectionData).map(([key, value]) => {
            if (key === "title") return null;
            return typeof value === "object" ? (
              renderSection(`${sectionTitle}.${key}`, value)
            ) : (
              <div
                key={`${sectionTitle}-${key}`}
                onClick={() => openModal(`${sectionTitle}.${key}`, value)}
                className="cursor-pointer"
              >
                <span className="font-bold uppercase">{capitalize(key)}:</span>{" "}
                <span>{value}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  const renderModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded">
        <textarea
          rows={5}
          cols={100}
          value={currentValue}
          onChange={handleModalChange}
          className="mb-4 p-2"
        />
        <br></br>
        <button
          onClick={handleEdit}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Save
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex justify-center w-50 bg-gradient-to-r from-green-100 to-blue-100">
      <div className="text-left w-full px-4 py-10">
        <h1 className="text-4xl font-bold text-left mb-6 text-gray-800">
          Enhanced and Editable JSON Viewer
        </h1>
        <input
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="mb-6 block mx-auto text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-200 file:text-gray-700 hover:file:bg-pink-300"
        />
        {Object.entries(editData).map(([key, value], index) => (
          <div key={key}>
            {renderSection(key, value)}
            {index !== Object.keys(editData).length - 1 && (
              <>
                <br></br>
                <hr
                  style={{
                    backgroundColor: "black",
                    height: "1px",
                    border: "none",
                  }}
                />
              </>
            )}
          </div>
        ))}
        {isEditing && renderModal()}
      </div>
    </div>
  );
};

export default JsonViewer;
