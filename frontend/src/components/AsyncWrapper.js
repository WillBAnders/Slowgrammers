import React, { useEffect } from "react";
import ErrorContainer from "./ErrorContainer";
import LoadingContainer from "./LoadingContainer";

export default function AsyncWrapper({ handler, component: Component }) {
  const [state, setState] = React.useState({ loading: true });

  useEffect(() => {
    handler()
      .then((data) => setState({ data }))
      .catch((error) => setState({ error }));
  }, []);

  if (state.loading) {
    return <LoadingContainer />;
  } else if (state.error) {
    return <ErrorContainer {...state.error} />;
  } else {
    return <Component {...state} />;
  }
}
