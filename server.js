const express = require('express')
const app = express()
const fs=require('fs');
const expressLayouts = require('express-ejs-layouts')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
let firebase =require('./firebase.js');
const uploadRouter = require('./routes/upload');

// const screenRouter = require('./routes/screen')
app.set('view engine', 'ejs')
//😎
app.set('views',__dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true}));
app.use(expressLayouts)
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
var upload = require('express-fileupload');
// const dbs = firebase.firestore();
app.use(upload({
    preserveExtension: true,
    // preserveExtension: 3,
    useTempFiles : true,
    tempFileDir : 'tmp'
}))

// const firebaseConfig = {
//     apiKey: "AIzaSyCIuYSGjRWnHoZd3noAEMTr_cBPKYgP5tM",
//     authDomain: "webapp-e9ad0.firebaseapp.com",
//     projectId: "webapp-e9ad0",
//     storageBucket: "webapp-e9ad0.appspot.com",
//     messagingSenderId: "673944129236",
//     appId: "1:673944129236:web:01282509c4bba0e0a8f541",
//     measurementId: "G-F0HD1HPSDW"
//   };
  


firebase.auth.Auth.Persistence;
// firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)

let db = firebase.firestore();
db.settings({ timestampsInSnapshot: true });
app.use('/admin', uploadRouter);
app.get('/about',async (req,res)=>{
    res.render('upload/about')
})
app.get('/',async (req,res)=>{
       let data = await db.collection('videos').get();
    if(data){
        data.forEach((doc)=>{
            console.log(doc.data())
        })
        
    res.render('upload/view',{data:data});
    
    }
    // res.render('upload/view');
} )


// app.use('/screen', screenRouter);

console.log('[+] Server restarted successfully😎!')
app.listen(process.env.PORT || 3000) 

