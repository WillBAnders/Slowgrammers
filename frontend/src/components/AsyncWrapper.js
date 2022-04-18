import React, { useEffect } from "react";
import ErrorContainer from "./ErrorContainer";
import LoadingContainer from "./LoadingContainer";

export default function AsyncWrapper({
  handler,
  deps = [],
  component: Component,
}) {
  const [state, setState] = React.useState({ loading: true });

  useEffect(() => {
    handler()
      .then((data) => setState({ data }))
      .catch((error) => setState({ error }));
  }, deps);

  if (state.loading) {
    return <LoadingContainer />;
  } else if (state.error) {
    return <ErrorContainer {...state.error} />;
  } else {
    return <Component {...state} />;
  }
}
