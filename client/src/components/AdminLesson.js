import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}`,
});

const AdminLesson = () => {
  const [subjects, setSubjects] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [editorContent, setEditorContent] = useState("");
  const quillRef = useRef(null);

  useEffect(() => {
    api.get("/api/subjects").then((response) => {
      setSubjects(response.data);
    });
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      api.get(`/api/subjectunits?subject_id=${selectedSubject}`)
        .then((response) => {
          setUnits(response.data);
        });
    } else {
      setUnits([]);
    }
  }, [selectedSubject]);

  useEffect(() => {
    if (selectedUnit) {
      api.get(`/api/lessons/${selectedUnit}`)
        .then((response) => {
          setEditorContent(response.data.lesson_content || "");
        })
        .catch((error) => {
          console.error("Error fetching lesson content:", error);
        });
    } else {
      setEditorContent("");
    }
  }, [selectedUnit]);

  // Define modules with proper format configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      ['link', 'image', 'video'],
      ['clean']
    ]
  };

  // Define all allowed formats
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'align',
    'list', 'bullet',
    'link', 'image', 'video',
    'script',
    'clean'
  ];

  const editorStyle = {
    height: '400px',  // Increase the height of the editor
    width: '100%',    // Set width to 100% or specify a fixed width
    overflowY: 'hidden',  // Hide the vertical scrollbar initially
  };

  const handleSaveLesson = async () => {
    if (!selectedUnit || !editorContent) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const existingLesson = await api.get(`/api/lessons/${selectedUnit}`);

      if (existingLesson.data.lesson_content) {
        await api.put(`/api/lessons/${selectedUnit}`, {
          unit_id: selectedUnit,
          content: editorContent,
        });
        alert("Lesson updated successfully!");
      } else {
        await api.post("/api/lessons", {
          unit_id: selectedUnit,
          content: editorContent,
        });
        alert("Lesson created successfully!");
      }
    } catch (error) {
      console.error("Error saving lesson:", error);
      alert("Error saving lesson!");
    }
  };

  return (
    <div className="form-container">
      <div className="subject-select">
        <label htmlFor="subjectSelect" className="editor-label">Subjects</label>
        <select
          id="subjectSelect"
          className="form-select"
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

      <div className="unit-select">
        <label htmlFor="unitSelect" className="editor-label">Units</label>
        <select
          id="unitSelect"
          className="form-select"
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

      <div className="editor-container1 mb-3">
        <label htmlFor="lessonEditor" className="editor-label">Create/Edit Lesson</label>
        <div className="editor-wrapper">
          <ReactQuill
            ref={quillRef}
            value={editorContent}
            onChange={setEditorContent}
            modules={modules}
            formats={formats}
            theme="snow"
            style={editorStyle}
          />
        </div>
      </div>

      <div className="lesson-button-area">
        <button className="btn btn-primary" onClick={handleSaveLesson}>
          Save Lesson
        </button>
      </div>
    </div>
  );
};

export default AdminLesson;