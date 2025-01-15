import React, { useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_BASE_URL}`,
  });
 

const Questions = () => {
  const [subjects, setSubjects] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [csvFile, setCsvFile] = useState(null);

  useEffect(() => {
    // Fetch subjects on component mount
    api.get("/api/subjects").then((response) => {
      setSubjects(response.data);
    });
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      // Fetch units when a subject is selected
      api
        .get(`/api/subjectunits?subject_id=${selectedSubject}`)
        .then((response) => {
          setUnits(response.data);
        });
    } else {
      setUnits([]);
    }
  }, [selectedSubject]);

  const handleFileUpload = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleDownloadTemplate = () => {
    const token = localStorage.getItem("token");

    // Trigger the backend API to download the template
    api
      .get("/api/ques/template", { 
        responseType: "blob" , 
        headers: {
        Authorization: `Bearer ${token}`, // Include token in Authorization header
      }, 
    })
      .then((response) => {
        // Create a link element
        const link = document.createElement("a");
        const url = window.URL.createObjectURL(new Blob([response.data]));
        link.href = url;
        link.setAttribute("download", "questions_template.csv"); // Specify the filename
        document.body.appendChild(link);
        link.click(); // Trigger the download
        document.body.removeChild(link); // Clean up after download
      })
      .catch((error) => {
        console.error("Error downloading the template:", error);
        alert("Failed to download the template.");
      });
  };

  const handleSubmit = () => {
    if (!selectedSubject || !selectedUnit || !csvFile) {
      alert("Please select a subject, unit, and upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("subject_id", selectedSubject);
    formData.append("unit_id", selectedUnit);
    formData.append("csv_file", csvFile);

    console.log(formData);

    api
      .post("/api/ques/upload", formData)
      .then((response) => {
        alert("File uploaded successfully!");
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        alert("Error uploading file.");
      });
  };

  return (
    <div >
      <h4 className='admin-table-header1'>Bulk Upload Questions</h4>
      <div>
        <label>Subjects: </label>
        <select          
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="">-- Select Subject --</option>
          {subjects.map((subject) => (
            <option key={subject.subject_id} value={subject.subject_id}>
              {subject.subject_name}
            </option>
          ))}
        </select>
      </div>

      <div >
        <label>Units: </label>
        <select
          value={selectedUnit}
          onChange={(e) => setSelectedUnit(e.target.value)}
        >
          <option value="">-- Select Unit --</option>
          {units.map((unit) => (
            <option key={unit.unit_id} value={unit.unit_id}>
              {unit.unit_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Upload CSV File: </label>
        <input type="file" accept=".csv" onChange={handleFileUpload} />
      </div>

      <button onClick={handleDownloadTemplate}>Download Template</button>

      <button onClick={handleSubmit}>Upload</button>
    </div>
  );
};

export default Questions;
