import { token, bearer, apiUrl } from "./config.ts";

type FetchOptions<requestBody = any> = {
  authenticationRequired?: boolean; // Throw error if no token found in localStorage
  body?: requestBody; // Request body
  ignore400?: boolean; // Ignore 400 code and not to throw error
  ignoreFail?: boolean; // Ignore !response.ok
};

type ApiMethod = <requestBody = any, responseBody = any>(
  path: `/${string}`,
  options?: FetchOptions<requestBody>,
) => Promise<responseBody>;

class HttpClient {
  async #makeRequest<requestBody = any, responseBody = any>(
    method: "POST" | "GET" | "PUT" | "PATCH" | "DELETE",
    path: `/${string}`,
    options: FetchOptions<requestBody>,
  ): Promise<responseBody> {
    try {
      const response = await fetch(`${apiUrl}${path}`, {
        method: method,
        headers: this.#getHeaders(options),
        body: this.#getBody(options.body),
      });

      if (this.#checkFailConditions(response, options)) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      const message = err instanceof Error ? `: ${err.message}` : "";
      throw new Error(
        `Failed to complete ${method} request to ${apiUrl}${path}${message}`,
      );
    }
  }

  #getContentType(body: FetchOptions["body"]) {
    const isFormData = body instanceof FormData;
    const contentType = isFormData
      ? ""
      : typeof body !== "undefined"
        ? "application/json"
        : "";

    return contentType;
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
    return {
      Authorization: authToken,
      "Content-type": contentType,
    };
  }

  #checkAuthentication(options: FetchOptions) {
    if (options.authenticationRequired && !token) {
      throw new Error("No token found, this request requires authentication");
    }
  }

  #checkFailConditions(response: Response, options: FetchOptions) {
    const { ignore400, ignoreFail } = options;
    const failConditions: boolean[] = [];

    const c1 = !response.ok && !Boolean(ignoreFail) && response.status !== 400;
    const c2 = response.status === 400 && !Boolean(ignore400);
    failConditions.push(c1);
    failConditions.push(c2);

    return failConditions.includes(true);
  }

  get: ApiMethod = (path, options) =>
    this.#makeRequest("GET", path, options || {});

  post: ApiMethod = (path, options) =>
    this.#makeRequest("POST", path, options || {});

  put: ApiMethod = (path, options) =>
    this.#makeRequest("PUT", path, options || {});

  patch: ApiMethod = (path, options) =>
    this.#makeRequest("PATCH", path, options || {});

  delete: ApiMethod = (path, options) =>
    this.#makeRequest("DELETE", path, options || {});
}

const httpClient = new HttpClient();

export default httpClient;
