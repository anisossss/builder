import React, { useState } from 'react';

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

    const handleEdit = (path, newValue, isKey = false) => {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const updatedData = JSON.parse(JSON.stringify(editData)); // Deep clone

        let subObject = updatedData;
        for (const key of keys) {
            subObject = subObject[key] = subObject[key] || {}; // Ensure all parts of the path exist
        }

        if (isKey) {
            if (newValue in subObject) {
                alert('Key already exists. Choose a different name.');
                return;
            }
            const oldValue = subObject[lastKey];
            delete subObject[lastKey];
            subObject[newValue] = oldValue;
        } else {
            subObject[lastKey] = newValue;
        }

        setEditData(updatedData);
    };

    const displayKeyValue = (key, value, path = '') => {
        const newPath = path ? `${path}.${key}` : key;
        return (
            <div key={newPath} className="mt-2 mb-6 p-4 bg-white shadow rounded-lg text-left border-l-4 border-pink-300">
                <input
                    type="text"
                    value={key}
                    onChange={(e) => handleEdit(newPath, e.target.value, true)}
                    className="font-bold text-lg text-gray-700"
                />
                {typeof value === 'object' && value !== null ? (
                    Object.entries(value).map(([subKey, subValue]) => displayKeyValue(subKey, subValue, newPath))
                ) : (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => handleEdit(newPath, e.target.value)}
                        className="italic bg-gray-100 rounded p-1"
                    />
                )}
            </div>
        );
    };

    const downloadJson = () => {
        const element = document.createElement("a");
        const file = new Blob([JSON.stringify(editData, null, 2)], {type: 'application/json'});
        element.href = URL.createObjectURL(file);
        element.download = "modified-json.json";
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div className="container mx-auto px-4 py-10 bg-gradient-to-r from-green-100 to-blue-100 font-sans leading-normal tracking-normal">
            <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
                Enhanced and Editable JSON Viewer
            </h1>
            <input type="file" accept=".json" onChange={handleFileChange} className="mb-6 block mx-auto text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-200 file:text-gray-700 hover:file:bg-pink-300" />
            <div className="text-center">{Object.entries(editData).map(([key, value]) => displayKeyValue(key, value))}</div>
            <div className="flex justify-center space-x-2 mt-4">
                <button onClick={downloadJson} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Download Modified JSON
                </button>
            </div>
        </div>
    );
};

export default JsonViewer;
