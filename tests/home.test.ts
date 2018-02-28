import * as request from 'supertest';
import {} from 'jest';
import { expect, should } from 'chai';
import * as app from '../server/server';

describe('GET /ask-upload', () => {
  it('should return 200 OK', () => {
    return request(app)
      .get('/ask-upload')
      .expect(200)
      .then(res => {
        expect(res.body).have.property('id');
      });
  });

  it('should return 400 not enough params', () => {
    return request(app)
      .post('/send-chunk')
      .expect(400)
      .then(res => {
        expect(res.body).have.property('message');
      });
  });

  it('should return 400 not enough params', () => {
    return request(app)
      .post('/validate-upload')
      .expect(400)
      .then(res => {
        expect(res.body).have.property('message');
      });
  });
});
