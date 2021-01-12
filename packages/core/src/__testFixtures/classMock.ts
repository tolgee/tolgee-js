export default <T>(implementationFn: () => Partial<T>, baseConstructor?: new (...args) => any) => {
    function theMock() {
        Object.assign(this, new baseConstructor());
        Object.assign(this, implementationFn());
    }

    return jest.fn().mockImplementation(theMock);
}

