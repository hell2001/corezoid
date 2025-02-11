const https = require('https');

module.exports = (data) => {
  return new Promise((resolve) => {
    https
      .get(data.imageUrl, (resp) => {
        const { headers } = resp;
      
        const contentType = headers['content-type'];
        if (!contentType) {
            console.error('Content-Type header is missing in the response.');
            resp.resume();
            return;
        }

        const chunks = [];
        resp.on('data', (chunk) => {
          chunks.push(chunk);
        });

        resp.on('end', () => {
          const buffer = Buffer.concat(chunks);
          data.contentType = contentType
          data.contentLength = buffer.length
          data.buffer = buffer

          resolve(data);
        });
      })
      .on('error', (err) => {
        data.err = err;
        resolve(data);
      });
  });
};