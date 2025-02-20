// require('dotenv').config()
const { Router } = require("express");
const PDFDocument = require('pdfkit');
const path = require('path');
const router = Router();
const fs = require('fs');
const express = require('express')
const { google } = require('googleapis')
const Groq = require("groq-sdk")

const groq = new Groq({ apiKey: process.env.GROQ_API });


async function getGroqChatCompletion(mess) {
    const chatCompletion = await groq.chat.completions.create({
    messages: mess,
    model: "llama-3.3-70b-versatile",
  });
  return chatCompletion.choices[0]?.message?.content || ""
}

async function generateAgreement(agreementDetails) {
    console.log(agreementDetails);
    const messages = [
        {
            role: "system",
            content: `You are a professional Indian Legal agreement writer. Your task it to generate an agreement based on the given details. Follow this template for generating the template: 
AASHWASAN SERVICE AGREEMENT
This Agreement ("Agreement") is made and entered into as of [Effective Date] by and between:
Service Provider: [Service Provider Name], residing at [Service Provider Address] ("Service Provider")
 Client: [Client Name], residing at [Client Address] ("Client")
 Aashwasan: Aashwasan Technologies Private Limited, located at [Aashwasan Address] ("Aashwasan" or "Mediator")
WHEREAS, the Client desires to engage the Service Provider for specific services under the terms defined herein; and
 WHEREAS, Aashwasan acts as a trusted mediator to ensure compliance with agreed terms and protect the interests of both parties.
Now, therefore, in consideration of the mutual promises contained herein, the parties agree as follows:
1. Scope of Services
The Service Provider agrees to provide the following services to the Client:
Service Description: [Detailed description of services]
Timeline: Work shall be completed by [End Date].
2. Contract Terms to be Fulfilled
The agreement is considered fulfilled only when:
 ✔ [Mention specific criteria for project completion]
 ✔ [Mention additional terms, if any]
3. Obligations of Parties
Client Obligations:
Provide necessary information, resources, and approvals for the Service Provider to complete the project.
Review and approve deliverables within [Review Period] days.
Service Provider Obligations:
Complete the services as per the agreed timeline and quality standards.
Maintain confidentiality and professionalism in all interactions.
Aashwasan’s Role:
Ensure compliance with contract terms.
Mediate disputes if necessary.
Act as an escrow agent, holding and releasing funds as per the agreement.
4. Fees and Expenses
Escrow Service Fee: Aashwasan shall charge a fee of [EscrowAgentFee], which will be deducted from the final payout.
Additional expenses shall be allocated as follows: [Expense Allocation].
5. Deposit of Funds
The Client shall deposit [Project Price] [Currency] ("Escrow Funds") with Aashwasan.
These funds will remain in escrow until the services are completed per the agreed terms.
6. Release of Funds
Upon confirmation by the Client that the service is satisfactorily completed, Aashwasan shall release the Escrow Funds to the Service Provider.
If the Client fails to respond within [Review Period] days after project completion, the funds will be automatically released unless a dispute is raised.
In the event of a dispute, the funds shall remain in escrow until resolved per Section 7 (Dispute Resolution).
7. Dispute Resolution
In case of a dispute, both parties agree to first attempt resolution through mutual discussion.
If unresolved within [Mediation Period] days, the matter shall be referred to Aashwasan for mediation.
If mediation fails, the dispute shall be resolved through binding arbitration under the Arbitration and Conciliation Act, 1996.
8. Confidentiality & Intellectual Property
All project materials and information shared shall remain confidential.
Upon full payment, intellectual property rights of the deliverables shall be transferred to the Client unless otherwise agreed in writing.
9. Termination of Agreement
Either party may terminate the agreement with a [Notice Period] days’ notice.
In case of termination, the Service Provider shall be compensated pro-rata for work completed up to that date.
If the Service Provider has not met contractual obligations, Aashwasan may withhold payment until the issue is resolved.
10. Force Majeure
Neither party shall be held liable for failure or delay in performing obligations due to circumstances beyond their control, including but not limited to natural disasters, government actions, wars, strikes, pandemics, or technological failures.
If such conditions persist for more than [Force Majeure Period] days, either party may terminate the agreement with mutual consent.
11. Governing Law
This Agreement shall be governed by and construed in accordance with the laws of India.
12. Entire Agreement & Amendments
This Agreement constitutes the entire understanding between the parties and supersedes all prior agreements or understandings, whether written or oral.
Any amendments must be made in writing and signed by all parties.
If any provision of this Agreement is found to be invalid, the remaining provisions shall remain enforceable.
IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.
Client Signature: ________________________
 Client Name: ________________________
 Date: ________________________
Service Provider Signature: ________________________
 Service Provider Name: ________________________
 Date: ________________________
            `
        },
        {
          role: "user",
          content: JSON.stringify(agreementDetails),
        },
      ];
      const response = await getGroqChatCompletion(messages);
      return response;
}

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URL;

