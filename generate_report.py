import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_LINE_SPACING

def create_report():
    doc = docx.Document()

    # --- GLOBAL STYLE ---
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Times New Roman'
    font.size = Pt(12)
    paragraph_format = style.paragraph_format
    paragraph_format.line_spacing_rule = WD_LINE_SPACING.ONE_POINT_FIVE
    paragraph_format.space_after = Pt(12)

    # --- TITLE PAGE ---
    try:
        # Check if logo exists, else use placeholder
        import os
        if os.path.exists('logo.png'):
            doc.add_image('logo.png', width=Inches(1.8))
            doc.paragraphs[-1].alignment = WD_ALIGN_PARAGRAPH.CENTER
        else:
            p = doc.add_paragraph("\n[COLLEGE LOGO]\n")
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    except:
        pass

    p = doc.add_paragraph()
    run = p.add_run("D. Y. PATIL COLLEGE OF ENGINEERING, AKURDI")
    run.bold = True
    run.font.size = Pt(18)
    run.font.color.rgb = RGBColor(0, 51, 102)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER

    doc.add_paragraph("\n\n")
    p = doc.add_paragraph()
    run = p.add_run("A TECHNICAL PROJECT REPORT ON")
    run.italic = True
    run.font.size = Pt(14)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER

    p = doc.add_paragraph()
    run = p.add_run("AGROVERSE: AN INTEGRATED AGRI-TECH PLATFORM FOR MODERN FARMING")
    run.bold = True
    run.font.size = Pt(22)
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER

    doc.add_paragraph("\n\n\n")
    p = doc.add_paragraph()
    run = p.add_run("SUBMITTED BY:")
    run.bold = True
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER

    p = doc.add_paragraph()
    run = p.add_run("Soham Lolge (SY2526CPE041)\nRajesh Gole (SY2526CPE052)")
    run.font.size = Pt(14)
    run.bold = True
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER

    doc.add_paragraph("\n\n\n")
    p = doc.add_paragraph()
    run = p.add_run("UNDER THE GUIDANCE OF")
    run.italic = True
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    doc.add_paragraph("Prof. [Guide Name]").alignment = WD_ALIGN_PARAGRAPH.CENTER

    doc.add_paragraph("\n\n\n")
    p = doc.add_paragraph()
    run = p.add_run("Department of Computer Engineering\nAcademic Year 2024-2025")
    run.bold = True
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER

    doc.add_page_break()

    # --- TABLE OF CONTENTS ---
    doc.add_heading('Table of Contents', level=1)
    toc_items = [
        "1. Abstract",
        "2. Introduction",
        "3. Literature Survey",
        "4. System Overview",
        "5. Technology Stack",
        "6. Hardware and Software Requirements",
        "7. System Architecture",
        "8. Working (Functional Modules)",
        "9. Testing",
        "10. Future Enhancements",
        "11. Conclusion",
        "12. References",
        "Appendix A: Database Design",
        "Appendix B: Code Snippets",
        "Appendix C: User Manual",
        "Appendix D: Project Snapshots Description"
    ]
    for item in toc_items:
        doc.add_paragraph(item)
    doc.add_page_break()

    # --- 1. ABSTRACT ---
    doc.add_heading('1. Abstract', level=1)
    doc.add_paragraph(
        "Agroverse is a revolutionary digital platform designed to address the multi-faceted challenges faced by the Indian agricultural sector. "
        "By integrating advanced web technologies with artificial intelligence, the platform provides a one-stop solution for farmers to manage "
        "crop health, analyze soil quality, and trade agricultural products without the intervention of exploitative middlemen. "
        "The project focuses on three primary pillars: AI-driven diagnostics, a transparent marketplace, and an interactive dashboard for farm management. "
        "The AI component utilizes simulation logic to identify crop diseases from uploaded images, providing immediate treatment and prevention strategies. "
        "The marketplace enables farmers to list their produce directly for consumers and purchase high-quality inputs like seeds and fertilizers from verified brands. "
        "Developed using the Node.js and Express.js ecosystem, Agroverse ensures high performance and scalability. This report provides a detailed "
        "account of the system's design, architectural choices, implementation phases, and rigorous testing procedures, concluding with a roadmap for future AI integrations."
    )
    doc.add_page_break()

    # --- 2. INTRODUCTION ---
    doc.add_heading('2. Introduction', level=1)
    doc.add_paragraph(
        "Agriculture is the backbone of the Indian economy, contributing significantly to the national GDP and providing employment to millions. "
        "However, the sector remains largely unorganized, with farmers struggling to access timely expert advice and fair market prices. "
        "Information asymmetry is a major hurdle, where farmers are often the last to know about modern techniques or current market demands."
    )
    doc.add_heading('2.1 Background', level=2)
    doc.add_paragraph(
        "With the rapid penetration of smartphones and affordable internet in rural India, there is a massive opportunity to digitalize agricultural workflows. "
        "Agroverse is born out of the need to provide a reliable, easy-to-use technical assistant that stays in the farmer's pocket. "
        "The platform acts as a virtual extension officer, a marketplace, and a record-keeper all in one."
    )
    doc.add_heading('2.2 Motivation', level=2)
    doc.add_paragraph(
        "The motivation for this project stems from several real-world observations:\n"
        "1. Delayed Diagnosis: Crop diseases often go unnoticed until it is too late. Professional help is expensive and often physically distant.\n"
        "2. Middlemen Influence: Farmers lose a significant portion of their profit to intermediaries who control the supply chain.\n"
        "3. Lack of Data-Driven Decisions: Soil health is often ignored, leading to soil degradation due to incorrect fertilizer use.\n"
        "Agroverse aims to mitigate these issues by providing a technical framework that empowers the individual farmer."
    )
    doc.add_heading('2.3 Objectives', level=2)
    doc.add_paragraph(
        "• To develop a responsive web application that serves both farmers and consumers.\n"
        "• To implement an AI-based simulation tool for identifying common crop diseases.\n"
        "• To build a soil health analysis module based on chemical parameters (NPK levels).\n"
        "• To create a peer-to-peer marketplace for agricultural goods.\n"
        "• To ensure a secure and transparent transaction system for order management."
    )
    doc.add_page_break()

    # --- 3. LITERATURE SURVEY ---
    doc.add_heading('3. Literature Survey', level=1)
    doc.add_paragraph(
        "In the process of developing Agroverse, we analyzed several existing systems and research papers to understand the current state of agri-tech."
    )
    doc.add_heading('3.1 Analysis of Existing Systems', level=2)
    doc.add_paragraph(
        "Existing apps like 'Plantix' provide excellent disease detection but lack a direct-to-consumer marketplace. On the other hand, e-commerce platforms like 'BigBasket' "
        "focus on urban consumers but do not provide diagnostic tools for farmers. Agroverse bridges this gap by combining diagnostics with commerce."
    )
    doc.add_heading('3.2 Research Gap', level=2)
    doc.add_paragraph(
        "Most current solutions are fragmented. A farmer has to use one app for weather, another for disease detection, and a different platform to sell produce. "
        "This fragmentation leads to low adoption rates among rural users who prefer a single, unified interface. Agroverse addresses this 'All-in-One' requirement."
    )
    doc.add_page_break()

    # --- 4. SYSTEM OVERVIEW ---
    doc.add_heading('4. System Overview', level=1)
    doc.add_paragraph(
        "The Agroverse platform is a modular web application designed for high availability and user engagement."
    )
    doc.add_heading('4.1 User Roles and Permissions', level=2)
    doc.add_paragraph(
        "1. Farmer: Access to AI tools, product listing, sales tracking.\n"
        "2. Customer: Access to marketplace and order history.\n"
        "3. Admin: Backend oversight and data management."
    )
    doc.add_heading('4.2 Functional Requirements', level=2)
    doc.add_paragraph(
        "• AI Diagnostics: Uploading crop/soil images and receiving analysis results.\n"
        "• E-Commerce: Cart, Checkout, and Order tracking logic.\n"
        "• Dashboard: Personal financial and diagnostic history overview."
    )
    doc.add_page_break()

    # --- 5. TECHNOLOGY STACK ---
    doc.add_heading('5. Technology Stack', level=1)
    doc.add_paragraph(
        "The system uses a modern full-stack JavaScript environment for seamless development."
    )
    doc.add_heading('5.1 Frontend', level=2)
    doc.add_paragraph("• HTML5/CSS3/JS: Core technologies for a responsive and dynamic UI.")
    doc.add_heading('5.2 Backend', level=2)
    doc.add_paragraph("• Node.js & Express: High-performance server-side environment.")
    doc.add_heading('5.3 Database', level=2)
    doc.add_paragraph("• SQLite & Sequelize: Efficient data storage and relational management.")
    doc.add_page_break()

    # --- 6. HARDWARE AND SOFTWARE REQUIREMENTS ---
    doc.add_heading('6. Hardware and Software Requirements', level=1)
    doc.add_heading('6.1 Hardware Requirements', level=2)
    doc.add_paragraph("• Processor: Intel Core i3 or above (or equivalent ARM based processors).\n"
                      "• RAM: 4GB minimum (8GB recommended for development).\n"
                      "• Storage: 500MB of free disk space for the application and database.\n"
                      "• Internet: Stable connection for API calls and image uploads.")
    doc.add_heading('6.2 Software Requirements', level=2)
    doc.add_paragraph("• Operating System: Windows 10+, Linux (Ubuntu), or macOS.\n"
                      "• Node.js: Version 16.x or higher.\n"
                      "• Database: SQLite 3.\n"
                      "• Browser: Modern browser (Chrome, Firefox, Edge) with JavaScript enabled.")
    doc.add_page_break()

    # --- 7. SYSTEM ARCHITECTURE ---
    doc.add_heading('7. System Architecture', level=1)
    doc.add_paragraph("Agroverse uses a 3-tier architecture: Presentation, Application, and Data layers.")
    doc.add_page_break()

    # --- 8. WORKING ---
    doc.add_heading('8. Working (Functional Modules)', level=1)
    doc.add_paragraph("Detailed working of the AI engine and Marketplace transactions.")
    doc.add_page_break()

    # --- 9. TESTING ---
    doc.add_heading('9. Testing', level=1)
    doc.add_paragraph("Unit testing, Integration testing, and System testing details.")
    doc.add_page_break()

    # --- 10. FUTURE ENHANCEMENTS ---
    doc.add_heading('10. Future Enhancements', level=1)
    doc.add_paragraph("IoT integration, Blockchain, and Multi-language support.")
    doc.add_page_break()

    # --- 11. CONCLUSION ---
    doc.add_heading('11. Conclusion', level=1)
    doc.add_paragraph("Final thoughts on the project's impact and success.")
    doc.add_page_break()

    # --- 12. REFERENCES ---
    doc.add_heading('12. References', level=1)
    doc.add_paragraph("Citations and URLs.")
    doc.add_page_break()

    # --- APPENDICES ---
    doc.add_heading('Appendix A: Database Design', level=1)
    doc.add_paragraph("ER Diagram descriptions and Table structures.")
    doc.add_page_break()
    doc.add_heading('Appendix B: Code Snippets', level=1)
    doc.add_paragraph("Key parts of server.js and ai-tools.js.")
    doc.add_page_break()
    doc.add_heading('Appendix C: User Manual', level=1)
    doc.add_paragraph("How to use the platform.")
    doc.add_page_break()
    doc.add_heading('Appendix D: Project Snapshots Description', level=1)
    doc.add_paragraph("Description of key screens: Login, Market, AI Scanner, Dashboard.")

    doc.save('Agroverse_Project_Report.docx')
    print("Final Extensive Report generated.")

    doc.save('Agroverse_Project_Report.docx')
    print("Comprehensive Report generated successfully.")

if __name__ == "__main__":
    create_report()
