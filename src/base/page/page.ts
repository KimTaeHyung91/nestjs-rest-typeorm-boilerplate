export class Page<T> {
  readonly pageSize: number;
  readonly totalCount: number;
  readonly totalPage: number;
  readonly items: T[];

  private constructor(
    pageSize: number,
    totalCount: number,
    totalPage: number,
    items: T[],
  ) {
    this.pageSize = pageSize;
    this.totalCount = totalCount;
    this.totalPage = totalPage;
    this.items = items;
  }

  static of<T>(props: { pageSize: number; totalCount: number; items: T[] }) {
    return new Page(
      props.pageSize,
      props.totalCount,
      Math.ceil(props.totalCount / props.pageSize),
      props.items,
    );
  }
}
