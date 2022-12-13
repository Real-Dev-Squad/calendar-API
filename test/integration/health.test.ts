import chai from "chai"
const { expect } = chai;
import chaiHttp from "chai-http"
chai.use(chaiHttp);

import app from "../../server"

describe("GET /health", function () {
  it("should return appropriate response from the healthcheck API", function (done) {
    chai
      .request(app)
      .get("/api/v1/health")
      // .get("/api/v1/health")
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("uptime").that.is.a("number");
        expect(res.body).to.have.property("uptime").that.is.a("string");

        return done();
      });
  });
});
