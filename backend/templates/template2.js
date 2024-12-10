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
                        font: 'Georgia', // Professional and ATS-friendly
                        size: 22,
                    }
                }
            }
        },
        sections: [
            {
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
                    // Header Section with Name & Contact Info
                    new Paragraph({
                        alignment: AlignmentType.LEFT,
                        children: [
                            new TextRun({
                                text: name,
                                bold: true,
                                size: 36,
                            })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        alignment: AlignmentType.LEFT,
                        children: [
                            new TextRun({
                                text: `${email} | ${phone}`,
                                size: 18,
                            })
                        ],
                        spacing: { after: 200 }
                    }),

                    // Professional Summary
                    new Paragraph({
                        heading: HeadingLevel.HEADING_1,
                        children: [
                            new TextRun({
                                text: 'Professional Summary',
                                bold: true,
                            })
                        ],
                        spacing: { after: 100 }
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: generatedText,
                                size: 22,
                            })
                        ],
                        spacing: { after: 200 }
                    }),

                    // Skills Section
                    new Paragraph({
                        heading: HeadingLevel.HEADING_1,
                        children: [
                            new TextRun({
                                text: 'Skills',
                                bold: true,
                            })
                        ],
                        spacing: { after: 100 }
                    }),
                    ...skills.map(skill =>
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: skill,
                                    size: 22
                                })
                            ],
                            spacing: { after: 200 }
                        })
                    ),

                    // Experience Section
                    new Paragraph({
                        heading: HeadingLevel.HEADING_1,
                        children: [
                            new TextRun({
                                text: 'Professional Experience',
                                bold: true,
                            })
                        ],
                        spacing: { after: 100 }
                    }),
                    ...experience.map((exp) => [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `${exp.title} (${exp.duration || 'Current'})`,
                                    bold: true,
                                    size: 22
                                })
                            ]
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: exp.description,
                                    size: 22
                                })
                            ],
                            spacing: { after: 200 }
                        })
                    ]).flat(),

                    // Education Section
                    new Paragraph({
                        heading: HeadingLevel.HEADING_1,
                        children: [
                            new TextRun({
                                text: 'Education',
                                bold: true,
                            })
                        ],
                        spacing: { after: 100 }
                    }),
                    ...education.map((edu) =>
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `${edu.institution}, ${edu.degree} (${edu.duration || 'Current'})`,
                                    size: 22,
                                })
                            ],
                            spacing: { after: 200 }
                        })
                    ),

                    // Projects Section
                    new Paragraph({
                        heading: HeadingLevel.HEADING_1,
                        children: [
                            new TextRun({
                                text: 'Projects',
                                bold: true,
                            })
                        ],
                        spacing: { after: 100 }
                    }),
                    ...projects.map((proj) =>
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `${proj.title}: `,
                                    bold: true,
                                    size: 22,
                                }),
                                new TextRun({
                                    text: proj.description,
                                    size: 22,
                                })
                            ],
                            spacing: { after: 200 }
                        })
                    ),

                    // Achievements Section
                    new Paragraph({
                        heading: HeadingLevel.HEADING_1,
                        children: [
                            new TextRun({
                                text: 'Achievements',
                                bold: true,
                            })
                        ],
                        spacing: { after: 100 }
                    }),
                    ...achievements.map((ach) =>
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `${ach.title}: `,
                                    bold: true,
                                    size: 22,
                                }),
                                new TextRun({
                                    text: ach.description,
                                    size: 22,
                                })
                            ],
                            spacing: { after: 200 }
                        })
                    )
                ]
            }
        ]
    });

    // Generate the Word document
    return await Packer.toBuffer(doc);
};
