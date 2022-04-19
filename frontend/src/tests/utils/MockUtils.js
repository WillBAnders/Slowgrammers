const Fetch = {
  enable: function () {
    function mockResponseValue(arg1, arg2) {
      const status = arg2 !== undefined ? arg1 : 200;
      const json = arg2 ?? arg1;
      return {
        headers: {
          get: jest.fn((name) => {
            return name === "Content-Type" ? "application/json" : null;
          }),
        },
        status,
        ok: status >= 200 && status <= 299,
        json: jest.fn().mockResolvedValue(json),
      };
    }

    function fnPolyfill(/*arguments*/) {
      const fn = jest.fn(...arguments);
      fn.mockResponseValue = function (arg1, arg2) {
        this.mockReturnValue(mockResponseValue(arg1, arg2));
      };
      fn.mockResponseValueOnce = function (arg1, arg2) {
        this.mockReturnValueOnce(mockResponseValue(arg1, arg2));
      };
      return fn;
    }

    const original = global.fetch;
    beforeEach(() => {
      const fn = fnPolyfill((path, options) => {
        return (
          fetch[path]?.(options) ?? mockResponseValue(404, "Page not found.")
        );
      });
      global.fetch = new Proxy(fn, {
        get(target, p, receiver) {
          return Reflect.get(...arguments) ?? (target[p] = fnPolyfill(fn));
        },
      });
    });
    afterEach(() => {
      global.fetch = original;
    });
  },
};

export default {
  Fetch,
};
