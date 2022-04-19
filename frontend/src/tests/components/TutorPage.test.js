/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import "regenerator-runtime/runtime";
import TutorPage from "../../components/TutorPage.js";
import MockUtils from "../utils/MockUtils";

MockUtils.Fetch.enable();

describe("TutorPage", () => {
  test("loading", async () => {
    fetch.mockResponseValue({
      tutor: createTutor({ username: "Username" }),
      courses: [],
    });
    await waitFor(async () => {
      const component = render(<TutorPage />, { wrapper: MemoryRouter });
      const loadingContainer =
        component.container.querySelector(".loadingContainer");
      expect(loadingContainer).not.toBe(null);
    });
  });

  test("success", async () => {
    fetch.mockResponseValue({
      tutor: createTutor({ username: "Username" }),
      courses: [],
    });
    const component = await waitFor(async () => {
      return render(<TutorPage />, { wrapper: MemoryRouter });
    });
    expect(component.container).toHaveTextContent("@Username");
  });

  test("fetch reject", async () => {
    fetch.mockRejectedValue(new Error("Expected"));
    const component = await waitFor(async () => {
      return render(<TutorPage />, { wrapper: MemoryRouter });
    });
    const errorContainer = component.container.querySelector(".errorContainer");
    expect(errorContainer).not.toBe(null);
  });
});

function createTutor({
  username,
  firstname = "",
  lastname = "",
  email = "",
  phone = "",
  bio = "",
  rating = 0.0,
  availability = [],
}) {
  return {
    username,
    firstname,
    lastname,
    email,
    phone,
    bio,
    rating,
    availability,
  };
}
