require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./routes/auth.routes.js')
const userRouter = require('./routes/user.routes.js')
const contractRouter = require('./routes/contract.routes.js')
const fs = require('fs');
const path = require('path');
const pdfRouter = require('./routes/pdf.routes.js')



const app = express()
const MongoUrl = process.env.MONGO_URL


app.use(express.json())
app.use(express.urlencoded({extended:true}));

// Create the directory if it doesn't exist

const pdfDirectory = path.join(__dirname, 'pdfs');
if (!fs.existsSync(pdfDirectory)) {
    fs.mkdirSync(pdfDirectory);
}
// Directory to store the generated PDF files


main()
.then(()=>{console.log("connection spoted")})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MongoUrl);
}


app.use('/pdfs', express.static(pdfDirectory));


app.use('/api/auth' , authRouter)
app.use('/api/user' , userRouter)
app.use('/api/contract',contractRouter)
app.use('/api/pdf',pdfRouter)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(3000, () => {

    console.log('Server is running on port 3000')
})