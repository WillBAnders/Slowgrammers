/**
 * @jest-environment jsdom
 */

import React from "react";
import "regenerator-runtime/runtime";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { render, fireEvent, waitFor } from "@testing-library/react";
import SignupPage from "../../components/SignupPage.js";

beforeAll(() => {
  global.fetch = jest.fn();
  global.fetch.mockResponseValue = function (value) {
    this.mockResolvedValue({
      json: jest.fn().mockResolvedValue(value),
    });
  };
});

describe("SignupPage", () => {
  test("fetch arguments", async () => {
    fetch.mockResponseValue({});

    const component = await waitFor(async () => {
      return render(<SignupPage />, { wrapper: MemoryRouter });
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
      "/signup",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ username: "Username", password: "Password" }),
      })
    );
  });

  test("fetch resolved", async () => {
    fetch.mockResponseValue({});

    const component = await waitFor(async () => {
      return render(<SignupPage />, { wrapper: MemoryRouter });
    });

    await waitFor(async () => {
      fireEvent.submit(component.getByTitle("submit"));
    });

    //TODO: Assert result
    //expect(window.location.pathname).toBe("/");
  });

  test("fetch rejected", async () => {
    console.error = jest.fn(); //TODO: State management
    fetch.mockRejectedValue(new Error("expected"));

    const component = await waitFor(async () => {
      return render(<SignupPage />, { wrapper: MemoryRouter });
    });

    await waitFor(async () => {
      fireEvent.submit(component.getByTitle("submit"));
    });

    // expect(console.error).toHaveBeenCalledWith("expected");
    //expect(window.location.pathname).toBe("/signin");
  });
});