const REFRESH_TOKEN = process.env.REFRESH_TOKEN;


const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL,
)

oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client,
})

// console.log(filepath);

const uploadflies = async (fileName,filepath)=>{
    try{
        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                mimeType: 'application/pdf',
            },
            media: {
                mimeType: 'application/pdf',
                body: fs.createReadStream(filepath)
            }
        })

        await drive.permissions.create({
            fileId: response.data.id,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        // Get the public download link
        const downloadLink = `https://drive.google.com/uc?export=download&id=${response.data.id}`;
        return { ...response.data, downloadLink };
        
    }catch(err){
        console.log(err.message)
    }
}

router.get('/generate-pdf',async (req, res) => {
    // const agreementDetails = {
    //     effectiveDate: "2023-10-01",
    //     serviceAgreementDate: "2023-09-01",
    //     client: {
    //         name: "Arjav",
    //         address: "Sector-3,Delhi"
    //     },
    //     freelancer: {
    //         name: "Sachin Sharma",
    //         address: "Sector-24,Mumbai"
    //     },
    //     escrowAgent: {
    //         name: "Aashwasan",
    //         address: "Delhi"
    //     },
    //     depositAmount: 10000,
    //     currency: "INR",
    //     reviewPeriod: 14,
    //     disputeNotificationPeriod: 7,
    //     mediationPeriod: 30,
    //     noticePeriod: 15,
    //     escrowAgentFee: "2%",
    //     expenseAllocation: "Client",
    //     jurisdiction: "INDIA",
    //     arbitrationRules: "AAA Rules"
    // };
    const agreementDetails = req.body;
    const agreement = await generateAgreement(agreementDetails);

    if(!agreement){
        res.status(500).send("Error generating agreement: ");
    }

    // const text = "This is the text content that will appear in the PDF file.";
    const pdfDirectory = path.join(__dirname, 'pdfs');

    // Create the directory if it doesn't exist
    if (!fs.existsSync(pdfDirectory)) {
        fs.mkdirSync(pdfDirectory);
    }

    // Generate a unique file name
    const fileName = `contract-${Date.now()}.pdf`;
    const filePath = path.join(pdfDirectory, fileName);

    // Create a new PDF document
    const doc = new PDFDocument();

    // Pipe the PDF to a file (save it on the server)
    doc.pipe(fs.createWriteStream(filePath));

    // Add text to the PDF
    doc.fontSize(8).text(agreement, {
        width: 500,
        align: 'left',
    });

    // Finalize the PDF
    doc.end();

    let response = await uploadflies(fileName,filePath);
    console.log(response.downloadLink);
    if(!response){
        res.status(500).send("Error no response genrated");

    }
    // let downloadLink = getDownloadLink(response.id)
    // Send back a link to download the generated file
    doc.on('finish', () => {
        res.json({
            message: 'PDF generated successfully.',
            downloadLink: `http://localhost:3000/pdfs/${fileName}`
        });
    });
    return res.json({
        message : "PDf Created",
        downloadLink : response.downloadLink,
    })
});

// Serve the PDF files statically
router.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));

module.exports = router;
