import { lists } from "./database";
import { NextFunction, Request, Response } from "express";

const ensureListExtist = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const index = lists.findIndex(({ id }) => id === parseInt(request.params.id));

  if (index === -1) {
    return response.status(404).json({
      message: `List with id "${request.params.id}" does not exist`,
    });
  }

  request.list = {
    indexList: index,
  };

  return next();
};

const ensureListItemExtist = (
  request: Request,
  response: Response,
  next: NextFunction
): Response | void => {
  const indexList = request.list.indexList;
  const index = lists[indexList].data.findIndex(
    ({ name }) => name === request.params.name
  );

  if (index === -1) {
    return response.status(404).json({
      message: `Item with name ${request.params.name}" does not exist`,
    });
  }

  request.listItem = {
    indexListItem: index,
  };

  return next();
};

export { ensureListExtist, ensureListItemExtist };
