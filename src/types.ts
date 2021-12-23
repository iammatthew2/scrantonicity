import { DataItem } from 'vis-timeline/standalone';

export enum viewState {
  discrete = 'discrete',
  continuous = 'continuous',
  static = 'static'
}
export interface webSocketPayload {
  viewState?: viewState;
  graphDataPoints: DataItem[];
}
