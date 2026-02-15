import express from "express";
import { join } from "path";

const port = 3000;

export class Server {
  app: express.Application;
  constructor() {
    this.app = express();
  }
  run(): void {
    this.app.get("/", (req, res) => {
      res.send("Trade-in Chevrolet");
    });

    this.app.use("/uploads", express.static(join(process.cwd(), "uploads")));

    this.app.listen(port, () => {
      console.log("Trade-in Chevrolet Server running on port", port);
    });
  }
}
