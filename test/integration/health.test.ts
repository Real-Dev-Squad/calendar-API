import chai from "chai";
import chaiHttp from "chai-http";

import app from "../../server.js";
const { expect } = chai;
chai.use(chaiHttp);

describe("GET /health", function () {
  it("should return appropriate response from the healthcheck API", function (done) {
    chai
      .request(app)
      .get("/api/v1/health")
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("uptime").that.is.a("number");
        expect(res.body).to.have.property("version").that.is.a("string");

        return done();
      });
  });

  it("should return appropriate response from the healthcheck API at root path", function (done) {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("uptime").that.is.a("number");
        expect(res.body).to.have.property("version").that.is.a("string");

        return done();
      });
  });
});
