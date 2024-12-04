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
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: skills.join(' • '),
              size: 22
            })
          ]
        }),

        // Experience Section
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [
            new TextRun({
              text: 'Professional Experience',
              bold: true
            })
          ]
        }),
        ...experience.map(exp => 
          new Paragraph({
            children: [
              new TextRun({
                text: `${exp.company} - ${exp.role}`,
                bold: true,
                size: 24
              }),
              new TextRun({
                text: `\n${exp.duration || 'Current'}`,
                italics: true,
                size: 22
              })
            ]
          })
        ),

        // Education Section
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [
            new TextRun({
              text: 'Education',
              bold: true
            })
          ]
        }),
        ...education.map(edu => 
          new Paragraph({
            children: [
              new TextRun({
                text: `${edu.institution}`,
                bold: true,
                size: 24
              }),
              new TextRun({
                text: `\n${edu.degree}, ${edu.graduationYear}`,
                size: 22
              })
            ]
          })
        ),

        // AI-Generated Professional Summary
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [
            new TextRun({
              text: 'Professional Summary',
              bold: true
            })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: generatedText,
              size: 22
            })
          ]
        })
      ]
    }]
  });

  // Generate the Word document
  return await Packer.toBuffer(doc);
};