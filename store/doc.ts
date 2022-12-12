import create from "zustand";

interface DocStore {
  html: string;
  css: string;
  js: string;
  setHtml: (html: string) => void;
  setCss: (css: string) => void;
  setJs: (js: string) => void;
}

export const useDocStore = create<DocStore>((set) => ({
  html: "",
  css: "",
  js: "",
  setHtml: (html: string) => {
    set({ html: html });
  },
  setCss: (css: string) => {
    set({ css: css });
  },
  setJs: (js: string) => {
    set({ js: js });
  },
}));
