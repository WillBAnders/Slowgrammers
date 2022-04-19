/**
 * @jest-environment jsdom
 */

import "regenerator-runtime/runtime";
import Utils from "../../Utils";
import MockUtils from "./MockUtils";

MockUtils.Fetch.enable();

describe("Fetch", () => {
  test("mock fetch", async () => {
    fetch.mockResponseValue("body");
    const response = await Utils.fetchJson("/path");
    expect(fetch).toHaveBeenCalledWith("/path", expect.objectContaining({}));
    expect(response).toStrictEqual({ status: 200, body: "body" });
  });
  test("mock path", async () => {
    fetch["/path"].mockResponseValue("body");
    const response = await Utils.fetchJson("/path");
    expect(fetch["/path"]).toHaveBeenCalledWith(expect.objectContaining({}));
    expect(response).toStrictEqual({ status: 200, body: "body" });
  });
});
