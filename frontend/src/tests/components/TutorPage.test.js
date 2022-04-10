/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { render, waitFor } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import "regenerator-runtime/runtime";
import TutorPage from "../../components/TutorPage.js";

beforeAll(() => {
  global.fetch = jest.fn();
  global.fetch.mockResponseValue = function (value) {
    this.mockResolvedValue({
      json: jest.fn().mockResolvedValue(value),
    });
  };
});

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

  test("error", async () => {
    fetch.mockResponseValue({ error: "Expected" });
    const component = await waitFor(async () => {
      return render(<TutorPage />, { wrapper: MemoryRouter });
    });
    expect(component.container).toHaveTextContent("Error:Expected");
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
    user: { username, firstname, lastname, email, phone },
    bio,
    rating,
    availability,
  };
}
