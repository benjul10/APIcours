const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.schema");
const User = require("../api/users/users.model");
const articlesService = require("../api/articles/articles.service");

describe("tester API articles", () => {
  let tokenUser, tokenAdmin;
  const USER_ID = "fakeUserId";
  const ADMIN_ID = "fakeAdminId";
  const ARTICLE_ID = "fakeArticleId";

  const MOCK_USER = {
    _id: USER_ID,
    name: "Test User",
    email: "user@test.com",
    password: "hashedpassword",
    role: "member",
  };

  const MOCK_ADMIN = {
    _id: ADMIN_ID,
    name: "Test Admin",
    email: "admin@test.com",
    password: "hashedpassword",
    role: "admin",
  };

  const MOCK_ARTICLE_CREATED = {
    _id: ARTICLE_ID,
    title: "Test Article",
    content: "Test Content",
    status: "draft",
    author: USER_ID,
  };

  const MOCK_ARTICLE_UPDATED = {
    _id: ARTICLE_ID,
    title: "Updated Article",
    content: "Updated Content",
    status: "published",
    author: USER_ID,
  };

  beforeEach(() => {
    tokenUser = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
    tokenAdmin = jwt.sign({ userId: ADMIN_ID }, config.secretJwtToken);
    mockingoose(User).toReturn(MOCK_USER, "findOne");
    mockingoose(User).toReturn(MOCK_ADMIN, "findOne");
  });

  test("[Articles] Create Article - 201", async () => {
    mockingoose(Article).toReturn(MOCK_ARTICLE_CREATED, "save");

    const res = await request(app)
      .post("/api/articles")
      .send({
        title: "Test Article",
        content: "Test Content",
        status: "draft",
      })
      .set("Authorization", `Bearer ${tokenUser}`);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toBe("Test Article");
    expect(res.body.status).toBe("draft");
  });

  test("[Articles] Update Article - 200 (admin only)", async () => {
    mockingoose(Article).toReturn(MOCK_ARTICLE_UPDATED, "findOneAndUpdate");

    const res = await request(app)
      .put(`/api/articles/${ARTICLE_ID}`)
      .send({
        title: "Updated Article",
        content: "Updated Content",
        status: "published",
      })
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Article");
    expect(res.body.status).toBe("published");
  });

  test("[Articles] Delete Article - 204 (admin only)", async () => {
    mockingoose(Article).toReturn(MOCK_ARTICLE_CREATED, "findOneAndDelete");

    const res = await request(app)
      .delete(`/api/articles/${ARTICLE_ID}`)
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(res.status).toBe(204);
  });

  test("Est-ce articlesService.createArticle", async () => {
    const spy = jest
      .spyOn(articlesService, "createArticle")
      .mockImplementation(() => Promise.resolve(MOCK_ARTICLE_CREATED));
    mockingoose(User).toReturn(MOCK_USER, "findOne");

    await request(app)
      .post("/api/articles")
      .send({
        title: "Test Article",
        content: "Test Content",
        status: "draft",
      })
      .set("Authorization", `Bearer ${tokenUser}`);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    mockingoose.resetAll();
  });
});
