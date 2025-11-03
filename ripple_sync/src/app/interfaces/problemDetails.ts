export interface ProblemDetails {
  status: number;
  title: string;
  detail: string;
  instance: string;
  validationErrors?: Record<string, string[]>;
}

// export function isProblemDetails(obj: any): obj is ProblemDetails {
//   return obj && typeof obj === 'object' &&
//     'status' in obj && typeof obj.status === 'number' &&
//     'title' in obj && typeof obj.title === 'string' &&
//     'detail' in obj && typeof obj.detail === 'string' &&
//     'instance' in obj && typeof obj.instance === 'string';
// }

export function parseProblemDetails(response: any): ProblemDetails | null {
    if (response && typeof response === 'object' &&
        'status' in response && typeof response.status === 'number' &&
        'title' in response && typeof response.title === 'string' &&
        'detail' in response && typeof response.detail === 'string' &&
        'type' in response && typeof response.type === 'string') {
        return response as ProblemDetails;
    }
    return null;
}