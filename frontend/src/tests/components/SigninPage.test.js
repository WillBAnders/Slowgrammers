/**
 * @jest-environment jsdom
 */

import React from "react";
import "regenerator-runtime/runtime";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { render, fireEvent, waitFor } from "@testing-library/react";
import SigninPage from "../../components/SigninPage.js";
import MockUtils from "../utils/MockUtils";

MockUtils.Alert.enable("error");
MockUtils.Console.enable({ log: "silent", error: "error" });
MockUtils.Fetch.enable();

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

  describe("error", () => {
    MockUtils.Alert.enable("silent");

    test("fetch rejected", async () => {
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
});
