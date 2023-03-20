import type { DaidaiApiResult } from "./supabaseClient"

const ANONYMOUS_DAIDAI_ID_PREFIX = "_default_"

export const ANONYMOUS_DAIDAIS: Pick<
  DaidaiApiResult,
  "c_html" | "url" | "id"
>[] = [
  {
    c_html: `<h1 class="editor-heading-h1"><span>Daidai</span></h1><p class="editor-paragraph"><span class="editor-tag" data-lexical-tag="daidai"></span><span class="editor-tag" data-lexical-tag="utils"></span><span> </span></p>`,
    url: "/",
    id: `${ANONYMOUS_DAIDAI_ID_PREFIX}official`
  },
  {
    c_html: `<h1 class="editor-heading-h1"><span>How to manage bookmarks</span></h1><p class="editor-paragraph"><span class="editor-tag" data-lexical-tag="daidai"></span><span class="editor-tag" data-lexical-tag="docs"></span><span> </span></p>`,
    url: "/",
    id: `${ANONYMOUS_DAIDAI_ID_PREFIX}doc`
  }
]

export const isAnonymousDaidai = (id: string) =>
  ANONYMOUS_DAIDAIS.some((item) => item.id === id)
