import { useRouteError } from "react-router-dom";

export const ErrorBoundary = () => {
  const error = useRouteError();
  console.error("Route error:", error);

  return (
    <div className="container mx-auto py-10">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
    </div>
  );
};
