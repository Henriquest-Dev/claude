/**
 * Wraps every word of an element in <span class="w"> (keeps <br>, swash
 * capitals `.sw` glued to their word, and inline elements like <em>).
 * Each word gets a `--i` custom property for CSS staggering.
 */
export function splitWords(el: HTMLElement): HTMLElement[] {
  const words: HTMLElement[] = [];
  const frag = document.createDocumentFragment();
  let current: HTMLElement | null = null;

  const open = () => {
    if (!current) {
      current = document.createElement("span");
      current.className = "w";
      current.style.setProperty("--i", String(words.length));
      words.push(current);
      frag.appendChild(current);
    }
    return current;
  };
  const close = () => {
    current = null;
  };

  const walk = (node: Node, wrapper?: Element) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const parts = (node.textContent ?? "").split(/(\s+)/);
      for (const part of parts) {
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          if (current) {
            close();
            frag.appendChild(document.createTextNode(" "));
          }
          continue;
        }
        const target = open();
        if (wrapper) {
          const w = wrapper.cloneNode(false) as Element;
          w.textContent = part;
          target.appendChild(w);
        } else {
          target.appendChild(document.createTextNode(part));
        }
      }
      return;
    }
    if (!(node instanceof Element)) return;
    if (node.tagName === "BR") {
      close();
      frag.appendChild(document.createElement("br"));
      return;
    }
    if (node.classList.contains("sw")) {
      open().appendChild(node.cloneNode(true));
      return;
    }
    node.childNodes.forEach((child) => walk(child, node));
  };

  [...el.childNodes].forEach((n) => walk(n));
  el.textContent = "";
  el.appendChild(frag);
  return words;
}
