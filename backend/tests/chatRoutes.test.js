import request from "supertest";
import app from "../server.js";
import Chat from "../model/chatModel.js";
import User from "../model/User.js";

describe("Chat Routes - Basic Test", () => {
  it("should return 1 channel from /getChannels", async () => {
   

    const res = await request(app).post("/chat/getChannels").send();

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.channels.length).toBe(12);  //checks the length of current testing db (it was 11 at that time)
    
  });
});
