const express = require('express')
let firebase =require('./../firebase.js');
const { v4: uuidv4 } = require('uuid');
let fs = require('fs');
// let googleStorage = require('@google-cloud/storage');
// const storage = googleStorage({
//     projectId: "webapp-e9ad0",
//     keyFilename: "./../firebase.js"
//   });
  
// const bucket = storage.bucket("webapp-e9ad0.appspot.com");  

// Storage
const { Storage } = require('@google-cloud/storage');
var path = require('path')

// Creates a client
const storage = new Storage({
    keyFilename: 'webapp-e9ad0-firebase-adminsdk-605sx-bd616a61af.json'
});
const bucket = storage.bucket("webapp-e9ad0.appspot.com");

let bucketName = 'webapp-e9ad0.appspot.com';


// function for image upload
function upload(localFile, remoteFile) {

    // let uuid = UUID();
    let uuid = remoteFile;
    let path = localFile;
    return bucket.upload(localFile, {
        destination: remoteFile,
        uploadType: "media",
        metadata: {
            contentType: 'image/png',
            metadata: {
                firebaseStorageDownloadTokens: uuid
            }
        }
    })
        .then((data) => {
            try {
                console.log('in unsync ---->');
                fs.unlinkSync(path)
            } catch (err) {
                console.log(err);
            }
            let file = data[0];

            console.log('ok thats file name:<><><><><><><><><><>******');
            console.log(file.name + '***********' + uuid);
            return Promise.resolve("https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" +'.'+ uuid);

        });
}

async function deleter(pa) {
    // del
    try {
        console.log('in unsync ---->****deleted');
        await fs.unlinkSync(pa)
    } catch (err) {
        console.log(err);
    }

}


//   video uploader
function uploadf(localFile, remoteFile) {
    let path = localFile;
    // let uuid = UUID();
    let uuid = remoteFile;

    return bucket.upload(localFile, {
        destination: remoteFile,
        uploadType: "media",
        metadata: {
            contentType: 'video.mp4',
            metadata: {
                firebaseStorageDownloadTokens: uuid
            }
        }
    })
        .then((data) => {
            try {
                console.log('in unsync ---->');
                fs.unlinkSync(path)
            } catch (err) {
                console.log(err);
            }

            let file = data[0];

            return Promise.resolve("https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" + +'.'+uuid);
        });
}




// const bucket = firebase.storage().bucket();
const router = express.Router()
const db = firebase.firestore();

router.get('/',async (req,res)=>{
    let data = await db.collection('videos').get();
    if(data){
        data.forEach((doc)=>{
            // console.log(doc.data())
        })
    }
    // res.send('Hello Hmmm App!')
    console.log('im in /add');
    res.render('upload/add');
})  

router.post('/upload',async (req,res)=>{
  
        let vid_url="";
        let title = req.body.title;
        var videoThumbnail = req.files.videoThumbnail.mimetype;
       
       
       
        let uuid = uuidv4();
     
        // let ext=path.extname(req.files.videoThumbnail.name);

       
        let ext = videoThumbnail.split('/')[1]
      
  
                let getter = await upload(req.files.videoThumbnail.tempFilePath, uuid);

           
                 let fileName = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(uuid) + "?alt=media&token=" + uuid+'.'+ext;
               
console.log('the video Url is )))))))))')
console.log(req.files.videoUrl)


if( req.files.videoUrl !== undefined ){
    var videoUrl = req.files.VideoUrl.mimetype;
    let ext2 = videoUrl.split('/')[1]
    let uuid2 = uuidv4();
    let getter2 = await uploadf(req.files.VideoUrl.tempFilePath, uuid2);
    vid_url = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(uuid2) + "?alt=media&token=" + uuid2+'.'+ext2;
    console.log(vid_url);


}else{
    vid_url = req.body.url;
    console.log('value of url')
    console.log(req.body.url)
    console.log('in url')
    console.log(vid_url)
}

            // update introVideoThumbnail
            setTimeout(function () {
                db.collection('videos').add({
                    id:uuidv4(),
                    videoThumbnail:fileName,
                    videoUrl: vid_url,
                    timestamp:new Date(),
                    title:title
                })
            }, 1000)

       
    
    // res.send('Hello Hmmm App!')
    res.redirect('/upload/');
})


// router.get('/view', async(req,res)=>{
    
// })



module.exports = router