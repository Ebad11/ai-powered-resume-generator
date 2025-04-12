const docxTemplates = {
  template1: require('../templates/template1'),
  template2: require('../templates/template2'),
  template3: require('../templates/template3')
};
const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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
            Important: Return ONLY a valid JSON array with the same structure (e.g., ["skill1", "skill2"] for skills, or [{"title": "", "description": "", "duration": ""}] for experience). 
            Do NOT include markdown formatting, code blocks, or any other text before or after the JSON array. 
            Ensure the output is valid JSON.`;

          const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
          const result = await model.generateContent(sectionPrompt);
          const responseText = result.response.text();

          // Clean and parse the response
          let cleanedResponse = responseText.trim();
          if (cleanedResponse.startsWith('```json') || cleanedResponse.startsWith('```')) {
            cleanedResponse = cleanedResponse
              .replace(/^```json\n/, '')
              .replace(/^```\n/, '')
              .replace(/\n```$/, '');
          }
          cleanedResponse = cleanedResponse.trim();
          try {
            return JSON.parse(cleanedResponse);
          } catch (parseError) {
            console.error(`JSON parse error for ${sectionName}:`, parseError);
            return data; // Fallback to original data if parsing fails
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

    // res.json({
    //   document: wordBuffer.toString('base64'),
    //   fileName: `${name.replace(/\s+/g, '_')}_resume.docx`
    // });
    const documentBase64 = wordBuffer.toString('base64');
    res.json({
      success: true,
      document: documentBase64,
      fileName: `${name.replace(/\s+/g, '_')}_resume.docx`
    });
  } catch (error) {
    console.error('Error generating resume:', error);
    res.status(500).json({ error: 'Failed to generate resume', details: error.message });
  }
};

exports.tailorResume = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.resumeData || !user.resumeData.skills || user.resumeData.skills.length === 0) {
      return res.status(400).json({ message: 'Please complete your profile by providing resume data.' });
    }

    const { position, field, template } = req.body;

    if (!position || !field) {
      return res.status(400).json({ message: 'Position and field are required.' });
    }

    if (!template || !docxTemplates[template]) {
      return res.status(400).json({ error: 'Invalid template selected.' });
    }

    // Check if a tailored resume for this position/field already exists
    let existingTailoredResume = user.tailoredResumes.find(
      tr => tr.position === position && tr.field === field
    );

    // If doesn't exist, create a new tailored resume
    if (!existingTailoredResume) {
      // Start with the generated content if it exists, otherwise use the raw resumeData
      const baseContent = user.generatedResumeContent || user.resumeData;
      const { name, skills, experience, education, projects, achievements, keywords } = user.resumeData;
      const baseProfessionalSummary = user.generatedResumeContent?.professionalSummary || '';

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // Function to clean and parse Gemini API response
      const cleanAndParseResponse = (responseText, sectionName, originalData) => {
        let cleanedResponse = responseText.trim();

        // Remove Markdown code blocks if present
        if (cleanedResponse.startsWith('```json') || cleanedResponse.startsWith('```')) {
          cleanedResponse = cleanedResponse
            .replace(/^```json\n/, '')
            .replace(/^```\n/, '')
            .replace(/\n```$/, '');
        }

        // Remove any leading/trailing whitespace
        cleanedResponse = cleanedResponse.trim();
        try {
          return JSON.parse(cleanedResponse);
        } catch (parseError) {
          console.error(`JSON parse error for ${sectionName}:`, parseError);
          return originalData; // Fallback to original data if parsing fails
        }
      };

      // Tailor skills: Highlight relevant skills and remove irrelevant ones
      const skillsPrompt = `
        Given the following skills: ${JSON.stringify(skills)},
        tailor the list for a ${position} role in the ${field} field.
        Highlight skills relevant to this position and field, and remove irrelevant ones.
        Return ONLY a valid JSON array of the tailored skills (e.g., ["skill1", "skill2"]). 
        Do NOT include markdown formatting, code blocks, or any other text before or after the JSON array. 
        Ensure the output is valid JSON.`;

      const skillsResult = await model.generateContent(skillsPrompt);
      const tailoredSkills = cleanAndParseResponse(skillsResult.response.text(), 'skills', skills);

      // Tailor experience: Rephrase to emphasize relevant experience
      const experiencePrompt = `
        Given the following professional experience: ${JSON.stringify(experience)},
        tailor the experience for a ${position} role in the ${field} field.
        Rephrase descriptions to emphasize responsibilities, achievements, and skills relevant to this position and field.
        Remove experiences that are not relevant.
        Return ONLY a valid JSON array with the same structure: [{ "title": "", "description": "", "duration": "" }].
        Do NOT include markdown formatting, code blocks, or any other text before or after the JSON array.
        Ensure the output is valid JSON.`;

      const experienceResult = await model.generateContent(experiencePrompt);
      const tailoredExperience = cleanAndParseResponse(experienceResult.response.text(), 'experience', experience);

      // Tailor projects: Highlight relevant projects
      const projectsPrompt = `
        Given the following projects: ${JSON.stringify(projects)},
        tailor the list for a ${position} role in the ${field} field.
        Highlight projects relevant to this position and field, and remove irrelevant ones.
        Rephrase descriptions to emphasize relevance.
        Return ONLY a valid JSON array with the same structure: [{ "title": "", "description": "" }].
        Do NOT include markdown formatting, code blocks, or any other text before or after the JSON array.
        Ensure the output is valid JSON.`;

      const projectsResult = await model.generateContent(projectsPrompt);
      const tailoredProjects = cleanAndParseResponse(projectsResult.response.text(), 'projects', projects);

      // Tailor achievements: Highlight relevant achievements
      const achievementsPrompt = `
        Given the following achievements: ${JSON.stringify(achievements)},
        tailor the list for a ${position} role in the ${field} field.
        Highlight achievements relevant to this position and field, and remove irrelevant ones.
        Rephrase descriptions to emphasize relevance.
        Return ONLY a valid JSON array with the same structure: [{ "title": "", "description": "" }].
        Do NOT include markdown formatting, code blocks, or any other text before or after the JSON array.
        Ensure the output is valid JSON.`;

      const achievementsResult = await model.generateContent(achievementsPrompt);
      const tailoredAchievements = cleanAndParseResponse(achievementsResult.response.text(), 'achievements', achievements);

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
      
      existingTailoredResume = tailoredResume;
    }

    // Now generate the DOCX file using the tailored resume
    const { name, email, phone } = user.resumeData;
    
    const createResumeDocument = docxTemplates[template].createResumeDocument;
    const wordBuffer = await createResumeDocument({
      name,
      email,
      phone,
      skills: existingTailoredResume.skills,
      experience: existingTailoredResume.experience,
      education: existingTailoredResume.education,
      projects: existingTailoredResume.projects,
      achievements: existingTailoredResume.achievements,
      generatedText: existingTailoredResume.professionalSummary
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename=${name.replace(/\s+/g, '_')}_${position}_resume.docx`);

    const documentBase64 = wordBuffer.toString('base64');
    
    res.json({
      success: true,
      document: documentBase64,
      fileName: `${name.replace(/\s+/g, '_')}_${position}_resume.docx`,
      message: `Resume tailored for ${position} in ${field} successfully.`
    });
  } catch (error) {
    console.error('Error tailoring resume:', error);
    res.status(500).json({ error: 'Failed to tailor resume', details: error.message });
  }
};