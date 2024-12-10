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
            after: 100
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
        new Paragraph({}),

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
            after: 100
          }
        }),
        ...experience.map(exp =>
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: `${exp.title} | `,
                bold: true, // Title of each experience is bold
                size: 24
              }),
              new TextRun({
                text: `${exp.description} | `,
                size: 22
              }),
              new TextRun({
                text: `${exp.duration || 'Current'}`,
                italics: true,
                size: 22
              })
            ]
          })
        ),
        new Paragraph({}),

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
            after: 100
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
        new Paragraph({}),

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
            after: 100
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
        new Paragraph({}),

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
            after: 100
          }
        }),
        ...achievements.map(ach =>
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({
                text: `${ach.title}: `,
                bold: true, // Title of each achievement is bold
                size: 24
              }),
              new TextRun({
                text: ach.description,
                size: 22
              })
            ]
          })
        ),
        new Paragraph({}),

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
            after: 100
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
        new Paragraph({})
      ]
    }]
  });

  // Generate the Word document
  return await Packer.toBuffer(doc);
};
