// Required Libraries
import React, { useState } from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  Modifier,
  ContentState,
} from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import 'draft-js/dist/Draft.css';

function RichTextEditor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const toggleInlineStyle = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (type) => {
    setEditorState(RichUtils.toggleBlockType(editorState, type));
  };

  const addTable = () => {
    const tableHTML = `
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td>Cell 1</td>
          <td>Cell 2</td>
        </tr>
        <tr>
          <td>Cell 3</td>
          <td>Cell 4</td>
        </tr>
      </table>`;

    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'TABLE',
      'IMMUTABLE',
      { html: tableHTML }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newContentState = Modifier.insertText(
      contentStateWithEntity,
      editorState.getSelection(),
      'Table',
      null,
      entityKey
    );
    setEditorState(EditorState.push(editorState, newContentState, 'insert-characters'));
  };

  const addImage = () => {
    const src = prompt('Enter image URL');
    if (src) {
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity('IMAGE', 'IMMUTABLE', { src });
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newContentState = Modifier.insertText(
        contentStateWithEntity,
        editorState.getSelection(),
        ' ',
        null,
        entityKey
      );
      setEditorState(EditorState.push(editorState, newContentState, 'insert-characters'));
    }
  };

  const addVideo = () => {
    const src = prompt('Enter video URL');
    if (src) {
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity('VIDEO', 'IMMUTABLE', { src });
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newContentState = Modifier.insertText(
        contentStateWithEntity,
        editorState.getSelection(),
        ' ',
        null,
        entityKey
      );
      setEditorState(EditorState.push(editorState, newContentState, 'insert-characters'));
    }
  };

  const toggleSuperscript = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'SUPERSCRIPT'));
  };

  const toggleSubscript = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'SUBSCRIPT'));
  };

  const saveContent = () => {
    const content = editorState.getCurrentContent();
    const raw = convertToRaw(content);
    const html = stateToHTML(content);
    console.log('Raw Content:', raw);
    console.log('HTML Output:', html);
  };

  return (
    <div>
      <h2>Rich Text Editor</h2>
      <div style={{ border: '1px solid #ddd', padding: '10px' }}>
        {/* Toolbar */}
        <div>
          <button onClick={() => toggleInlineStyle('BOLD')}>Bold</button>
          <button onClick={() => toggleInlineStyle('ITALIC')}>Italic</button>
          <button onClick={() => toggleInlineStyle('UNDERLINE')}>Underline</button>
          <button onClick={() => toggleBlockType('unordered-list-item')}>UL</button>
          <button onClick={() => toggleBlockType('ordered-list-item')}>OL</button>
          <button onClick={() => addImage()}>Add Image</button>
          <button onClick={() => addVideo()}>Add Video</button>
          <button onClick={() => addTable()}>Add Table</button>
          <button onClick={() => toggleSuperscript()}>Superscript</button>
          <button onClick={() => toggleSubscript()}>Subscript</button>
        </div>

        {/* Editor */}
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
        />
      </div>

      <button onClick={saveContent}>Save Content</button>
    </div>
  );
}

export default RichTextEditor;
