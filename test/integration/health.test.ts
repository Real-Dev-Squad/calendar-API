const chai = require("chai");
const { expect } = chai;
const chaiHttp = require("chai-http");
chai.use(chaiHttp);

const app = require("../../server");

describe("health", function () {
  it("should return appropriate response from the healthcheck API", function (done) {
    chai
      .request(app)
      .get("/health")
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
