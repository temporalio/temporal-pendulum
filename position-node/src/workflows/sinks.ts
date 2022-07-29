import { Sinks } from '@temporalio/workflow';

export interface LoggerSinks extends Sinks {
  coverage: {
    merge(coverageMap: any): unknown;
  };
}