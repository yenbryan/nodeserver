var server = require('../server');

describe('server', function () {
  before(function () {
    server.listen(8081);
  });

  after(function () {
    server.close();
  });
});

var assert = require('assert');
var http = require('http');

describe('/', function () {
  it('should return 200', function (done) {
    http.get('http://localhost:8081', function (res) {
      assert.equal(200, res.statusCode);
      done();
    });
  });

  it('should start with <!DOCTYPE html>', function (done) {
    http.get('http://localhost:8081', function (res) {
      var data = '';

      res.on('data', function (chunk) {
        data += chunk;
      });

      res.on('end', function () {
        assert.equal('<!DOCTYPE html>', data.slice(0, 15));
        done();
      });
    });
  });
});
