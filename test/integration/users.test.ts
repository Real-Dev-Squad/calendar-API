import chai from 'chai';

import app from '../../server';
import { generateAuthToken } from '../../services/authService';
const { expect } = chai;

describe('Integration | Route | /users/self', function () {
  it('Get | /user/self | Error', function (done) {
    chai
      .request(app)
      .get('/api/v1/users/self')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res).to.have.status(401);
        expect(res.body.error.message).equal('Unauthenticated User');
        expect(res.body.error.statusCode).equal(401);
        expect(res.body.error.error).equal('Unauthorized');
        return done();
      });
  });

  it('GET | /user/self | Success', function (done) {
    const jwt = generateAuthToken({ userId: 12524395 });
    const cookieName = config.get('userAccessToken.cookieName');
    chai
      .request(app)
      .get('/api/v1/users/self')
      .set('Cookie', `${cookieName}=${jwt}`)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        expect(res).to.have.status(200);
        return done();
      });
  });
});
