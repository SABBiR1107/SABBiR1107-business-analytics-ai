declare module 'papaparse' {
  export interface ParseConfig {
    delimiter?: string;
    newline?: string;
    quoteChar?: string;
    escapeChar?: string;
    header?: boolean;
    dynamicTyping?: boolean | { [key: string]: boolean } | ((field: string | number) => boolean);
    preview?: number;
    encoding?: string;
    worker?: boolean;
    comments?: boolean | string;
    step?: (results: ParseResult<any>, parser: any) => void;
    complete?: (results: ParseResult<any>, file?: any) => void;
    error?: (error: any, file?: any) => void;
    download?: boolean;
    downloadRequestHeaders?: { [key: string]: string };
    skipEmptyLines?: boolean | 'greedy';
    fastMode?: boolean;
    withCredentials?: boolean;
  }

  export interface ParseResult<T> {
    data: T[];
    errors: any[];
    meta: {
      delimiter: string;
      linebreak: string;
      aborted: boolean;
      truncated: boolean;
      cursor: number;
      fields?: string[];
    };
  }

  export function parse<T = any>(
    csvString: string,
    config?: ParseConfig
  ): ParseResult<T>;

  const Papa: {
    parse: typeof parse;
  };

  export default Papa;
}
