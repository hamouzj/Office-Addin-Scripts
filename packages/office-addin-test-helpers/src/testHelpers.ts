// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
import * as fetch from "isomorphic-fetch";
export const defaultPort: number = 4201;

export async function pingTestServer(port: number = defaultPort): Promise<object> {
  const serverResponse: any = {};
  try {
    const pingUrl: string = `https://localhost:${port}/ping`;
    const response = await fetch(pingUrl);
    serverResponse["status"] = response.status;
    const text = await response.text();
    serverResponse["platform"] = text;
    return Promise.resolve(serverResponse);
  } catch (err) {
    serverResponse["status"] = err;
    return Promise.reject(serverResponse);
  }
}

export async function GetSuites(port: number = defaultPort): Promise<object> {
        const serverResponse: any = {};
        try {
            const getSuitesUrl: string = `https://localhost:${port}/getSuites`;
            const response = await fetch(getSuitesUrl);
            serverResponse["status"] = response.status;
            const text = await response.text();
            serverResponse["suitesData"] = text;
            return Promise.resolve(serverResponse);
        } catch (err) { 
            serverResponse["status"] = err;
            return Promise.reject(serverResponse);
        }
}

export async function sendTestResults(data: object, port: number = defaultPort): Promise<boolean> {
  const url: string = `https://localhost:${port}/results/`;

  try {
    fetch(url, {
      method: "post",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    return Promise.resolve(true);
  } catch (err) {
    return Promise.reject(false);
  }
}

export async function sendSuitesResults(data: object, port: number = defaultPort): Promise<boolean> {
  const url: string = `https://localhost:${port}/suites/`;
  
  try {
    fetch(url, {
      method: "post",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    return Promise.resolve(true);
  } catch (err) {
    return Promise.reject(false);
  }
}
