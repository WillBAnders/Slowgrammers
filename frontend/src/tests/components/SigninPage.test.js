/**
 * @jest-environment jsdom
 */

import React from "react";
import "regenerator-runtime/runtime";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { render, fireEvent, waitFor } from "@testing-library/react";
import SigninPage from "../../components/SigninPage.js";

beforeAll(() => {
  function mockResponseValue(value) {
    return {
      headers: {
        get: jest.fn().mockImplementation((name) => {
          return name === "Content-Type" ? "application/json" : "";
        }),
      },
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(value),
    };
  }

  global.fetch = jest.fn();
  global.fetch.mockResponseValue = function (value) {
    this.mockResolvedValue(mockResponseValue(value));
  };
  global.fetch.mockResponseValueOnce = function (value) {
    this.mockResolvedValueOnce(mockResponseValue(value));
  };
});

describe("SigninPage", () => {
  test("fetch arguments", async () => {
    fetch.mockResponseValue({});
    const setProfile = jest.fn();

    const component = await waitFor(async () => {
      return render(<SigninPage setProfile={setProfile} />, {
        wrapper: MemoryRouter,
      });
    });

    await waitFor(async () => {
      fireEvent.change(component.getByLabelText("Username", { exact: false }), {
        target: { value: "Username" },
      });
      fireEvent.change(component.getByLabelText("Password", { exact: false }), {
        target: { value: "Password" },
      });
    });

    await waitFor(async () => {
      fireEvent.submit(component.getByTitle("submit"));
    });

    expect(fetch).toHaveBeenCalledWith(
      "/signin",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ username: "Username", password: "Password" }),
      })
    );
    expect(setProfile).toHaveBeenCalledWith(undefined);
  });

  test("fetch resolved", async () => {
    fetch.mockResponseValue({});

    const component = await waitFor(async () => {
      return render(<SigninPage setProfile={jest.fn()} />, {
        wrapper: MemoryRouter,
      });
    });

    await waitFor(async () => {
      fireEvent.submit(component.getByTitle("submit"));
    });

    //TODO: Assert result
    //expect(window.location.pathname).toBe("/");
  });

  test("fetch rejected", async () => {
    global.alert = jest.fn(); //TODO: State management
    fetch.mockRejectedValue(new Error("expected"));
    const setProfile = jest.fn();

    const component = await waitFor(async () => {
      return render(<SigninPage setProfile={setProfile} />, {
        wrapper: MemoryRouter,
      });
    });

    await waitFor(async () => {
      fireEvent.submit(component.getByTitle("submit"));
    });

    expect(alert).toHaveBeenCalledWith("Error (Unexpected): expected");
    //expect(window.location.pathname).toBe("/signin");
    expect(setProfile).not.toHaveBeenCalled();
  });
});
