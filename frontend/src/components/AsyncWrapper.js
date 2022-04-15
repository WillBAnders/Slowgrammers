import React, { useEffect } from "react";
import ErrorContainer from "./ErrorContainer";
import LoadingContainer from "./LoadingContainer";

export default function AsyncWrapper({ handler, component }) {
  const [state, setState] = React.useState({ loading: true });

  useEffect(() => {
    handler()
      .then(() => setState({}))
      .catch((error) => setState({ error }));
  }, []);

  if (state.loading) {
    return <LoadingContainer />;
  } else if (state.error) {
    return <ErrorContainer {...state.error} />;
  } else {
    return component();
  }
}
