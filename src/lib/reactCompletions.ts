import { CompletionContext, type CompletionResult, autocompletion, acceptCompletion, type Completion } from "@codemirror/autocomplete";
import { keymap } from "@codemirror/view";

const reactAttributeSnippets: Completion[] = [
  {
    label: "class",
    apply: "className",
    detail: "React className attribute",
    type: "property",
  },
  {
    label: "for",
    apply: "htmlFor",
    detail: "React htmlFor attribute",
    type: "property",
  },
  {
    label: "onclick",
    apply: "onClick",
    detail: "React onClick event handler",
    type: "property",
  },
  {
    label: "onchange",
    apply: "onChange",
    detail: "React onChange event handler",
    type: "property",
  },
  {
    label: "onfocus",
    apply: "onFocus",
    detail: "React onFocus event handler",
    type: "property",
  },
  {
    label: "onblur",
    apply: "onBlur",
    detail: "React onBlur event handler",
    type: "property",
  },
  {
    label: "onsubmit",
    apply: "onSubmit",
    detail: "React onSubmit event handler",
    type: "property",
  },
  {
    label: "onkeydown",
    apply: "onKeyDown",
    detail: "React onKeyDown event handler",
    type: "property",
  },
  {
    label: "onkeyup",
    apply: "onKeyUp",
    detail: "React onKeyUp event handler",
    type: "property",
  },
  {
    label: "onmouseenter",
    apply: "onMouseEnter",
    detail: "React onMouseEnter event handler",
    type: "property",
  },
  {
    label: "onmouseleave",
    apply: "onMouseLeave",
    detail: "React onMouseLeave event handler",
    type: "property",
  },
  {
    label: "tabindex",
    apply: "tabIndex",
    detail: "React tabIndex attribute",
    type: "property",
  },
  {
    label: "readonly",
    apply: "readOnly",
    detail: "React readOnly attribute",
    type: "property",
  },
  {
    label: "maxlength",
    apply: "maxLength",
    detail: "React maxLength attribute",
    type: "property",
  },
  {
    label: "minlength",
    apply: "minLength",
    detail: "React minLength attribute",
    type: "property",
  },
  {
    label: "contenteditable",
    apply: "contentEditable",
    detail: "React contentEditable attribute",
    type: "property",
  },
  {
    label: "crossorigin",
    apply: "crossOrigin",
    detail: "React crossOrigin attribute",
    type: "property",
  },
  {
    label: "datetime",
    apply: "dateTime",
    detail: "React dateTime attribute",
    type: "property",
  },
  {
    label: "enctype",
    apply: "encType",
    detail: "React encType attribute",
    type: "property",
  },
  {
    label: "formaction",
    apply: "formAction",
    detail: "React formAction attribute",
    type: "property",
  },
  {
    label: "formenctype",
    apply: "formEncType",
    detail: "React formEncType attribute",
    type: "property",
  },
  {
    label: "formmethod",
    apply: "formMethod",
    detail: "React formMethod attribute",
    type: "property",
  },
  {
    label: "formnovalidate",
    apply: "formNoValidate",
    detail: "React formNoValidate attribute",
    type: "property",
  },
  {
    label: "formtarget",
    apply: "formTarget",
    detail: "React formTarget attribute",
    type: "property",
  },
  {
    label: "frameborder",
    apply: "frameBorder",
    detail: "React frameBorder attribute",
    type: "property",
  },
  {
    label: "marginheight",
    apply: "marginHeight",
    detail: "React marginHeight attribute",
    type: "property",
  },
  {
    label: "marginwidth",
    apply: "marginWidth",
    detail: "React marginWidth attribute",
    type: "property",
  },
  {
    label: "novalidate",
    apply: "noValidate",
    detail: "React noValidate attribute",
    type: "property",
  },
  {
    label: "rowspan",
    apply: "rowSpan",
    detail: "React rowSpan attribute",
    type: "property",
  },
  {
    label: "colspan",
    apply: "colSpan",
    detail: "React colSpan attribute",
    type: "property",
  },
  {
    label: "usemap",
    apply: "useMap",
    detail: "React useMap attribute",
    type: "property",
  },
  {
    label: "autocomplete",
    apply: "autoComplete",
    detail: "React autoComplete attribute",
    type: "property",
  },
  {
    label: "autofocus",
    apply: "autoFocus",
    detail: "React autoFocus attribute",
    type: "property",
  },
  {
    label: "autoplay",
    apply: "autoPlay",
    detail: "React autoPlay attribute",
    type: "property",
  },
];

const reactHookSnippets: Completion[] = [
  {
    label: "useState",
    detail: "React useState hook",
    type: "function",
  },
  {
    label: "useEffect",
    detail: "React useEffect hook",
    type: "function",
  },
  {
    label: "useContext",
    detail: "React useContext hook",
    type: "function",
  },
  {
    label: "useReducer",
    detail: "React useReducer hook",
    type: "function",
  },
  {
    label: "useCallback",
    detail: "React useCallback hook",
    type: "function",
  },
  {
    label: "useMemo",
    detail: "React useMemo hook",
    type: "function",
  },
  {
    label: "useRef",
    detail: "React useRef hook",
    type: "function",
  },
  {
    label: "useLayoutEffect",
    detail: "React useLayoutEffect hook",
    type: "function",
  },
];

const reactSnippets = [
  ...reactAttributeSnippets,
  ...reactHookSnippets,
];

function reactCompletions(context: CompletionContext): CompletionResult | null {
  const word = context.matchBefore(/\w+/);
  if (!word || (word.from === word.to && !context.explicit)) return null;

  const matchingSnippets = reactSnippets.filter((snippet) => {
    return snippet.label.toLowerCase().startsWith(word.text.toLowerCase());
  });

  if (matchingSnippets.length === 0) return null;

  return {
    from: word.from,
    options: matchingSnippets,
  };
}

export function reactAutocomplete() {
  return autocompletion({
    override: [reactCompletions],
    defaultKeymap: true,
  });
}

export const customCompletionKeymap = keymap.of([
  { key: "Tab", run: acceptCompletion },
]);
