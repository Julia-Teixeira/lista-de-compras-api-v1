import { ids, lists } from "./database";
import { Request, Response } from "express";
import {
  dataRequiredKeys,
  listData,
  listRequiredKeys,
  ListResponse,
} from "./interface";

const validateDataList = (payload: any): ListResponse => {
  const payloadKeys = Object.keys(payload);
  const requiredKeys: listRequiredKeys[] = ["data", "listName"];
  const dataRequiredKeys: dataRequiredKeys[] = ["name", "quantity"];

  const hasRequiredKeys: boolean = requiredKeys.every((key: string) =>
    payloadKeys.includes(key)
  );

  const hasMoreKeys: string[] = payloadKeys.filter((key: string, i) =>
    requiredKeys.every((keyReq) => keyReq !== key)
  );

  const hasRequiredDataKeys = payload.data.map(
    (item: string, index: number) => {
      const verify = dataRequiredKeys.every((key: string) =>
        Object.keys(item).includes(key)
      );

      if (verify === false) {
        throw new Error(
          `data[${index}] has missing key, they are: "name" and "quantity".`
        );
      }
    }
  );

  const hasDataMoreKeys = payload.data.map((item: string, index: number) => {
    const keys = Object.keys(item);
    const moreKey = keys.filter((key: string) =>
      dataRequiredKeys.every((keyReq) => keyReq !== key)
    );

    if (moreKey.length > 0) {
      throw new Error(`data[${index}] have extra keys, they are: ${moreKey}.`);
    }
  });

  if (typeof payload.listName !== "string") {
    throw new Error(`List name must be a string`);
  }

  payload.data.map((item: listData, index: number) => {
    if (typeof item.name !== "string") {
      throw new Error(`data[${index}]: Item name must be a string`);
    }
    if (typeof item.quantity !== "string") {
      throw new Error(`data[${index}]: Quantity must be a string`);
    }
  });

  if (hasMoreKeys.length > 0) {
    const joinedKeys: string = hasMoreKeys.join(", ");
    throw new Error(`Have extra keys, they are: ${joinedKeys}`);
  }

  if (!hasRequiredKeys) {
    const joinedKeys: string = requiredKeys.join(", ");
    throw new Error(`Required keys are: ${joinedKeys}.`);
  }

  let id: number = lists.length + 1;

  const idExists: boolean = ids.includes(id);

  if (!idExists) {
    ids.push(id);
  } else {
    id = ids[id] + 1;
    ids.push(id);
  }
  const newListData: ListResponse = {
    id: id,
    ...payload,
  };

  return newListData;
};

const CreateList = (request: Request, response: Response): Response => {
  try {
    const validate = validateDataList(request.body);
    lists.push(validate);
    return response.status(201).json(validate);
  } catch (error) {
    if (error instanceof Error) {
      return response.status(400).json({ message: error.message });
    }
    console.error(error);
    return response.status(500).json({ message: error });
  }
};

const ReadAllLists = (request: Request, response: Response): Response => {
  return response.status(200).json(lists);
};

const ReadList = (request: Request, response: Response): Response => {
  try {
    const index = request.list.indexList;
    return response.status(200).json(lists[index]);
  } catch (error) {
    if (error instanceof Error) {
      return response.status(404).json({ message: error.message });
    }
    return response.status(500).json({ message: error });
  }
};

const validateFilteredItem = (name: string, list: ListResponse): listData => {
  const item = list.data.find((item, index) => name === item.name);
  if (!item) {
    throw new Error(`Item with name ${name} does not exist`);
  }
  return item;
};

const DeleteItemList = (request: Request, response: Response): Response => {
  try {
    const index = request.list.indexList;
    const item = validateFilteredItem(request.params.name, lists[index]);
    const indexItem = lists[index].data.findIndex(
      ({ name }) => name === item.name
    );

    lists[index].data.splice(indexItem, 1);

    return response.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      return response.status(404).json({ message: error.message });
    }
    return response.status(500).json({ message: error });
  }
};

const DeleteList = (request: Request, response: Response): Response => {
  lists.splice(request.list.indexList, 1);
  return response.status(204).send();
};

const verifyType = (request: Request, response: Response) => {
  const dataRequiredKeys: dataRequiredKeys[] = ["name", "quantity"];
  const keys = Object.keys(request.body);

  if (request.body.name) {
    if (typeof request.body.name !== "string") {
      return response
        .status(400)
        .json({ message: "The name need to be a string" });
    }
  }

  if (request.body.quantity) {
    if (typeof request.body.quantity !== "string") {
      return response
        .status(400)
        .json({ message: "The quantity need to be a string" });
    }
  }

  const hasMoreKeys: string[] = keys.filter((key: string, i) =>
    dataRequiredKeys.every((keyReq) => keyReq !== key)
  );

  if (hasMoreKeys.length > 0) {
    const joinedKeys: string = hasMoreKeys.join(", ");
    return response
      .status(400)
      .json({ message: `Have extra keys, they are: ${joinedKeys}` });
  }
};

const UpdateListItem = (request: Request, response: Response): Response => {
  try {
    const indexList = request.list.indexList;
    const indexItem = request.listItem.indexListItem;

    verifyType(request, response);

    lists[indexList].data[indexItem] = {
      ...lists[indexList].data[indexItem],
      ...request.body,
    };
    return response.status(200).json(lists[indexList].data[indexItem]);
  } catch (error) {
    return response.status(500).json({ message: error });
  }
};

export {
  CreateList,
  ReadAllLists,
  ReadList,
  DeleteItemList,
  DeleteList,
  UpdateListItem,
};
