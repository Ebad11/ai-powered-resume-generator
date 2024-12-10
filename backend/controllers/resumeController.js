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
        Enhance the language and correct any grammatical errors in the following ${sectionName} details:
        ${JSON.stringify(data, null, 2)}
        Provide the output as an array of the same structure with improved descriptions and don't use * before and after the output.`;

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(sectionPrompt);
      return JSON.parse(result.response.text()); // Assuming the response is valid JSON
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
      - Skills: ${enhancedSkills.join(', ')}
      - Professional Experience: ${JSON.stringify(enhancedExperience)}
      - Education: ${JSON.stringify(enhancedEducation)}
      - Projects: ${JSON.stringify(enhancedProjects)}
      - Achievements: ${JSON.stringify(enhancedAchievements)}
      - Use these keywords in the professional summary: ${keywords.join(', ')}

      Guidelines:
      - Provide the output in a paragraph format in first-person POV.`;

    // Generate professional summary
    const summaryModel = genAI.getGenerativeModel({ model: "gemini-pro" });
    const summaryResult = await summaryModel.generateContent(summaryPrompt);
    const professionalSummary = summaryResult.response.text();

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

    // Send the Word document as a response
    res.contentType('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename=${name.replace(/\s+/g, '_')}_resume.docx`);
    res.send(wordBuffer);
  } catch (error) {
    console.error('Error generating resume:', error);
    res.status(500).json({ error: 'Failed to generate resume', details: error.message });
  }
};
