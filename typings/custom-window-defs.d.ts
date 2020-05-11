// Any property defined on window needs to be added here if is not
// present on the type of window.

namespace CodeMirror {
    export class MergeView {
      edit?: {
        setValue?: (code: string) => void;
      };
      right?: {
        orig?: {
          setValue?: (code: string) => void;
        }
      };

      constructor(node: Object, options: Object);
    }
}

interface Window {
    BlobBuilder?: any;
    CodeMirror?: typeof CodeMirror;
    // Date?: any;
    HTMLElement?: HTMLElement;
    MSBlobBuilder?: any;
    MathJax?: any;
    MozBlobBuilder?: any;
    WebKitBlobBuilder?: any;
    __fixtures__?: any;
    decodeURIComponent?: (encodedURIComponent: string) => string;
    encodeURIComponent?: (decodedURIComponent: string) => string;
    opera?: any;
    ga?: Function;
}
