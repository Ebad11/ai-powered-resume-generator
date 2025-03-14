const docxTemplates = {
  template1: require('../templates/template1'),
  template2: require('../templates/template2'),
  template3: require('../templates/template3')
};
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateResume = async (req, res) => {
  try {
    const { template, name, email, phone, skills, experience, education, projects, achievements, keywords } = req.body;

    if (!docxTemplates[template]) {
      return res.status(400).json({ error: 'Invalid template selected.' });
    }

    // Define a function to enhance sections using Gemini
    const enhanceSection = async (sectionName, data) => {
      if (!data || !data.length) return data;

      const sectionPrompt = `
        Enhance the language and correct any grammatical errors in the following ${sectionName} details.
        ${JSON.stringify(data, null, 2)}
        Important: Return ONLY a valid JSON array with the same structure. Do not include markdown formatting, code blocks, or any other text before or after the JSON array.`;

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(sectionPrompt);
      const responseText = result.response.text().trim();
      
      // Clean up the response to ensure it's valid JSON
      let cleanedResponse = responseText;
      // Remove markdown code blocks if present
      if (responseText.startsWith('```json') || responseText.startsWith('```')) {
        cleanedResponse = responseText
          .replace(/^```json\n/, '')
          .replace(/^```\n/, '')
          .replace(/\n```$/, '');
      }
      
      try {
        return JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.log('Raw response:', responseText);
        // If parsing fails, return the original data
        return data;
      }
    };

    // Enhance each section
    const enhancedSkills = await enhanceSection('skills', skills);
    const enhancedExperience = await enhanceSection('experience', experience);
    const enhancedEducation = await enhanceSection('education', education);
    const enhancedProjects = await enhanceSection('projects', projects);
    const enhancedAchievements = await enhanceSection('achievements', achievements);

    // Construct the Gemini prompt for the professional summary
    const summaryPrompt = `
      Create a professional summary for ${name} with the following details:
      - Skills: ${Array.isArray(enhancedSkills) ? enhancedSkills.join(', ') : 'N/A'}
      - Professional Experience: ${JSON.stringify(enhancedExperience)}
      - Education: ${JSON.stringify(enhancedEducation)}
      - Projects: ${JSON.stringify(enhancedProjects)}
      - Achievements: ${JSON.stringify(enhancedAchievements)}
      - Use these keywords in the professional summary: ${Array.isArray(keywords) ? keywords.join(', ') : 'N/A'}

      Guidelines:
      - Provide the output in a paragraph format in first-person POV.
      - Return ONLY the paragraph text without any additional formatting.`;

    // Generate professional summary
    const summaryModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const summaryResult = await summaryModel.generateContent(summaryPrompt);
    const professionalSummary = summaryResult.response.text().trim();

    // Generate Word document using the selected template
    const createResumeDocument = docxTemplates[template].createResumeDocument;
    const wordBuffer = await createResumeDocument({
      name,
      email,
      phone,
      skills: enhancedSkills,
      experience: enhancedExperience,
      education: enhancedEducation,
      projects: enhancedProjects,
      achievements: enhancedAchievements,
      generatedText: professionalSummary
    });

    // Send both the document and the base64 string
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename=${name.replace(/\s+/g, '_')}_resume.docx`);

    res.json({
      document: wordBuffer.toString('base64'),
      fileName: `${name.replace(/\s+/g, '_')}_resume.docx`
    });
  } catch (error) {
    console.error('Error generating resume:', error);
    res.status(500).json({ error: 'Failed to generate resume', details: error.message });
  }
};