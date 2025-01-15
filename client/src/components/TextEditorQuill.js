import React, { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function QuillEditor({ content, setEditorContent }) {
  const quillRef = useRef(null);

  useEffect(() => {
    const quillInstance = quillRef.current?.getEditor();
    if (quillInstance && content) {
      // Set the HTML content directly
      quillInstance.root.innerHTML = content;
    }
  }, [content]);

  const handleContentChange = (content) => {
    // Get HTML content directly
    setEditorContent(content);
  };

  const editorStyle = {
    height: '300px',
    width: '100%',
    border: '2px solid seagreen'
  };

  return (
    <div>
      <ReactQuill
        ref={quillRef}
        value={content || ''}
        onChange={handleContentChange}
        modules={{
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ header: [1, 2, false] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image', 'video'],
            ['clean'],
          ],
        }}
        formats={[
          'bold', 'italic', 'underline', 'header', 'list', 'bullet',
          'link', 'image', 'video',
        ]}
        theme="snow"
        style={editorStyle}
      />
    </div>
  );
}

export default QuillEditor;