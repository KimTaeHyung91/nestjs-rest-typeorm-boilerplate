export type MutableType<T> = {
  -readonly [P in keyof T]?: T[P];
};
