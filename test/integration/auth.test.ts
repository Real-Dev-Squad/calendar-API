import chai from "chai";
import chaiHttp from "chai-http";

import app from "../../server";
const { expect } = chai;
chai.use(chaiHttp);

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
        expect(res.redirects).to.be.an("array");
        expect(res.redirects).to.have.lengthOf.at.least(1);

        return done();
      });
  });
});
