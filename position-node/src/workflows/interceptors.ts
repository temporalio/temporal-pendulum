import { WorkflowInterceptorsFactory, WorkflowInboundCallsInterceptor, QueryInput } from '@temporalio/workflow';

class CoverageInterceptor implements WorkflowInboundCallsInterceptor {
  public async handleQuery(input: QueryInput, next: any): Promise<unknown> {
    if (input.queryName === '__coverage__') {
      // @ts-ignore
      return global.__coverage__;
    }

    return await next(input);
  }
}

// Export the interceptors
export const interceptors: WorkflowInterceptorsFactory = () => ({
  inbound: [new CoverageInterceptor()],
});