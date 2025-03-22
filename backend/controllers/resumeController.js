const docxTemplates = {
  template1: require('../templates/template1'),
  template2: require('../templates/template2'),
  template3: require('../templates/template3')
};
const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Existing generateResume function
exports.generateResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.resumeData || !user.resumeData.skills || user.resumeData.skills.length === 0) {
      return res.status(400).json({ message: 'Please complete your profile by providing resume data.' });
    }

    const { template, regenerateContent = false, position, field } = req.body;

    if (!docxTemplates[template]) {
      return res.status(400).json({ error: 'Invalid template selected.' });
    }

    const { name, email, phone } = user.resumeData;

    let enhancedSkills, enhancedExperience, enhancedEducation, enhancedProjects, enhancedAchievements, professionalSummary;

    // Check if the user wants to use a tailored resume for a specific position/field
    let tailoredResume = null;
    if (position && field) {
      tailoredResume = user.tailoredResumes.find(
        tr => tr.position === position && tr.field === field
      );
    }

    if (tailoredResume) {
      // Use the tailored resume content
      enhancedSkills = tailoredResume.skills;
      enhancedExperience = tailoredResume.experience;
      enhancedEducation = tailoredResume.education;
      enhancedProjects = tailoredResume.projects;
      enhancedAchievements = tailoredResume.achievements;
      professionalSummary = tailoredResume.professionalSummary;
    } else {
      // Use the generated content or regenerate if requested
      if (user.generatedResumeContent && !regenerateContent) {
        enhancedSkills = user.generatedResumeContent.skills;
        enhancedExperience = user.generatedResumeContent.experience;
        enhancedEducation = user.generatedResumeContent.education;
        enhancedProjects = user.generatedResumeContent.projects;
        enhancedAchievements = user.generatedResumeContent.achievements;
        professionalSummary = user.generatedResumeContent.professionalSummary;
      } else {
        const enhanceSection = async (sectionName, data) => {
          if (!data || !data.length) return data;

          const sectionPrompt = `
            Enhance the language and correct any grammatical errors in the following ${sectionName} details.
            ${JSON.stringify(data, null, 2)}
            Important: Return ONLY a valid JSON array with the same structure. Do not include markdown formatting, code blocks, or any other text before or after the JSON array.`;

          const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
          const result = await model.generateContent(sectionPrompt);
          const responseText = result.response.text().trim();
          
          let cleanedResponse = responseText;
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
            return data;
          }
        };

        enhancedSkills = await enhanceSection('skills', user.resumeData.skills);
        enhancedExperience = await enhanceSection('experience', user.resumeData.experience);
        enhancedEducation = await enhanceSection('education', user.resumeData.education);
        enhancedProjects = await enhanceSection('projects', user.resumeData.projects);
        enhancedAchievements = await enhanceSection('achievements', user.resumeData.achievements);

        const summaryPrompt = `
          Create a professional summary for ${name} with the following details:
          - Skills: ${Array.isArray(enhancedSkills) ? enhancedSkills.join(', ') : 'N/A'}
          - Professional Experience: ${JSON.stringify(enhancedExperience)}
          - Education: ${JSON.stringify(enhancedEducation)}
          - Projects: ${JSON.stringify(enhancedProjects)}
          - Achievements: ${JSON.stringify(enhancedAchievements)}
          - Use these keywords in the professional summary: ${Array.isArray(user.resumeData.keywords) ? user.resumeData.keywords.join(', ') : 'N/A'}

          Guidelines:
          - Provide the output in a paragraph format in first-person POV.
          - Return ONLY the paragraph text without any additional formatting.`;

        const summaryModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const summaryResult = await summaryModel.generateContent(summaryPrompt);
        professionalSummary = summaryResult.response.text().trim();

        user.generatedResumeContent = {
          skills: enhancedSkills,
          experience: enhancedExperience,
          education: enhancedEducation,
          projects: enhancedProjects,
          achievements: enhancedAchievements,
          professionalSummary
        };
        await user.save();
      }
    }

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

