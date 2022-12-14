import chai from "chai";
import chaiHttp from "chai-http";

import app from "../../server";
const { expect } = chai;
chai.use(chaiHttp);

describe("CORS", function () {
  it("should allow preflight requests from all domains", function (done) {
    const origin = "https://www.rCal.com";

    chai
      .request(app)
      .options("/users")
      .set("origin", origin)
      .send()
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        expect(res).to.have.status(200);
        expect(res.body).to.eql({});
        expect(res.header).to.include({
          "access-control-allow-origin": "*",
        });

        return done();
      });
  });
});
