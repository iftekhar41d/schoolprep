import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill's styles
import axios from "axios"; // If you're using axios for file upload

const MyEditor = () => {
  const [editorHtml, setEditorHtml] = useState("");
  const quillRef = React.useRef(null);

  // Image upload handler
  const handleImageUpload = async (file) => {
    // Replace with your own logic for uploading images
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post('/upload-endpoint', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Assuming the response contains the URL of the uploaded image
      const imageUrl = response.data.imageUrl;
      const quill = quillRef.current.getEditor();
      const range = quill.getSelection();
      quill.insertEmbed(range.index, "image", imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  // Custom image resizing function
  const handleImageResize = () => {
    const quill = quillRef.current.getEditor();
    const range = quill.getSelection();
    if (range) {
      const image = quill.getLeaf(range.index)[0].domNode; // Get the selected image
      if (image && image.tagName === "IMG") {
        // Trigger resizing: Add custom logic to resize the image
        image.style.width = "300px"; // Example: set image width to 300px
        image.style.height = "auto"; // Adjust height to maintain aspect ratio
      }
    }
  };

  // Module configuration (including custom image toolbar button)
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ align: [] }],
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      ["link", "image"], // Image insert button
      [{ "customImageResize": "resize" }], // Custom resize button (will need to be defined)
    ],
  };

  return (
    <div>
      <ReactQuill
        ref={quillRef}
        value={editorHtml}
        onChange={setEditorHtml}
        modules={modules}
      />
      {/* Custom Image Upload Button */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleImageUpload(e.target.files[0])}
      />
      {/* Custom Resize Button */}
      <button onClick={handleImageResize}>Resize Image</button>
    </div>
  );
};

export default MyEditor;
