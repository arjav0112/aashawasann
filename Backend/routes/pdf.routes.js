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
            content: `You are a professional contract writer. Your task it to generate an agreement based on the given details. Follow this template for generating the template: 
ESCROW AGREEMENT

This Escrow Agreement (“Agreement”) is made effective as of [EffectiveDate] by and between:

Client: [ClientName], residing at [ClientAddress] (“Client”)
Freelancer: [FreelancerName], residing at [FreelancerAddress] (“Freelancer”)
Aashwasan: [EscrowAgentName], located at [EscrowAgentAddress] 

WHEREAS, the Client and Freelancer entered into a Service Agreement dated [ServiceAgreementDate] whereby the Freelancer shall perform certain services (“Services”) for the Client; and

WHEREAS, the parties wish to establish an escrow arrangement to secure the payment for Services rendered by the Freelancer;

NOW, THEREFORE, the parties agree as follows:

1. **Deposit of Funds**
   - The Client shall deposit an amount of [DepositAmount] [Currency] (“Escrow Funds”) with the Escrow Agent.
   - The Escrow Funds will be held until the Services are completed in accordance with the Service Agreement or until such time as other conditions specified herein are met.

2. **Release of Funds**
   - Upon confirmation by the Client that the Services have been satisfactorily completed, the Escrow Agent shall release the Escrow Funds to the Freelancer.
   - In the event of a dispute, the Escrow Funds shall remain in escrow until the dispute is resolved per Section 5.

3. **Obligations**
   - **Client:** Must deposit the funds, review the completed work within [ReviewPeriod] days, and notify the Escrow Agent of approval or dispute in writing.
   - **Freelancer:** Must perform the Services in accordance with the Service Agreement.
   - **Escrow Agent:** Shall act as a neutral party, hold the Escrow Funds securely, and release funds only in accordance with the terms set forth herein.

4. **Fees and Expenses**
   - The Escrow Agent shall charge a fee of [EscrowAgentFee]. Any additional expenses will be allocated as follows: [ExpenseAllocation].

5. **Dispute Resolution**
   - If the Client disputes the completion of Services, notice must be given to the Escrow Agent within [DisputeNotificationPeriod] days.
   - The parties agree to resolve disputes through good faith negotiations. If unresolved within [MediationPeriod] days, the dispute shall be submitted to binding arbitration in accordance with [ArbitrationRules].
   - During any dispute resolution process, the Escrow Funds shall remain with the Escrow Agent.

6. **Term and Termination**
   - This Agreement shall remain in effect until the Escrow Funds are either fully released or returned to the Client.
   - Either party may terminate this Agreement by providing [NoticePeriod] days’ written notice, subject to any outstanding obligations under the Service Agreement.

7. **Governing Law**
   - This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction].

8. **Miscellaneous**
   - This Agreement constitutes the entire understanding among the parties with respect to the subject matter herein.
   - Any amendments must be made in writing and signed by all parties.
   - If any provision of this Agreement is held to be invalid, the remaining provisions shall remain in full force and effect.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.

__________________________        __________________________        __________________________  
[ClientName]                      [FreelancerName]               [EscrowAgentName]  
Signature                         Signature                      Signature

Date: ___________________         Date: ___________________         Date: ___________________
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
    const agreementDetails = {
        effectiveDate: "2023-10-01",
        serviceAgreementDate: "2023-09-01",
        client: {
            name: "Arjav",
            address: "Sector-3,Delhi"
        },
        freelancer: {
            name: "Sachin Sharma",
            address: "Sector-24,Mumbai"
        },
        escrowAgent: {
            name: "Aashwasan",
            address: "Delhi"
        },
        depositAmount: 10000,
        currency: "INR",
        reviewPeriod: 14,
        disputeNotificationPeriod: 7,
        mediationPeriod: 30,
        noticePeriod: 15,
        escrowAgentFee: "2%",
        expenseAllocation: "Client",
        jurisdiction: "INDIA",
        arbitrationRules: "AAA Rules"
    };
    // const agreementDetails = req.body;
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