// New function to tailor the resume for a specific position/field
exports.tailorResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.resumeData || !user.resumeData.skills || user.resumeData.skills.length === 0) {
      return res.status(400).json({ message: 'Please complete your profile by providing resume data.' });
    }

    const { position, field } = req.body;

    if (!position || !field) {
      return res.status(400).json({ message: 'Position and field are required.' });
    }

    // Check if a tailored resume for this position/field already exists
    const existingTailoredResume = user.tailoredResumes.find(
      tr => tr.position === position && tr.field === field
    );

    if (existingTailoredResume) {
      return res.status(400).json({ message: 'A tailored resume for this position and field already exists.' });
    }

    // Start with the generated content if it exists, otherwise use the raw resumeData
    const baseContent = user.generatedResumeContent || user.resumeData;
    const { name, skills, experience, education, projects, achievements, keywords } = user.resumeData;
    const baseProfessionalSummary = user.generatedResumeContent?.professionalSummary || '';

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Tailor skills: Highlight relevant skills and remove irrelevant ones
    const skillsPrompt = `
      Given the following skills: ${JSON.stringify(skills)},
      tailor the list for a ${position} role in the ${field} field.
      Highlight skills relevant to this position and field, and remove irrelevant ones.
      Return ONLY a valid JSON array of the tailored skills. Do not include markdown formatting, code blocks, or any other text before or after the JSON array.`;

    const skillsResult = await model.generateContent(skillsPrompt);
    const tailoredSkills = JSON.parse(skillsResult.response.text().trim());

    // Tailor experience: Rephrase to emphasize relevant experience
    const experiencePrompt = `
      Given the following professional experience: ${JSON.stringify(experience)},
      tailor the experience for a ${position} role in the ${field} field.
      Rephrase descriptions to emphasize responsibilities, achievements, and skills relevant to this position and field.
      Remove experiences that are not relevant.
      Return ONLY a valid JSON array with the same structure: [{ "title": "", "description": "", "duration": "" }].
      Do not include markdown formatting, code blocks, or any other text before or after the JSON array.`;

    const experienceResult = await model.generateContent(experiencePrompt);
    const tailoredExperience = JSON.parse(experienceResult.response.text().trim());

    // Tailor projects: Highlight relevant projects
    const projectsPrompt = `
      Given the following projects: ${JSON.stringify(projects)},
      tailor the list for a ${position} role in the ${field} field.
      Highlight projects relevant to this position and field, and remove irrelevant ones.
      Rephrase descriptions to emphasize relevance.
      Return ONLY a valid JSON array with the same structure: [{ "title": "", "description": "" }].
      Do not include markdown formatting, code blocks, or any other text before or after the JSON array.`;

    const projectsResult = await model.generateContent(projectsPrompt);
    const tailoredProjects = JSON.parse(projectsResult.response.text().trim());

    // Tailor achievements: Highlight relevant achievements
    const achievementsPrompt = `
      Given the following achievements: ${JSON.stringify(achievements)},
      tailor the list for a ${position} role in the ${field} field.
      Highlight achievements relevant to this position and field, and remove irrelevant ones.
      Rephrase descriptions to emphasize relevance.
      Return ONLY a valid JSON array with the same structure: [{ "title": "", "description": "" }].
      Do not include markdown formatting, code blocks, or any other text before or after the JSON array.`;

    const achievementsResult = await model.generateContent(achievementsPrompt);
    const tailoredAchievements = JSON.parse(achievementsResult.response.text().trim());

    // Education can remain unchanged, but you can tailor it if needed
    const tailoredEducation = baseContent.education;

    // Tailor the professional summary
    const summaryPrompt = `
      Create a professional summary for ${name} tailored for a ${position} role in the ${field} field with the following details:
      - Skills: ${JSON.stringify(tailoredSkills)}
      - Professional Experience: ${JSON.stringify(tailoredExperience)}
      - Education: ${JSON.stringify(tailoredEducation)}
      - Projects: ${JSON.stringify(tailoredProjects)}
      - Achievements: ${JSON.stringify(tailoredAchievements)}
      - Use these keywords in the professional summary: ${Array.isArray(keywords) ? keywords.join(', ') : 'N/A'}

      Guidelines:
      - Provide the output in a paragraph format in first-person POV.
      - Return ONLY the paragraph text without any additional formatting.`;

    const summaryResult = await model.generateContent(summaryPrompt);
    const tailoredProfessionalSummary = summaryResult.response.text().trim();

    // Store the tailored resume in the user's profile
    const tailoredResume = {
      position,
      field,
      skills: tailoredSkills,
      experience: tailoredExperience,
      education: tailoredEducation,
      projects: tailoredProjects,
      achievements: tailoredAchievements,
      professionalSummary: tailoredProfessionalSummary
    };

    user.tailoredResumes.push(tailoredResume);
    await user.save();

    res.status(200).json({ message: `Resume tailored for ${position} in ${field} successfully.` });
  } catch (error) {
    console.error('Error tailoring resume:', error);
    res.status(500).json({ error: 'Failed to tailor resume', details: error.message });
  }
};