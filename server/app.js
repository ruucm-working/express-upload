var express = require('express'),
  path = require('path'),
  multer = require('multer'),
  bodyParser = require('body-parser'),
  app = express()

const cors = require('cors')
const fileUpload = require('express-fileupload')

app.use(cors())
app.use(fileUpload())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(multer({ dest: 'uploads' })) // dest is not necessary if you are happy with the default: /tmp
app.use(express.static(path.join(__dirname, 'bower_components')))

// routes
app.get('/', function(req, res) {
  res.send(
    '<html><head><title>Dropzone example</title><link href="/dropzone/downloads/css/dropzone.css" rel="stylesheet"></head><body><h1>Using Dropzone</h1><form method="post" action="/upload" class="dropzone" id="dropzone-example"><div class="fallback"><input name="file" type="file" multiple /></div></form><p><a href="/old">Old form version</a></p><script src="/dropzone/downloads/dropzone.js"></script></body></html>'
  )
})

app.get('/old', function(req, res) {
  res.send(
    '<html><head><title>Dropzone example</title><link href="/dropzone/downloads/css/dropzone.css" rel="stylesheet"></head><body><h1>Old form</h1><form method="post" action="/" id="old-example" enctype="multipart/form-data"><input name="file" type="file" multiple /><button>Save</button></form><script src="/dropzone/downloads/dropzone.js"></script></body></html>'
  )
})

app.post('/upload', (req, res, next) => {
  let file = req.files.file
  console.log('file : ', file)

  file.mv(`${__dirname}/uploads/${file.name}`, function(err) {
    if (err) {
      return res.status(500).send(err)
    }

    res.json({ file: `uploads/${file.name}` })
  })
})

var server = app.listen(8000, function() {
  var host = server.address().address,
    port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
})
