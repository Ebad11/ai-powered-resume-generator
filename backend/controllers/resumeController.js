const { GoogleGenerativeAI } = require('@google/generative-ai');
const docxGenerator = require('../utils/docxGenerator');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateResume = async (req, res) => {
  try {
    // Extract user data from request body
    const {
      name,
      email,
      phone,
      skills,
      experience,
      education
    } = req.body;

    // Construct prompt for resume generation
    const prompt = `Create a professional resume for ${name} with the following details:
    - Contact: ${email}, ${phone}
    - Skills: ${skills.join(', ')}
    - Professional Experience: ${JSON.stringify(experience)}
    - Education: ${JSON.stringify(education)}

    Guidelines:
    1. Format the resume in a clear, professional manner
    2. Highlight key achievements and skills
    3. Use concise, impactful language
    4. Organize content in standard resume format`;

    // Generate resume text using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const resumeText = result.response.text();
    console.log(resumeText);

    // Generate Word document
    const wordBuffer = await docxGenerator.createResumeDocument(
      {
        name,
        email,
        phone,
        skills,
        experience,
        education,
        generatedText: resumeText
      }
    );

    // Send Word file as response
    res.contentType('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename=${name.replace(/\s+/g, '_')}_resume.docx`);
    res.send(wordBuffer);

  } catch (error) {
    console.error('Resume Generation Error:', error);
    res.status(500).json({
      error: 'Failed to generate resume',
      details: error.message
    });
  }
};