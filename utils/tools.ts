//@ts-ignore
export const fetcher = (...args: Array<any>) => fetch(...args).then((res) => res.json());
