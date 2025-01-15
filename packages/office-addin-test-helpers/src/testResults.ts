export enum AssertionType {
  Unknown = "unknown",
  ToBe = "toBe",
  ToEqual = "toEqual",
  ToBeGreaterThan = "toBeGreaterThan",
  ToBeTruthy = "toBeTruthy",
  ToBeFalsy = "toBeFalsy",
  ToBeLowerThan = "toBeLowerThan",
}

interface ExpectPassed {
  passed: true;
}

export interface ExpectFailed {
  passed: false;
  assertionType: AssertionType;
  expectedValue: any;
  resultValue: any;
  diffPath?: string;
}

export type ExpectResult = ExpectPassed | ExpectFailed;

export interface TestSuite {
  id: number;
  name: string;
}

export interface TestResult {
  name: string;
  suiteId: number;
  result: ExpectResult;
}

export type TestSuites = TestSuite[];

export type TestResults = TestSuite[];

export const createFailedResultWithErrorMessage = (errorMessage: string): ExpectFailed => ({
  passed: false,
  assertionType: AssertionType.Unknown,
  expectedValue: 0,
  resultValue: errorMessage,
});

export const getFailedAssertionMessage = (result: ExpectFailed): string => {
  let message =
    `Assertion '${result.assertionType}' failed.` +
    `\n\tExpected: ${result.expectedValue}` +
    `\n\tReceived: ${result.resultValue}`;

  if (result.diffPath !== undefined) {
    message += `\n\tDifference at: ${result.diffPath}`;
  }

  return message;
};

export const createErrorTestResults = (desc: string, detail: string) => {
  return [
    {
      name: desc,
      result: createFailedResultWithErrorMessage(detail),
    },
  ];
};
