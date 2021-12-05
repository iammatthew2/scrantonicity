import { DataItem } from 'vis-timeline/standalone';

export enum viewState {
  discrete,
  continuous,
  static,
}
export interface webSocketPayload {
  viewState?: viewState;
  graphDataPoints: DataItem[];
}
