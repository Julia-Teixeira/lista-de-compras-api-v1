import * as express from "express";

declare global {
  namespace Express {
    interface Request {
      list: {
        indexList: number;
      };
      listItem: {
        indexListItem: number;
      };
    }
  }
}
