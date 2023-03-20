import type { DaidaiApiResult } from "./supabaseClient"

const ANONYMOUS_DAIDAI_ID_PREFIX = "_default_"

export const ANONYMOUS_DAIDAIS: Pick<
  DaidaiApiResult,
  "c_html" | "url" | "id"
>[] = [
  {
    c_html: `<h1 class="editor-heading-h1"><span>Google</span></h1><p class="editor-paragraph"><span class="editor-tag" data-lexical-tag="example"></span><span class="editor-tag" data-lexical-tag="search"></span><span> </span></p>`,
    url: "https://google.com",
    id: `${ANONYMOUS_DAIDAI_ID_PREFIX}1`
  },
  {
    c_html: `<h1 class="editor-heading-h1"><span>ChatGPT</span></h1><p class="editor-paragraph"><span class="editor-tag" data-lexical-tag="example"></span><span class="editor-tag" data-lexical-tag="search"></span><span class="editor-tag" data-lexical-tag="AI"></span><span> </span></p>`,
    url: "https://chat.openai.com",
    id: `${ANONYMOUS_DAIDAI_ID_PREFIX}2`
  }
]

export const isAnonymousDaidai = (id: string) =>
  ANONYMOUS_DAIDAIS.some((item) => item.id === id)
