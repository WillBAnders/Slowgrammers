/**
 * @jest-environment jsdom
 */

import React from "react";
import "regenerator-runtime/runtime";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { render, fireEvent, waitFor } from "@testing-library/react";
import CoursesPage from "../../components/CoursesPage.js";

beforeAll(() => {
  global.fetch = jest.fn();
  global.fetch.mockResponseValue = function (value) {
    this.mockResolvedValue({
      json: jest.fn().mockResolvedValue(value),
    });
  };
});

describe("CoursesPage", () => {
  test("loading", async () => {
    fetch.mockResponseValue({ courses: [{ code: "code", name: "Name" }] });
    await waitFor(async () => {
      const component = render(<CoursesPage />, { wrapper: MemoryRouter });
      const cards = component.queryByTestId(/buttonStack/i);
      expect(cards.children.length).toBe(0);
    });
  });

  test("fetch route", async () => {
    fetch.mockResponseValue({ courses: [] });
    const component = await waitFor(async () => {
      return render(<CoursesPage />, { wrapper: MemoryRouter });
    });
    expect(fetch).toHaveBeenCalledWith("/courses");
  });

  describe("courses", () => {
    test.each`
      name          | courses
      ${"empty"}    | ${[]}
      ${"single"}   | ${[{ code: "code", name: "Name" }]}
      ${"multiple"} | ${[{ code: "code-1", name: "First" }, { code: "code-2", name: "Second" }, { code: "code-3", name: "Third" }]}
    `("$name", async ({ courses }) => {
      fetch.mockResponseValue({ courses });
      const component = await waitFor(async () => {
        return render(<CoursesPage />, { wrapper: MemoryRouter });
      });
      const cards = component.queryByTestId(/buttonStack/i);
      expect(cards.children.length).toBe(courses.length);
    });
  });

  describe("filter", () => {
    test.each`
      name                | filter         | matched
      ${"code lowercase"} | ${"code"}      | ${true}
      ${"code uppercase"} | ${"CODE"}      | ${true}
      ${"name lowercase"} | ${"name"}      | ${true}
      ${"name uppercase"} | ${"NAME"}      | ${true}
      ${"partial"}        | ${"e"}         | ${true}
      ${"unmatched"}      | ${"unmatched"} | ${false}
    `("$name", async ({ filter, matched }) => {
      fetch.mockResponseValue({ courses: [{ code: "code", name: "Name" }] });
      const component = await waitFor(async () => {
        return render(<CoursesPage />, { wrapper: MemoryRouter });
      });
      await waitFor(() => {
        const search = component.queryByTestId(/SearchBarin/i);
        fireEvent.change(search, { target: { value: filter } });
      });
      const cards = component.queryByTestId(/buttonStack/i);
      expect(cards.children.length).toBe(matched ? 1 : 0);
    });
  });

  test("fetch rejected", async () => {
    console.error = jest.fn(); //TODO: State management
    fetch.mockRejectedValue(new Error("expected"));
    const component = await waitFor(async () => {
      return render(<CoursesPage />, { wrapper: MemoryRouter });
    });
    const cards = component.queryByTestId(/buttonStack/i);
    expect(cards.children.length).toBe(0);
    expect(console.error).toHaveBeenCalledWith("expected");
  });
});
