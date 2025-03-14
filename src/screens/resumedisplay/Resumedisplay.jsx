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
    if (resume?.generatedDocument?.base64 && containerRef) {
      try {
        // The base64 property is the string directly
        const base64String = resume.generatedDocument.base64;
        
        // Log to debug
        console.log('Document base64 string length:', base64String.length);
        
        // Convert base64 to ArrayBuffer
        const binaryString = window.atob(base64String);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const arrayBuffer = bytes.buffer;
        
        console.log('ArrayBuffer size:', arrayBuffer.byteLength);
        
        renderAsync(arrayBuffer, containerRef, containerRef, {
          className: 'docx-viewer'
        }).catch(err => console.error('Error rendering document:', err));
      } catch (err) {
        console.error('Error processing document data:', err);
      }
    } else {
      console.log('Missing data:', {
        hasResume: !!resume,
        hasGeneratedDoc: !!(resume?.generatedDocument),
        hasBase64: !!(resume?.generatedDocument?.base64),
        hasContainerRef: !!containerRef
      });
    }
  }, [resume, containerRef]);

  const handleDownload = () => {
    if (resume?.generatedDocument?.base64) {
      try {
        const base64String = resume.generatedDocument.base64;
        
        // Convert base64 to Blob
        const binaryString = window.atob(base64String);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes], { 
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
        });

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
      } catch (err) {
        console.error('Error downloading document:', err);
      }
    } else {
      console.error('No document available to download');
    }
  };

  return (
    <div className="resume-display-container">
      <h2 className="resume-title">Your Resume</h2> 
      <div className="resume-content">
        <div ref={setContainerRef}>
          {!resume?.generatedDocument?.base64 && (
            <p>No resume available to display.</p>
          )}
        </div>
      </div>
      <button
        onClick={handleDownload}
        className="download-button"
        disabled={!resume?.generatedDocument?.base64}
      >
        Download Resume
      </button>
    </div>
  );
};

export default Resumedisplay;