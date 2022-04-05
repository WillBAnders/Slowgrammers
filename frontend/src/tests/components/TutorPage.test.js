/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { fireEvent, render, waitFor } from "@testing-library/react";
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "regenerator-runtime/runtime";
import CoursePage from "../../components/CoursePage.js";

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
      course: { code: "code", name: "Name" },
      tutors: [],
    });
    await waitFor(async () => {
      const component = render(<CoursePage />, { wrapper: MemoryRouter });
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
      return render(<CoursePage />, { wrapper: MemoryRouter });
    });
    expect(component).toHaveTextContent("@Username");
  });

  test("error", async () => {
    fetch.mockRejectedValue(new Error("Expected"));
    const component = await waitFor(async () => {
      return render(<CoursePage />, { wrapper: MemoryRouter });
    });
    expect(component).toHaveTextContent("Error: Expected");
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
