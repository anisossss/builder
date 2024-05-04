import React, { useState } from "react";

const JsonViewer = () => {
  const [editData, setEditData] = useState({});

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

  const handleEdit = (path, newValue) => {
    const keys = path.split(".");
    const lastKey = keys.pop();
    const updatedData = { ...editData };

    let subObject = updatedData;
    for (const key of keys) {
      subObject = subObject[key] = subObject[key] || {};
    }

    subObject[lastKey] = newValue;

    setEditData(updatedData);
  };

  const renderInput = (value, path) => (
    <input
      value={value}
      onChange={(e) => handleEdit(path, e.target.value)}
      className="italic bg-gray-100 rounded p-1 ml-2 w-full"
    />
  );

  const renderSection = (sectionTitle, sectionData) => {
    const title = sectionTitle.replace(/_/g, " ");

    return (
      <div className="mt-4">
        <h2 className="font-bold text-lg">
          {renderInput(title, sectionTitle)}
        </h2>
        <div className="ml-4 mt-8">
          {Object.entries(sectionData).map(([key, value]) => (
            <div key={`${sectionTitle}-${key}`} className="ml-6 mt-2">
              {renderItem(key, value, `${sectionTitle}.${key}`)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderItem = (key, value, path) => (
    <div key={path} className="flex">
      <div>
        <span className="font-bold">{renderInput(key, path)}</span>:
      </div>
      <div>{renderInput(value, path)}</div>
    </div>
  );

  const downloadJson = () => {
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(editData, null, 2)], {
      type: "application/json",
    });
    element.href = URL.createObjectURL(file);
    element.download = "modified-json.json";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="flex justify-center bg-gradient-to-r from-green-100 to-blue-100">
      <div className="text-left w-full px-4 py-10 ">
        <h1 className="text-4xl font-bold text-left mb-6 text-gray-800">
          Enhanced and Editable JSON Viewer
        </h1>
        <input
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="mb-6 block mx-auto text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-200 file:text-gray-700 hover:file:bg-pink-300"
        />
        {Object.entries(editData).map(([key, value]) => (
          <div key={key}>{renderSection(key, value)}</div>
        ))}
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={downloadJson}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Download Modified JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default JsonViewer;
