import request from "supertest";
import App from "../../app";
import { prismaMock } from "../prisma";

const requestBody = {
  memberId: 1,
  bookCodes: ["abc", "def"],
};

describe("Transaction Controller", () => {
  const app = new App().app;

  it("should transaction successfully", async () => {
    prismaMock.member.findFirst.mockResolvedValueOnce({
      id: 1,
      code: "M001",
      name: "John Doe",
      isPenalty: false,
    });

    prismaMock.borrowing.count.mockResolvedValueOnce(1);

    prismaMock.book.findMany.mockResolvedValueOnce([
      {
        code: "abc",
        stock: 1,
        title: "Book ABC",
        id: 1,
        author: "",
        isBorrowed: false,
      },
      {
        code: "def",
        stock: 1,
        title: "Book DEF",
        id: 1,
        author: "",
        isBorrowed: false,
      },
    ]);

    const response = await request(app)
      .post("/api/borrowing")
      .send(requestBody);

    expect(response.status).toBe(200);
    expect(response.text).toBe("Transaction Success!");
  });

  it("should return error if member not found", async () => {
    prismaMock.member.findFirst.mockResolvedValueOnce(null);

    const response = await request(app)
      .post("/api/borrowing")
      .send(requestBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe("Member not found!");
  });

  it("should return error if member is penalized", async () => {
    prismaMock.member.findFirst.mockResolvedValueOnce({
      id: 1,
      code: "M001",
      name: "John Doe",
      isPenalty: true,
    });

    const response = await request(app)
      .post("/api/borrowing")
      .send(requestBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe("Member is currently penalized!");
  });

  it("should return error if member has already borrowed 2 books", async () => {
    prismaMock.member.findFirst.mockResolvedValueOnce({
      id: 1,
      code: "M001",
      name: "John Doe",
      isPenalty: false,
    });

    prismaMock.borrowing.count.mockResolvedValueOnce(2);

    const response = await request(app)
      .post("/api/borrowing")
      .send(requestBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe("Member cannot borrow more than 2 books!");
  });

  it("should return error if one or more books not found", async () => {
    prismaMock.member.findFirst.mockResolvedValueOnce({
      id: 1,
      code: "M001",
      name: "John Doe",
      isPenalty: false,
    });

    prismaMock.borrowing.count.mockResolvedValueOnce(1);

    prismaMock.book.findMany.mockResolvedValueOnce([
      {
        code: "abc",
        stock: 1,
        title: "Book ABC",
        id: 0,
        author: "",
        isBorrowed: false,
      },
    ]);

    const response = await request(app)
      .post("/api/borrowing")
      .send(requestBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe("One or more books not found!");
  });

  it("should return error if book is out of stock", async () => {
    prismaMock.member.findFirst.mockResolvedValueOnce({
      id: 1,
      code: "M001",
      name: "John Doe",
      isPenalty: false,
    });

    prismaMock.borrowing.count.mockResolvedValueOnce(1);

    prismaMock.book.findMany.mockResolvedValueOnce([
      {
        code: "abc",
        stock: 0,
        title: "Book ABC",
        id: 0,
        author: "",
        isBorrowed: false,
      },
      {
        code: "def",
        stock: 1,
        title: "Book DEF",
        id: 0,
        author: "",
        isBorrowed: false,
      },
    ]);

    const response = await request(app)
      .post("/api/borrowing")
      .send(requestBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe("Book Book ABC is out of stock!");
  });
});
