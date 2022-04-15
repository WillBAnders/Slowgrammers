async function fetchJson(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    ...options,
  });
  const body = await response.json();
  if (response.ok) {
    return { status: response.status, body };
  } else {
    throw { status: response.status, message: body.error };
  }
}

export default {
  fetchJson,
};
