import request from "supertest";
import App from "../../app";
import { TransactionController } from "../../controllers/transaction.controller";
import { returningService } from "../../services/transactions/returning.service";

jest.mock("../../services/transactions/returning.service");

const transactionController = new TransactionController();
describe("Transaction Controller", () => {
  const app = new App().app;

  it("should successfully return books", async () => {
    const requestBody = {
      memberId: 1,
      bookCodes: ["abc", "def"],
    };

    (returningService as jest.Mock).mockResolvedValue({
      message: "Transaction Success!",
    });

    const response = await request(app)
      .post("/api/returning")
      .send(requestBody);

    expect(response.status).toBe(200);
    expect(response.text).toBe("Transaction Success!");
  });

  it("should return error if returning service throws an error", async () => {
    const requestBody = {
      memberId: 1,
      bookCodes: ["abc"],
    };

    (returningService as jest.Mock).mockRejectedValue(
      new Error("Borrowing record not found!")
    );

    const response = await request(app)
      .post("/api/returning")
      .send(requestBody);

    expect(response.status).toBe(500);
    expect(response.text).toBe("Borrowing record not found!");
  });
});
