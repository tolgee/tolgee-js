import '@testing-library/jest-dom/extend-expect';
import "regenerator-runtime/runtime.js";
import "reflect-metadata"
import {container, DependencyContainer} from 'tsyringe';

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

type ImportedClassType<T, K extends keyof T> = T extends Record<K, infer S>
    ? S extends new (...args: any[]) => infer R
        ? R
        : never
    : never;

export default <B, K extends keyof ThenArg<B>>(importedModule: B, exportedClass: K) => {
    let instance: ImportedClassType<ThenArg<B>, K>;
    let childContainer: DependencyContainer;

    beforeEach(async () => {
        childContainer = container.createChildContainer();
        const ImportedClass = ((await importedModule) as ThenArg<B>)[exportedClass];
        instance = childContainer.resolve(ImportedClass as any);
    });

    afterEach(() => {
        childContainer.clearInstances();
        jest.clearAllMocks();
    });

    return () => instance;
};