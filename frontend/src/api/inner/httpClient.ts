import type {
  ApiSuccess,
  ApiBusinessError,
  ApiSystemError,
} from "@shared/api/common.js";
import { token, bearer, apiUrl } from "./config.ts";

type FetchOptions = {
  body?: any; // Request body
  authenticationRequired?: boolean; // Throw error if no token found in localStorage
  ignoreFail?: boolean; // Flag to ignore !response.ok
  ignore400?: boolean; // Flag to ignore 400 code and not to throw an error
};

type httpMethod = <responseBody = undefined, businessErrors = undefined>(
  path: `/${string}`,
  options?: FetchOptions,
) => Promise<
  businessErrors extends undefined
    ? ApiSuccess<responseBody>
    : ApiSuccess<responseBody> | ApiBusinessError<businessErrors>
>;

class HttpClient {
  async #makeRequest<responseBody = undefined, businessErrors = undefined>(
    method: "POST" | "GET" | "PUT" | "PATCH" | "DELETE",
    path: `/${string}`,
    options: FetchOptions,
  ): Promise<
    businessErrors extends undefined
      ? ApiSuccess<responseBody>
      : ApiSuccess<responseBody> | ApiBusinessError<businessErrors>
  > {
    try {
      const response = await fetch(`${apiUrl}${path}`, {
        method: method,
        headers: this.#getHeaders(options),
        body: this.#getBody(options.body),
      });

      const responseBody = await response.json();

      if (this.#checkFailConditions(response, options)) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      // Handle errors to exclude ApiSystemError from return
      if (!responseBody.success) {
        if (responseBody.errorType === "SYSTEM") {
          this.#handleSystemError(responseBody);
        }
      }

      return responseBody;
    } catch (err) {
      const message = err instanceof Error ? err.message : "No message";
      throw new Error(
        `Failed to complete ${method} request to '${apiUrl}${path}': ${message}`,
      );
    }
  }

  #handleSystemError(errorBody: ApiSystemError): never {
    const { actions, message } = errorBody;
    if (actions) {
      for (let i of actions) {
        switch (i) {
          case "DELETE_TOKEN":
            localStorage.removeItem("token");
        }
      }
    }

    throw new Error(`[API system error] - ${message || "No message"}`);
  }

  #getContentType(body: FetchOptions["body"]) {
    if (body instanceof FormData) {
      return undefined;
    }

    if (typeof body !== "undefined") {
      return "application/json";
    }

    return undefined;
  }

  #getBody(body: FetchOptions["body"]) {
    const contentType = this.#getContentType(body);
    if (contentType === "application/json") {
      return JSON.stringify(body);
    }
    return body;
  }

  #getHeaders(options: FetchOptions): Record<string, string> {
    this.#checkAuthentication(options);
    const { authenticationRequired } = options;
    const authToken = authenticationRequired ? bearer : "";
    const contentType = this.#getContentType(options.body);

    const headers: Record<string, string> = {};

    if (authToken) {
      headers["Authorization"] = authToken;
    }

    if (contentType) {
      headers["Content-type"] = contentType;
    }

    return headers;
  }
  #checkAuthentication(options: FetchOptions) {
    if (options.authenticationRequired && !token) {
      throw new Error("No token found, this request requires authentication");
    }
  }

  #checkFailConditions(response: Response, options: FetchOptions) {
    const { ignore400 } = options;
    const failConditions: boolean[] = [
      !response.ok && !Boolean(options.ignoreFail) && response.status !== 400,
      response.status === 400 && !Boolean(ignore400),
    ];

    return failConditions.includes(true);
  }

  get: httpMethod = (path, options) =>
    this.#makeRequest("GET", path, options || {});

  post: httpMethod = (path, options) =>
    this.#makeRequest("POST", path, options || {});

  put: httpMethod = (path, options) =>
    this.#makeRequest("PUT", path, options || {});

  patch: httpMethod = (path, options) =>
    this.#makeRequest("PATCH", path, options || {});

  delete: httpMethod = (path, options) =>
    this.#makeRequest("DELETE", path, options || {});
}

const httpClient = new HttpClient();

export default httpClient;
