import React from 'react';
import {useParams, useLocation} from 'react-router-dom';
import DOMPurify from 'dompurify';




function LearningBoard() {
    const location = useLocation();
    const { subject, unit } = location.state || {}; // Destructure values from state 
    const { unitid } = useParams(); //get unit id from URL
    const lesson_content = `
           <div>
                <p>Welcome to today's lesson!</p>
                <img src='/light.png' alt='Logo' className='logo'/>  
                <div>
                    <h2>Video Lesson</h2>
                    <iframe 
                    width="560" 
                    height="315" 
                    src="https://www.youtube.com/embed/cPAbx5kgCJo" 
                    title="YouTube video player" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowfullscreen>
                    </iframe>
               </div>
            </div>
    `

      // Configure DOMPurify to allow iframes and YouTube embedding
    const sanitizerConfig = {
    ADD_TAGS: ['iframe'], // Allow iframe
    ADD_ATTR: [
      'allow', 
      'allowfullscreen', 
      'frameborder', 
      'width', 
      'height', 
      'src', 
      'title'
    ], // Allow necessary iframe attributes
  };

    const sanitizedContent = DOMPurify.sanitize(lesson_content, sanitizerConfig);

  return (
    <div>LearningBoard
        <p>{subject} {unit}</p>
      {/* Render the HTML content */}
      <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
    </div>
  );
}

export default LearningBoard;