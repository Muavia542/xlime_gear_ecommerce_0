/** Serialize structured data safely for embedding in a <script> element. */
export function jsonLd(value:unknown){return JSON.stringify(value).replace(/</g,"\\u003c")}
