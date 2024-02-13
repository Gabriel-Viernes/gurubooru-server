const path = require('path')
const express = require('express')
const multer = require('multer')
const sharp = require('sharp')

function parseMimetype(mimetype) {
    switch(mimetype) {
        case "image/png":
            return ".png"
            break;
        case "image/jpeg":
            return ".jpg"
            break;
        case "image/gif":
            return ".gif"
            break;
        case "video/webm":
            return ".webm"
            break;
        default:
            return "invalid"
            break;
    }
    
}
 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //replace with cache/images/ if sharp is being used
        cb(null, 'cache/')
    },
    filename: function (req, file, cb) {
        console.log(`imgServer filename: ${req.body.filename}`)
        cb(null, `${req.body.filename}${parseMimetype(file.mimetype)}`)
    }
})
const upload = multer ({ 
    storage: storage,
    fileFilter: function fileFilter (req, file, cb) {
        if(parseMimetype(file.mimetype) === "invalid") {
            console.log('file rejected')
            cb(null, false)
        } else {
            console.log('file accepted!')
            cb(null, true)
        }
    },
    limits: {
        maxFileSize: 20000000
    }

})
const app = express()
const PORT = process.env.PORT || 3002;
app.get('/:filename', async (req, res) => {
    res.sendFile(__dirname + `/cache/${req.params.filename}`)
})

app.post('/', upload.single('upload'), async (req, res) => {
    //sharp(`./cache/images/${req.file.filename}`)
    //    .resize(500,500)
    //    .toFile(`./cache/thumbnails/thumbnail-${req.body.filename}`, (err, info) => {
    //        console.log(err)
    //    })
    res.redirect('http://localhost:3000/')
})

app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
    console.log(`=================================`)
    console.log(`Image server listening on ${PORT}`)
    console.log(`=================================`)
})


