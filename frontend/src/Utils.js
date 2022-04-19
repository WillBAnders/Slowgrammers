async function fetchJson(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    ...options,
  });
  //TODO: Better method to ensure intermediate errors (ex. offline server) are handled
  const body = response.headers
    .get("Content-Type")
    ?.includes("application/json")
    ? await response.json()
    : await response.text();
  if (response.ok) {
    return { status: response.status, body };
  } else {
    throw { status: response.status, message: body?.error ?? body };
  }
}

export default {
  fetchJson,
};
