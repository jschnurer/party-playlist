import settings from "../settings";

/** Takes a url part (e.g. /rooms/ABCD) and appends it to the api base endpoint. */
export function getApiUrl(urlPart: string) {
    return settings.baseApiEndpoint + urlPart;
}

export const apiFetch = async (method: "GET" | "POST" | "PUT" | "DELETE",
    url: string,
    body?: any,
    headers?: any,
    abortSignal?: AbortSignal) => {
    return fetch(url, {
        signal: abortSignal,
        method,
        headers: Object.assign({
          "username": localStorage.getItem("username") || "",
        }, headers || {}),
        body,
    });
}
export const apiGetJson = (url: string, abortSignal?: AbortSignal) =>
    apiFetch("GET", url, undefined, undefined, abortSignal);

export const apiPostJson = (url: string, data: any, abortSignal?: AbortSignal) =>
    apiFetch("POST", url, JSON.stringify(data), {
        "Content-Type": "application/json",
    }, abortSignal);

export const apiPutJson = (url: string, data: any, abortSignal?: AbortSignal) =>
    apiFetch("PUT", url, JSON.stringify(data), {
        "Content-Type": "application/json",
    }, abortSignal);

export const apiDelete = (url: string, data?: any, abortSignal?: AbortSignal) =>
    apiFetch("DELETE", url, data
        ? JSON.stringify(data)
        : undefined,
        data ? {
            "Content-Type": "application/json",
        } : undefined,
        abortSignal);

export async function throwIfResponseError(response: Response) {
    if (response.status === 500) {
        await throwHttp500Error(response, "The server encountered a fatal error.");
    } else if (response.status === 400) {
        await throwResponseError(response, `The request sent to the server was invalid.`);
    } else if (response.status === 401) {
        await throwResponseError(response, "The requested resource requires authentication to access.");
    } else if (response.status === 403) {
        await throwResponseError(response, "You do not have permission to access the requested resource.");
    } else if (response.status === 404) {
        await throwResponseError(response, "The requested resource was not found.");
    } else if (response.status < 200 || response.status > 299) {
        await throwResponseError(response, `Server returned ${response.statusText}.`);
    }
}

async function throwHttp500Error(response: Response, defaultErrorMsg: string) {
    let responseText: string = "";
    try {
        responseText = await response.text();
    } catch {
        throw new Error(defaultErrorMsg);
    }

    if (responseText) {
        throw new Error(responseText.split('\n')[0]);
    }

    throw new Error(defaultErrorMsg);
}

async function throwResponseError(response: Response, defaultErrorMsg: string) {
    let jsonResponse: any;
    let textResponse: any;

    try {
        textResponse = await response.text();
        jsonResponse = JSON.parse(textResponse);
    } catch {
        throw new Error(textResponse || defaultErrorMsg);
    }

    if (isErrorValidationErrorResponse(jsonResponse)) {
        throw new Error(`${jsonResponse.title}: ${reduceValidationErrors(jsonResponse, " ")}`)
    } else if (jsonResponse.Message) {
        throw new Error(jsonResponse.Message);
    } else {
        throw new Error(defaultErrorMsg);
    }
}

export function isErrorValidationErrorResponse(error: any): error is IValidationErrorResponse {
    if (error.title !== undefined
        && error.type !== undefined
        && error.status !== undefined
        && error.errors !== undefined) {
        return true;
    }
    return false;
}

export function reduceValidationErrors(error: IValidationErrorResponse, separator: string = ' '): string {
    return Object.keys(error.errors)
        .flatMap(k => error.errors[k])
        .join(separator);
}

export function getResponseErrorMessage(err: any): string {
    if (isErrorValidationErrorResponse(err)) {
        return reduceValidationErrors(err);
    } else if (err?.message) {
        return err.message?.toString() || "";
    } else {
        return err?.toString() || "";
    }
}

export default interface IValidationErrorResponse {
    "type": string,
    "title": string,
    "status": number,
    "traceId": string,
    "errors": IValidationErrors,
}

export interface IValidationErrors {
    [property: string]: string[],
}