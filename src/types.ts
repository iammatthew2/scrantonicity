export interface webSocketPayload {
  viewState?: string;
  graphDataPoints: { x: number; y: number }[];
}
