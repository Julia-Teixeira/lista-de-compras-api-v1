interface listData {
  name: string;
  quantity: string;
}
interface ListsRequest {
  listName: string;
  data: listData[];
}
interface ListResponse extends ListsRequest {
  id: number;
}

type listRequiredKeys = "listName" | "data";
type dataRequiredKeys = "name" | "quantity";

export {
  ListsRequest,
  ListResponse,
  listRequiredKeys,
  dataRequiredKeys,
  listData,
};
