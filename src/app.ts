import express, { json, Application } from "express";
import {
  CreateList,
  DeleteItemList,
  ReadAllLists,
  ReadList,
  DeleteList,
  UpdateListItem,
} from "./logic";
import { ensureListExtist, ensureListItemExtist } from "./middleware";

const app: Application = express();
app.use(json());

app.post("/purchaseList", CreateList);
app.get("/purchaseList", ReadAllLists);
app.get("/purchaseList/:id", ensureListExtist, ReadList);

app.patch(
  "/purchaseList/:id/:name",
  ensureListExtist,
  ensureListItemExtist,
  UpdateListItem
);

app.delete("/purchaseList/:id/:name", ensureListExtist, DeleteItemList);
app.delete("/purchaseList/:id", ensureListExtist, DeleteList);

const PORT: number = 3000;
const runningMsg: string = `Server running on http://localhost:${PORT}`;
app.listen(PORT, () => console.log(runningMsg));
