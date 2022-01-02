import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import api from "../../../../index";


const expect = chai.expect;
let db;
let showID = '18165';
let showTitle = 'The Vampire Diaries';
let user1token;

describe("Shows endpoint", () => {
  before(() => {
    mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = mongoose.connection;
  });

  after(async () => {
    try {
      await db.dropDatabase();
    } catch (error) {
      console.log(error);
    }
  });

  beforeEach(async () => {
    //get user JWT before trying to connect to TMDB
    request(api)
      .post("/api/users?action=authenticate")
      .send({
        username: "user1",
        password: "test1",
      })
      .expect(200)
      .then((res) => {
        console.log("FETCHING TOKEN")
        expect(res.body.success).to.be.true;
        expect(res.body.token).to.not.be.undefined;
        user1token = res.body.token.substring(7);

        console.log("USER TOKEN FETCHED " + user1token)
      })
  });
  afterEach(() => {
    api.close(); // Release PORT 8080
  });

  describe("GET /api/shows/tmdb/discover ", () => {
    it("should return tmdb shows and a status 200", (done) => {

      request(api)
        .get("/api/shows/tmdb/discover")
        .set("Accept", "application/json")
        .set("Authentication", 'BEARER ' + user1token)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.a("object");
          done();
        });
    });
  });

  describe("GET /api/shows/tmdb/shows/:id", () => {
    describe("when the id is valid", () => {
      it("should return the matching show", () => {
       request(api)
          .get(`/api/shows/tmdb/shows/${showID}`)
          .set("Accept", "application/json")
          .set("Authentication", 'BEARER ' + user1token)
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.property("title",showTitle);
            
          });
      });
    });
    
    describe("when the id is invalid", () => {
      it("should return the NOT found message", () => {
       request(api)
        .get(`/api/shows/tmdb/shows/${showID}`)
        .set("Accept", "application/json")
        .set("Authentication", 'BEARER ' + user1token)
          .expect(404)
          .expect({
            status_code: 404,
            message: "The resource you requested could not be found.",
          });
      });
    });
  });


});
