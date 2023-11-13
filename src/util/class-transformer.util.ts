import {
  ClassConstructor,
  ClassTransformOptions,
  plainToInstance,
} from 'class-transformer';

export namespace ClassTransformerUtil {
  export function convert(cls: ClassConstructor<any>, target: any);
  export function convert(
    cls: ClassConstructor<any>,
    target: any,
    exclude: boolean,
  );
  export function convert(
    cls: ClassConstructor<any>,
    target: any,
    exclude: boolean,
    addOptions: Omit<ClassTransformOptions, 'excludeExtraneousValues'>,
  );
  export function convert(
    cls: ClassConstructor<any>,
    target: any,
    exclude = true,
    addOptions?: Omit<ClassTransformOptions, 'excludeExtraneousValues'>,
  ) {
    if (addOptions) {
      return plainToInstance(
        cls,
        target,
        Object.assign({ excludeExtraneousValues: true }, addOptions),
      );
    }

    return plainToInstance(cls, target, { excludeExtraneousValues: exclude });
  }
}
