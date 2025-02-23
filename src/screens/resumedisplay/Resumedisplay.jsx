import React, { useContext, useEffect, useState } from 'react';
import { ResumeContext } from '../../utils/ResumeContext';
import { renderAsync } from 'docx-preview';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './style.css';

const Resumedisplay = () => {
  const { resume } = useContext(ResumeContext);
  const [containerRef, setContainerRef] = useState(null);

  useEffect(() => {
    if (resume?.generatedDocument && containerRef) {
      const { data } = resume.generatedDocument.base64;
      const arrayBuffer = new Uint8Array(data).buffer;
      
      renderAsync(arrayBuffer, containerRef, containerRef, {
        className: 'docx-viewer'
      }).catch(err => console.error('Error rendering document:', err));
    }
  }, [resume, containerRef]);

  const handleDownload = () => {
    if (resume?.generatedDocument) {
      const { data } = resume.generatedDocument.base64;
      const arrayBuffer = new Uint8Array(data).buffer;
      const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = resume.generatedDocument.fileName || 'Resume.docx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 1000);
    }
  };

  return (
    <div className="resume-display-container">
              <h2 className="resume-title">Your Resume</h2> 
      <div className="resume-content">
        <div ref={setContainerRef}>
          {!resume?.generatedDocument && (
            <p>No resume available to display.</p>
          )}
        </div>
      </div>
      <button
          onClick={handleDownload}
          className="download-button"
          disabled={!resume?.generatedDocument}
        >
          Download Resume
        </button>
    </div>
  );
};

export default Resumedisplay;
