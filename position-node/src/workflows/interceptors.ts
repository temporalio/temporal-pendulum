import {
  proxySinks,
  SignalInput,
  WorkflowExecuteInput,
  WorkflowInterceptorsFactory,
  WorkflowInboundCallsInterceptor,
  QueryInput
} from '@temporalio/workflow';
import { LoggerSinks } from './sinks';

const { coverage } = proxySinks<LoggerSinks>();

class CoverageInterceptor implements WorkflowInboundCallsInterceptor {
  public async handleQuery(input: QueryInput, next: any): Promise<unknown> {
    const ret = await next(input);

    // @ts-ignore
    coverage.merge(global.__coverage__);
    // @ts-ignore
    global.__coverage__ = {};

    return ret;
  }

  public async handleSignal(input: SignalInput, next: any): Promise<void> {
    const ret = await next(input);

    // @ts-ignore
    coverage.merge(global.__coverage__);
    // @ts-ignore
    global.__coverage__ = {};

    return ret;
  }

  public async execute(input: WorkflowExecuteInput, next: any): Promise<unknown> {
    const ret = await next(input);

    // @ts-ignore
    coverage.merge(global.__coverage__);
    // @ts-ignore
    global.__coverage__ = {};

    return ret;
  }
}

// Export the interceptors
export const interceptors: WorkflowInterceptorsFactory = () => ({
  inbound: [new CoverageInterceptor()],
});