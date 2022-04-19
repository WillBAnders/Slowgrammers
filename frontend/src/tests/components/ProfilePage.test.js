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

describe("ProfilePage", () => {
  test("loading", async () => {
    const component = await waitFor(async () => {
      return render(<ProfilePage profile={null} setProfile={jest.fn()} />, {
        wrapper: MemoryRouter,
      });
    });
    const loadingContainer =
      component.container.querySelector(".loadingContainer");
    expect(loadingContainer).not.toBe(null);
  });

  test("success", async () => {
    fetch.mockResponseValue({});
    const component = await waitFor(async () => {
      return render(
        <ProfilePage
          profile={createUser({ username: "Username" })}
          setProfile={jest.fn()}
        />,
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
      const setProfile = jest.fn();

      const component = await waitFor(async () => {
        return render(
          <ProfilePage
            profile={createUser({ username: "Username" })}
            setProfile={setProfile}
          />,
          { wrapper: MemoryRouter }
        );
      });

      await waitFor(async () => {
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
      expect(setProfile).toHaveBeenCalledWith(undefined);
    });

    test("multiple", async () => {
      fetch.mockResponseValue({});
      const setProfile = jest.fn();

      const component = await waitFor(async () => {
        return render(
          <ProfilePage
            profile={createUser({ username: "Username" })}
            setProfile={setProfile}
          />,
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
      expect(setProfile).toHaveBeenCalledWith(undefined);
    });

    test("clear", async () => {
      fetch.mockResponseValue({});
      const setProfile = jest.fn();

      const component = await waitFor(async () => {
        return render(
          <ProfilePage
            profile={createUser({ username: "Username", firstname: "First" })}
            setProfile={setProfile}
          />,
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
      expect(setProfile).toHaveBeenCalledWith(undefined);
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
