import chai from "chai"
const { expect } = chai;
import chaiHttp from "chai-http"
chai.use(chaiHttp);

import app from "../../server"

describe("GET /auth", function () {
  it("should redirect to google login", function (done) {
    chai
      .request(app)
      .get("/api/v1/auth/google/login")
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res).to.have.status(200);
        expect(res.redirects).to.be.an('array')
        expect(res.redirects).to.have.lengthOf.at.least(1)

        return done();
      });
  });
});
