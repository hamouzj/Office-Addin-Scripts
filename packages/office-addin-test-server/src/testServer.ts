// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

import * as cors from "cors";
import * as express from "express";
import * as https from "https";
import * as devCerts from "office-addin-dev-certs";
import { EventEmitter } from "stream";

export interface ServerResponse {
  status: number;
  platform: string;
}

/* global process */

export const defaultPort: number = 4201;

export class TestServer {
  private port: number;
  private testServerStarted: boolean;
  private app: express.Express;
  private resultsEmitter: EventEmitter;
  private server: https.Server;
  private e2eTestSuitesEventName = "e2eTestSuites";
  private e2eTestResultEventName = "e2eTestResult";
  private e2eTestCompletionEventName = "e2eTestCompletion";

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.resultsEmitter = new EventEmitter();
    this.testServerStarted = false;
  }

  public async startTestServer(mochaTest: boolean = false, manifestFilePath?: string): Promise<boolean> {
    try {
      if (mochaTest) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
      }

      // create express server instance
      const options = await devCerts.getHttpsServerOptions();
      this.app.use(cors());
      this.app.use(express.json());
      this.server = https.createServer(options, this.app);

      // listen for 'ping'
      const platformName = this.getPlatformName();
      this.app.get("/ping", function (req: any, res: any) {
        res.send(platformName);
      });

      this.app.post("/testSuites", (req, res) => {
        this.resultsEmitter.emit(this.e2eTestSuitesEventName, req.body);
        res.send("200");
      });

      this.app.post("/testResult", (req, res) => {
        this.resultsEmitter.emit(this.e2eTestResultEventName, req.body);
        res.send("200");
      });

      this.app.post("/testCompletion", (req, res) => {
        this.resultsEmitter.emit(this.e2eTestCompletionEventName, req.body);
        res.send("200");
      });

      if (manifestFilePath) {
        this.app.get("/manifest.xml", function (req, res) {
          res.sendFile(manifestFilePath, {}, function (err) {
            if (err) {
              throw new Error(`Error sending manifest file.\n${err.message}`);
            }
          });
        });
      }

      // start listening on specified port
      return await this.startListening();
    } catch (err) {
      throw new Error(`Unable to start test server.\n${err}`);
    }
  }

  public async stopTestServer(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (this.testServerStarted) {
        try {
          this.server.close();
          this.testServerStarted = false;
          resolve(true);
        } catch (err) {
          reject(new Error(`Unable to stop test server.\n${err}`));
        }
      } else {
        // test server not started
        resolve(false);
      }
    });
  }

  public getTestServerState(): boolean {
    return this.testServerStarted;
  }

  public getTestServerPort(): number {
    return this.port;
  }

  public startListeningToE2ETestStatus(callback) {
    this.resultsEmitter.on(this.e2eTestResultEventName, callback);
  }

  public stopListeningToE2ETestStatus(callback) {
    this.resultsEmitter.off(this.e2eTestResultEventName, callback);
  }

  public startListeningToE2ETestSuites(callback) {
    this.resultsEmitter.once(this.e2eTestSuitesEventName, callback);
  }

  public startListeningToE2ETestCompletion(callback) {
    this.resultsEmitter.once(this.e2eTestCompletionEventName, callback);
  }

  public getPlatformName(): string {
    switch (process.platform) {
      case "win32":
        return "Windows";
      case "darwin":
        return "macOS";
      default:
        return process.platform;
    }
  }

  private async startListening(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      try {
        // set server to listen on specified port
        this.server.listen(this.port, () => {
          this.testServerStarted = true;
          resolve(true);
        });
      } catch (err) {
        reject(new Error(`Unable to start test server.\n${err}`));
      }
    });
  }
}
