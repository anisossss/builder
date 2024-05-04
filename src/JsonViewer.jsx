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
      schema = schema[elem];
    }

    if (path.endsWith(".title")) {
      // Special handling to merge titles correctly
      if (!isNaN(pList[pList.length - 2])) {
        // Is part of an array, retain numeric index
        schema.title = value;
      } else {
        const parentPath = pList.slice(0, pList.length - 1).join(".");
        updateObjectByPath(object, parentPath, { ...schema, title: value });
        return;
      }
    } else {
      schema[pList[len - 1]] = value;
    }
  };

  const handleEdit = () => {
    const newEditData = { ...editData };
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

  const renderSection = (sectionTitle, sectionData) => {
    const editableTitle = sectionData.title || sectionTitle;
    return (
      <div className="mt-4">
        <h2
          className="font-bold text-lg"
          onClick={() => openModal(`${sectionTitle}.title`, editableTitle)}
        >
          <span>{editableTitle}</span>
        </h2>
        <div className="ml-4 mt-8">
          {Object.entries(sectionData).map(([key, value]) => {
            if (key === "title") return null; // Do not render the title field separately
            return typeof value === "object" && !Array.isArray(value) ? (
              renderSection(`${sectionTitle}.${key}`, value)
            ) : (
              <div
                key={`${sectionTitle}-${key}`}
                onClick={() => openModal(`${sectionTitle}.${key}`, value)}
              >
                <span className="font-bold">{key}:</span> <span>{value}</span>
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
          rows={20}
          cols={80}
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
    <div className="flex justify-center bg-gradient-to-r from-green-100 to-blue-100">
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
                <hr className="" />
              </>
            )}{" "}
          </div>
        ))}
        {isEditing && renderModal()}
      </div>
    </div>
  );
};

export default JsonViewer;
