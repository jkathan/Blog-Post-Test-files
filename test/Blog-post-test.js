const chai = require("chai");
const chaiHttp = require("chai-http");

const expect = chai.expect;

const { app, runServer, closeServer } = require("../server");

chai.use(chaiHttp);

describe("Blog Posts", function() {
  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
});

  it("should list items on GET", function() {
  	return chai
  		.request(app)
  		.get("/blog-posts")
  		.then(function(res) {
  			expect(res).to.have.status(200);
        	expect(res).to.be.json;
        	expect(res.body).to.be.a("array");
        	expect(res.body.length).to.be.above(0);
        	res.body.forEach(function(item) {
         		expect(item).to.be.a("object");
          		expect(item).to.have.all.keys(
            		"id",
            		"title",
            		"content",
            		"author",
            		"publishDate"
          			);
				});
  			});
  		});
   it("should add a blog post on POST", function() {
   	const testrPost = {
   		title: "Title 2",
   		content: "This is a test blog post",
   		author: "Dwayne Johnson"
   	};
   	const expectedKeys = ["id", "publishDate"].concat(Object.keys(testPost));

   	return chai
   	 .request(app)
      .post("/blog-posts")
      .send(testPost)
      .then(function(res) {
       	expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a("object");
        expect(res.body).to.have.all.keys(expectedKeys);
        expect(res.body.title).to.equal(testPost.title);
        expect(res.body.content).to.equal(testPost.content);
		expect(res.body.author).to.equal(testPost.author);
		});
});
    it("should error if POST missing expected values", function() {
    const badRequestData = {};
    return chai
      .request(app)
      .post("/blog-posts")
      .send(badRequestData)
      .then(function(res) {
        expect(res).to.have.status(400);
      });
  });

  it("should update blog posts on PUT", function() {
    return (
      chai
        .request(app)
        // first have to get
        .get("/blog-posts")
        .then(function(res) {
          const updatedPost = Object.assign(res.body[0], {
            title: "Title 3",
            content: "this isa test put post"
          });
          return chai
            .request(app)
            .put(`/blog-posts/${res.body[0].id}`)
            .send(updatedPost)
            .then(function(res) {
              expect(res).to.have.status(204);
            });
        })
    );
  });

  it("should delete posts on DELETE", function() {
    return (
      chai
        .request(app)
        // first have to get
        .get("/blog-posts")
        .then(function(res) {
          return chai
            .request(app)
            .delete(`/blog-posts/${res.body[0].id}`)
            .then(function(res) {
              expect(res).to.have.status(204);
            });
        })
    );
  });
});


