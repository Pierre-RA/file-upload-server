import { Request, Response, Router } from 'express';
import * as fs from 'fs';
import * as multer from 'multer';
import { v4 as uuid } from 'uuid';
let pkg = require(__dirname + '/../../package.json');
const upload = multer({ dest: `./dist/uploads` });

const router = Router();

/**
 * Simple in memory storage.
 */
const files: any = {};


/**
 * GET /ask-upload
* Send a request to upload a file into chunks
 * params: - name: desired file name
 * @return an unique id
 */
router.get('/ask-upload', (req: Request, res: Response) => {
  console.log('GET /ask-upload');

  // Generate an unique id
  const id = uuid();
  files[id] = [];

  // Return the id
  res.json({
    id: id
  });
});


/**
 * POST /chunk-upload
 * Send a chunk to the server so it can be stored before being concatanated
 * body: - file: a form data field containing a blob
 *       - id: the id from /ask-upload
 *       - position: position of the chunk
 * @return a simple json response
 */
router.post('/send-chunk', upload.single('file'), (req: Request, res: Response) => {
  console.log('POST /send-chunk', req.body);

  if (!(req.body && req.file && req.file.path && req.body.id && req.body.position)) {
    return res.status(400).json({
      message: 'not enough params'
    });
  }

  // Store in memory the chunk of data
  files[req.body.id][req.body.position] = req.file.path;

  // Return a positive message
  res.json({
    message: true
  });
});


/**
 * POST /validate-upload
 * Send a a validation call to see if the file has been properly created
 * body: - chunks: amount of chunks
 *       - id: id from /ask-upload
 *       - name: desired file name
 * @return a message and an error status
 */
router.post('/validate-upload', (req: Request, res: Response) => {
  console.log('POST /validate-upload');

  // Simple param existance check
  if (!(req.body.chunks && req.body.id && req.body.name)) {
    return res.status(400).json({
      message: 'no params'
    });
  }

  // Test if all chunks have been uploaded
  if (req.body.chunks !== files[req.body.id].length) {
    return res.status(400).json({
      message: 'not the right amount of chunks ' + req.body.chunks + ' ' + files[req.body.id].length
    });
  }

  // Store on the disk the file
  // TODO: Handle already existing file
  // TODO: Remove chunks when file is written
  // XXX: Already existing files have content appened
  // XXX: Should be using async functions instead
  for (let i = 0; i < files[req.body.id].length; i++) {
    const read = fs.readFileSync(files[req.body.id][i]);
    fs.appendFileSync('./dist/files/' + req.body.name, read);
  }

  // Return a positive message
  res.json({
    message: 'done'
  });
});

export default router;