/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { fireEvent, render, waitFor } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import "regenerator-runtime/runtime";
import ProfilePage from "../../components/ProfilePage.js";

beforeAll(() => {
  global.fetch = jest.fn();
  global.fetch.mockResponseValue = function (value) {
    this.mockResolvedValue({
      json: jest.fn().mockResolvedValue(value),
    });
  };
});

describe("ProfilePage", () => {
  test("loading", async () => {
    const component = await waitFor(async () => {
      return render(<ProfilePage profile={null} />, { wrapper: MemoryRouter });
    });
    const loadingContainer =
      component.container.querySelector(".loadingContainer");
    expect(loadingContainer).not.toBe(null);
  });

  test("success", async () => {
    fetch.mockResponseValue({});
    const component = await waitFor(async () => {
      return render(
        <ProfilePage profile={createUser({ username: "Username" })} />,
        { wrapper: MemoryRouter }
      );
    });
    expect(component.container).toHaveTextContent("Edit Profile");
  });

  describe("update", () => {
    test.each`
      name           | label              | value
      ${"firstname"} | ${"First Name"}    | ${"First"}
      ${"lastname"}  | ${"Last Name"}     | ${"Last"}
      ${"email"}     | ${"Email Address"} | ${"email@example.com"}
      ${"phone"}     | ${"Phone Number"}  | ${"123-456-7890"}
    `("$name", async ({ name, label, value }) => {
      fetch.mockResponseValue({});

      const component = await waitFor(async () => {
        return render(
          <ProfilePage profile={createUser({ username: "Username" })} />,
          { wrapper: MemoryRouter }
        );
      });

      await waitFor(async () => {
        const field = component.getByLabelText(label, { exact: false });
        fireEvent.change(component.getByLabelText(label, { exact: false }), {
          target: { value },
        });
      });
      await waitFor(async () => {
        const submit = component.getByTitle("submit");
        fireEvent.submit(submit);
      });

      expect(fetch).toHaveBeenCalledWith(
        "/profile",
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ [name]: value }),
        })
      );
    });

    test("multiple", async () => {
      fetch.mockResponseValue({});

      const component = await waitFor(async () => {
        return render(
          <ProfilePage profile={createUser({ username: "Username" })} />,
          { wrapper: MemoryRouter }
        );
      });

      await waitFor(async () => {
        const firstname = component.getByLabelText("First Name", {
          exact: false,
        });
        const lastname = component.getByLabelText("Last Name", {
          exact: false,
        });
        fireEvent.change(firstname, { target: { value: "First" } });
        fireEvent.change(lastname, { target: { value: "Last" } });
      });
      await waitFor(async () => {
        const submit = component.getByTitle("submit");
        fireEvent.submit(submit);
      });

      expect(fetch).toHaveBeenCalledWith(
        "/profile",
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ firstname: "First", lastname: "Last" }),
        })
      );
    });

    test("clear", async () => {
      fetch.mockResponseValue({});

      const component = await waitFor(async () => {
        return render(
          <ProfilePage profile={createUser({ username: "Username", firstname: "First" })} />,
          { wrapper: MemoryRouter }
        );
      });

      await waitFor(async () => {
        const firstname = component.getByLabelText("First Name", {
          exact: false,
        });
        expect(firstname.value).toBe("First");
        fireEvent.change(firstname, { target: { value: "" } });
      });
      await waitFor(async () => {
        const submit = component.getByTitle("submit");
        fireEvent.submit(submit);
      });

      expect(fetch).toHaveBeenCalledWith(
        "/profile",
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ firstname: "" }),
        })
      );
    });
  });
});

function createUser({
  username,
  firstname = "",
  lastname = "",
  email = "",
  phone = "",
}) {
  return { username, firstname, lastname, email, phone };
}
