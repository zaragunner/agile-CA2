import chai from "chai";
import request from "supertest";
const mongoose = require("mongoose");
import api from "../../../../index";
import User from "../../../../api/users/userModel";


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

  beforeEach( async () => {
    try {
      await User.deleteMany();
      // Register two users
      console.log("USERS CLEARED")
      await request(api).post("/api/users?action=register").send({
        username: "user1",
        password: "test1",
      });
      await request(api).post("/api/users?action=register").send({
        username: "user2",
        password: "test2",
      });
    } catch (err) {
      console.error(`failed to Load user test Data: ${err}`);
    }
    //get user JWT before trying to connect to TMDB
    return request(api)
      .post("/api/users?action=authenticate")
      .send({
        username: "user2",
        password: "test2",
      })
      .expect(200)
      .then((res) => {
        console.log("FETCHING TOKEN")
        expect(res.body.success).to.be.true;
        expect(res.body.token).to.not.be.undefined;
        user1token = 'Bearer ' + res.body.token.substring(7);
        console.log(user1token)
            })
  });





  describe("GET /api/shows/tmdb/tvshows ", () => {
    it("should return tmdb shows and a status 200", (done) => {

      request(api)
        .get("/api/shows/tmdb/tvshows")
        .set("Accept", "application/json")
        .set("Authorization",  user1token)
        .expect(200)
        .end((err, res) => {
          expect(res.body).to.be.a("object");
          console.log(res.body)
          done();
        });
    });
  });

  describe("GET /api/shows/tmdb/tvshows/:id", () => {
    describe("when the id is valid", () => {
      it("should return the matching show", () => {
       request(api)
          .get(`/api/shows/tmdb/tvshows/${showID}`)
          .set("Accept", "application/json")
          .set("Authorization", user1token)
          .expect(200)
          .then((res) => {
            console.log(res.body)
            expect(res.body).to.have.property("title",showTitle);
         
          });
      });
    });
    
    describe("when the id is invalid", () => {
      it("should return the NOT found message", () => {
       request(api)
        .get(`/api/shows/tmdb/tvshows/0`)
        .set("Accept", "application/json")
        .set("Authorization",  user1token)
          .expect(404)
      });
    });
  });


});
