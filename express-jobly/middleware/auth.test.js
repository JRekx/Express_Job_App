const { UnauthorizedError } = require("../expressError");
const { authenticateJWT, ensureLoggedIn, ensureAdmin } = require("./auth");

describe("additional authenticateJWT tests", function () {
  test("returns next if no authorization header", function () {
    const req = {};
    const res = {};
    const next = jest.fn();

    authenticateJWT(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test("returns next if token is invalid", function () {
    const req = { headers: { authorization: "Bearer invalidtoken" } };
    const res = {};
    const next = jest.fn();

    authenticateJWT(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});

describe("additional ensureLoggedIn tests", function () {
  test("throws UnauthorizedError if no user", function () {
    const req = {};
    const res = {};
    const next = jest.fn();

    expect(() => {
      ensureLoggedIn(req, res, next);
    }).toThrow(UnauthorizedError);
  });
});

describe("additional ensureAdmin tests", function () {
  test("throws UnauthorizedError if no user", function () {
    const req = {};
    const res = {};
    const next = jest.fn();

    expect(() => {
      ensureAdmin(req, res, next);
    }).toThrow(UnauthorizedError);
  });

  test("throws UnauthorizedError if user is not admin", function () {
    const req = {};
    const res = { locals: { user: { isAdmin: false } } };
    const next = jest.fn();

    expect(() => {
      ensureAdmin(req, res, next);
    }).toThrow(UnauthorizedError);
  });
});
