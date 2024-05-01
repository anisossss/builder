import React, { useState } from "react";
const JsonViewer = () => {
  const [editData, setEditData] = useState({});
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
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
    const keys = path.split(".");
    const lastKey = keys.pop();
    const updatedData = JSON.parse(JSON.stringify(editData));

    let subObject = updatedData;
    for (const key of keys) {
      subObject = subObject[key] = subObject[key] || {};
    }

    if (isKey) {
      if (newValue in subObject) {
        alert("Key already exists. Choose a different name.");
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

  const renderSection = (sectionTitle, sectionData) => {
    // Replace underscores with spaces in sectionTitle
    const title = sectionTitle.replace(/_/g, " ");

    return (
      <div className="mt-4">
        <h2 className="font-bold text-lg">{title}</h2>
        <div className="ml-4">
          {Object.entries(sectionData).map(([key, value]) => {
            if (Array.isArray(value)) {
              return (
                <div key={`${title}-${key}`} className="ml-6 mt-2">
                  {value.map((item, index) => (
                    <div key={`${title}-${key}-${index}`}>
                      {renderItem(key, item, `${title}.${key}`)}
                    </div>
                  ))}
                </div>
              );
            } else if (typeof value === "object" && value !== null) {
              return (
                <div key={`${title}-${key}`} className="ml-6 mt-2">
                  {Object.entries(value).map(([subKey, subValue]) => (
                    <div key={`${title}-${key}-${subKey}`}>
                      {renderItem(subKey, subValue, `${title}.${key}`)}
                    </div>
                  ))}
                </div>
              );
            } else {
              return (
                <div key={`${title}-${key}`} className="ml-6 mt-2">
                  {renderItem(key, value, title)}
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  };
  const renderItem = (key, value, path) => {
    const newPath = path ? `${path}.${key}` : key;

    if (key === "start_date" || key === "end_date") {
      return (
        <div key={newPath} className="flex">
          <div>
            <span className="font-bold capitalize flex">
              {key.replace("_", " ")}:
            </span>
          </div>
          <div>
            <input
              className="italic bg-gray-100 rounded p-1 ml-2 w-full"
              value={value}
              onChange={(e) => handleEdit(newPath, e.target.value)}
              type="text"
            />
          </div>
        </div>
      );
    } else if (!isNaN(parseInt(key))) {
      return (
        <div key={newPath} className="ml-6 mt-2 capitalize">
          <span className="font-bold capitalize">{key}:</span>
          <input
            type="text"
            value={value}
            onChange={(e) => handleEdit(newPath, e.target.value)}
            className="italic bg-gray-100 rounded p-1 ml-2 w-full "
          />
        </div>
      );
    } else {
      const isLongValue = value.length > 50; // Adjust this threshold as needed
      const RenderComponent = isLongValue ? "textarea" : "input";

      return (
        <div key={newPath} className="ml-6 mt-2 capitalize">
          <span className="font-bold">{key}:</span>
          <RenderComponent
            value={value}
            onChange={(e) => handleEdit(newPath, e.target.value)}
            className={`italic bg-gray-100 rounded p-1 ml-2 w-full ${
              isLongValue ? "h-40" : ""
            }`}
          />
        </div>
      );
    }
  };
  const displaySkills = (skills) => {
    const groupedSkills = {};

    // Group skills by category
    for (const category in skills) {
      skills[category].forEach((skill) => {
        if (!(category in groupedSkills)) {
          groupedSkills[category] = [];
        }
        groupedSkills[category].push(skill);
      });
    }

    return (
      <div>
        <h2 className="font-bold text-lg">Skills</h2>
        {Object.entries(groupedSkills).map(([category, items]) => (
          <div key={category} className="ml-6 mt-4">
            <h3 className="font-bold capitalize">
              {category.replace("_", " ")}
            </h3>
            {items.map((item, index) => (
              <div
                key={`${category}-${index}`}
                className="ml-6 mt-2 capitalize"
              >
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleEdit(`skills.${category}.${index}`, e.target.value)
                  }
                  className="italic bg-gray-100 rounded p-1 ml-2 w-full"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };
  const displayLanguages = (languages) => {
    return (
      <div>
        <h2 className="font-bold text-lg">Languages</h2>
        {languages.map((language, index) => (
          <div key={`language-${index}`} className="ml-6 mt-4">
            <div>
              <span className="font-bold">Language:</span>
              <input
                type="text"
                value={language.language}
                onChange={(e) =>
                  handleEdit(
                    `languages.${index}.language`,
                    e.target.value,
                    true
                  )
                }
                className="italic bg-gray-100 rounded p-1 ml-2 w-full"
              />
            </div>
            <div>
              <span className="font-bold">Proficiency:</span>
              <select
                value={language.proficiency}
                onChange={(e) =>
                  handleEdit(`languages.${index}.proficiency`, e.target.value)
                }
                className="italic bg-gray-100 rounded p-1 ml-2 w-full"
              >
                <option value="Elementary Proficiency">
                  Elementary Proficiency
                </option>
                <option value="Limited Working Proficiency">
                  Limited Working Proficiency
                </option>
                <option value="Full Professional Proficiency">
                  Full Professional Proficiency
                </option>
              </select>
            </div>
          </div>
        ))}
      </div>
    );
  };
  const displayProjects = (projects) => {
    const projectItems = projects.map((project, index) => (
      <div key={`project-${index}`} className="ml-6 mt-2">
        {Object.entries(project).map(([key, value]) => (
          <div key={`${key}-${index}`} className="ml-6 mt-2 capitalize">
            <span className="font-bold">{key.replace("_", " ")}:</span>
            <input
              type="text"
              value={value}
              onChange={(e) =>
                handleEdit(`projects.${index}.${key}`, e.target.value)
              }
              className="italic bg-gray-100 rounded p-1 ml-2 w-full"
            />
          </div>
        ))}
      </div>
    ));

    return (
      <div>
        <h2 className="font-bold text-lg">Projects</h2>
        {projectItems}
      </div>
    );
  };
  const displayCertifications = (certifications) => {
    const certificationItems = certifications.map((cert, index) => (
      <div key={`certification-${index}`} className="ml-6 mt-2">
        {Object.entries(cert).map(([key, value]) => (
          <div key={`${key}-${index}`} className="ml-6 mt-2 capitalize">
            <span className="font-bold">{key.replace("_", " ")}:</span>
            <input
              type="text"
              value={value}
              onChange={(e) =>
                handleEdit(`certificates.${index}.${key}`, e.target.value)
              }
              className="italic bg-gray-100 rounded p-1 ml-2 w-full"
            />
          </div>
        ))}
      </div>
    ));

    return (
      <div>
        <h2 className="font-bold text-lg">Certifications</h2>
        {certificationItems}
      </div>
    );
  };
  const displayExperience = (experience) => {
    const experienceItems = experience.map((exp, index) => (
      <div key={`experience-${index}`} className="ml-6 mt-2">
        {Object.entries(exp).map(([key, value]) => (
          <div key={`${key}-${index}`} className="ml-6 mt-2 capitalize">
            <span className="font-bold">{key.replace("_", " ")}:</span>
            <input
              type="text"
              value={value}
              onChange={(e) =>
                handleEdit(`experience.${index}.${key}`, e.target.value)
              }
              className="italic bg-gray-100 rounded p-1 ml-2 w-full"
            />
          </div>
        ))}
      </div>
    ));

    return (
      <div>
        <h2 className="font-bold text-lg">Experience</h2>
        {experienceItems}
      </div>
    );
  };
  const displayEducation = (education) => {
    if (!education || education.length === 0) {
      return null; // If there's no education data, return null to prevent rendering
    }

    const educationItems = education.map((edu, index) => (
      <div key={`education-${index}`} className="ml-6 mt-2">
        {Object.entries(edu).map(([key, value]) => (
          <div key={`${key}-${index}`} className="ml-6 mt-2 capitalize">
            <span className="font-bold">{key.replace("_", " ")}:</span>
            <input
              type="text"
              value={value}
              onChange={(e) =>
                handleEdit(`education.${index}.${key}`, e.target.value)
              }
              className="italic bg-gray-100 rounded p-1 ml-2 w-full"
            />
          </div>
        ))}
      </div>
    ));

    return (
      <div>
        <h2 className="font-bold text-lg">Education</h2>
        {educationItems}
      </div>
    );
  };
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
    <div className="flex justify-between bg-gradient-to-r from-green-100 to-blue-100">
      <div className="text-left w-1/2 px-4 py-10 ">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
          Enhanced and Editable JSON Viewer
        </h1>
        <input
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="mb-6 block mx-auto text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-200 file:text-gray-700 hover:file:bg-pink-300"
        />
        {Object.entries(editData).map(([key, value]) => {
          const capitalizedKey =
            key.toUpperCase() !== key ? capitalizeFirstLetter(key) : key;

          if (capitalizedKey === "Languages") {
            return displayLanguages(value);
          } else if (capitalizedKey === "Skills") {
            return displaySkills(value);
          } else if (capitalizedKey === "Projects") {
            return displayProjects(value);
          } else if (
            capitalizedKey === "Experience" ||
            capitalizedKey === "Work_experience" ||
            capitalizedKey === "Work_history"
          ) {
            return displayExperience(value);
          } else if (capitalizedKey === "Education") {
            return displayEducation(value);
          } else if (
            capitalizedKey === "Certificates" ||
            capitalizedKey === "Certifications"
          ) {
            return displayCertifications(value);
          } else {
            return renderSection(capitalizedKey, value);
          }
        })}
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={downloadJson}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Download Modified JSON
          </button>
        </div>
      </div>
      <div className="w-1/2"></div>
    </div>
  );
};
export default JsonViewer;
