const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  convertInchesToTwip
} = require('docx');

exports.createResumeDocument = async (resumeData) => {
  const {
    name,
    email,
    phone,
    skills,
    experience,
    education,
    projects,
    achievements,
    generatedText
  } = resumeData;

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Calibri',
            size: 22
          }
        }
      }
    },
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1),
            right: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1)
          }
        }
      },
      children: [
        // Header with Name
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: name,
              bold: true,
              size: 36
            })
          ]
        }),

        // Contact Information
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: `${email} | ${phone}`,
              size: 22
            })
          ]
        }),

        // Skills Section
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [
            new TextRun({
              text: 'Skills',
              bold: true
            })
          ],
          spacing: {
            after: 100 // Adds a small space after the heading
          }
        }),
        ...skills.map(skill =>
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: skill,
                size: 22
              })
            ]
          })
        ),
        new Paragraph({}), // Extra line after the last bullet point in Skills

        // Experience Section
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [
            new TextRun({
              text: 'Professional Experience',
              bold: true
            })
          ],
          spacing: {
            after: 100 // Adds a small space after the heading
          }
        }),
        ...experience.map(exp =>
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: `${exp.title} | ${exp.description} | `,
                size: 24
              }),
              new TextRun({
                text: `${exp.duration || 'Current'}`,
                italics: true,
                size: 22
              })
            ]
          })
        ),
        new Paragraph({}), // Extra line after the last experience entry

        // Education Section
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [
            new TextRun({
              text: 'Education',
              bold: true
            })
          ],
          spacing: {
            after: 100 // Adds a small space after the heading
          }
        }),
        ...education.map(edu =>
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: `${edu.institution} | `,
                size: 24
              }),
              new TextRun({
                text: `${edu.degree} | `,
                size: 22
              }),
              new TextRun({
                text: `${edu.duration || 'Current'}`,
                italics: true,
                size: 22
              })
            ]
          })
        ),
        new Paragraph({}), // Extra line after the last education entry

        // Projects Section
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [
            new TextRun({
              text: 'Projects',
              bold: true
            })
          ],
          spacing: {
            after: 100 // Adds a small space after the heading
          }
        }),
        ...projects.map(proj =>
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: `${proj.title}: `,
                bold: true,
                size: 24
              }),
              new TextRun({
                text: proj.description,
                size: 22
              })
            ]
          })
        ),
        new Paragraph({}), // Extra line after the last project entry

        // Achievements Section
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [
            new TextRun({
              text: 'Achievements',
              bold: true
            })
          ],
          spacing: {
            after: 100 // Adds a small space after the heading
          }
        }),
        ...achievements.map(ach =>
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: `${ach.title}: `,
                size: 24
              }),
              new TextRun({
                text: ach.description,
                size: 22
              })
            ]
          })
        ),
        new Paragraph({}), // Extra line after the last achievement entry

        // AI-Generated Professional Summary
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [
            new TextRun({
              text: 'Professional Summary',
              bold: true
            })
          ],
          spacing: {
            after: 100 // Adds a small space after the heading
          }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: generatedText,
              size: 22
            })
          ]
        }),
        new Paragraph({}) // Extra line after the summary
      ]
    }]
  });

  // Generate the Word document
  return await Packer.toBuffer(doc);
};
