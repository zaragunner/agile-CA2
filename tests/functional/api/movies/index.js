import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import Movie from "../../../../api/movies/movieModel";
import api from "../../../../index";
import movies from "../../../../seedData/movies";

const expect = chai.expect;
let db;
let user1token;

describe("Movies endpoint", () => {
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
    try {
      await Movie.deleteMany();
      await Movie.collection.insertMany(movies);
    } catch (err) {
      console.error(`failed to Load user Data: ${err}`);
    }
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

  describe("GET /api/movies/tmdb/discover ", () => {
    it("should return tmdb movies and a status 200", (done) => {

      request(api)
        .get("/api/movies/tmdb/discover")
        .set("Accept", "application/json")
        .set("Authentication", 'BEARER ' + user1token)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.a("object");
          done();

        });
    });
  });

  describe("GET /api/movies/:id", () => {
    describe("when the id is valid", () => {
      it("should return the matching movie", () => {
        return request(api)
          .get(`/api/movies/${movies[0].id}`)
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(200)
          .then((res) => {
            expect(res.body).to.have.property("title", movies[0].title);
          });
      });
    });
    describe("when the id is invalid", () => {
      it("should return the NOT found message", () => {
        return request(api)
          .get("/api/movies/9999")
          .set("Accept", "application/json")
          .expect("Content-Type", /json/)
          .expect(404)
          .expect({
            status_code: 404,
            message: "The resource you requested could not be found.",
          });
      });
    });
  });
});
