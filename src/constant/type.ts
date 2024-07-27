export type ResponseType<D> = {
  statusCode: number;
  message: string;
  result: {
    data?: D | D[] | {};
    total?: number;
  };
};

export type MetaParams = {
  search: string;
  page: string;
};

export type ResponseTypeService<D> = {
  data?: D | D[];
  // statusCode?: number;
  message?: string;
};
