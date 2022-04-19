function mockDisableFunction(object, name, mode) {
  const wrapper = { original: undefined, mock: undefined };
  beforeEach(() => {
    wrapper.original = object[name];
    wrapper.mock = object[name] = jest
      .fn(mode !== "silent" ? wrapper.original : undefined)
      .mockName(name);
  });
  afterEach(() => {
    if (mode === "error") {
      expect(wrapper.mock).not.toHaveBeenCalled();
    }
    object[name] = wrapper.original;
  });
}

const Console = {
  enable: function (functions) {
    Object.entries(functions).forEach(([name, mode]) => {
      mockDisableFunction(console, name, mode);
    });
  },
};

const Alert = {
  enable: function (mode) {
    mockDisableFunction(global, "alert", mode);
  },
};

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

    function fnPolyfill(impl) {
      const fn = jest.fn(impl);
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
      }).mockName("fetch");
      global.fetch = new Proxy(fn, {
        get(target, p, receiver) {
          return (
            Reflect.get(...arguments) ??
            (target[p] = fnPolyfill(fn).mockName("fetch " + p))
          );
        },
      });
    });
    afterEach(() => {
      global.fetch = original;
    });
  },
};

export default {
  Alert,
  Console,
  Fetch,
};
