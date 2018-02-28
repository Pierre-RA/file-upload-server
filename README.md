# Chunk File Upload Server

## Installing

```
$ npm install
$ npm start
```

It will launch a server at the following address: http://localhost:3000

## Understanding

There are 3 endpoints (can be found at `./server/controllers/home.controller.ts`):

* GET /ask-upload
* POST /send-chunk
* POST /validate-upload

__Note:__ Those endpoint names can be change anytime.

Front-end will call first `GET /ask-upload` and will get an `id`.
When the `id` is received, Front-end will call several times `POST /send-chunk`. Once, the last call to `/send-chunk` is done, Front-end will call `POST /validate-upload` finishing the upload.

## License

MIT
