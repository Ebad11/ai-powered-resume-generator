import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import './style.css';

const Summary = () => {
  console.log('Summary component rendering');
 const navigate = useNavigate();
 const [summary, setSummary] = useState('');

 const handleSubmit = (e) => {
   e.preventDefault();
   navigate('/screen/work-experience');
 };

 return (
   <div className="personal-info-container">
     <form onSubmit={handleSubmit}>
       <section className="info-section">
         <h2 className="title">Profile Summary</h2>
         <textarea
           value={summary}
           onChange={(e) => setSummary(e.target.value)}
           className="summary-textarea"
           rows={10}
           placeholder='Use keywords to generate with GenResume..'
         />
       </section>

       <div className="button-group">
         <button type="button" className="generate-button">
           Generate <Sparkles size={20} />
         </button>
         <button type="submit" className="next2-button">
           Next <ArrowRight size={20} />
         </button>
       </div>
     </form>
   </div>
 );
};

export default Summary;