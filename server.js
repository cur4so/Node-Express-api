const app = require('./routes/app').app;

const server = app.listen(3000, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log('app listening at http://' + host + ':' + port);
});
