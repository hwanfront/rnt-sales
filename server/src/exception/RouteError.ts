class RouteError extends Error {
  status: number | undefined;
  constructor(message: string) {
    super(message);
  }
}

export default RouteError;