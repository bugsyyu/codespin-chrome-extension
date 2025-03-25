import { applyDiff, createDOMElement } from "webjsx";
import { insertHTML } from "../../api/contentEditable.js";
import { fromFileSelection } from "../../api/prompt.js";
import styles from "./ChatGPTInboundButton.css?inline";

const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(styles);

export class ChatGPTInboundButton extends HTMLElement {
  #dialog: HTMLDialogElement | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot!.adoptedStyleSheets = [styleSheet];
  }

  connectedCallback() {
    this.render();
    this.shadowRoot!.querySelector(
      "#codespin-chatgpt-inbound-icon-wrapper"
    )?.addEventListener("click", this.handleClick.bind(this));
  }

  disconnectedCallback() {
    this.#dialog?.remove();
    this.#dialog = null;
  }

  async initializeDialog() {
    if (this.#dialog) return;
    this.#dialog = createDOMElement(
      <dialog class="dialog">
        <codespin-file-importer
          onselect={(e: CustomEvent<string[]>) => {
            this.handleFileSelection(e.detail);
            this.#dialog?.close();
          }}
          oncancel={() => {
            this.#dialog?.close();
          }}
        />
      </dialog>
    ) as HTMLDialogElement;
    document.body.appendChild(this.#dialog);
  }

  async handleFileSelection(selectedFiles: string[]) {
    try {
      const prompt = await fromFileSelection(selectedFiles);
      
      // Try multiple possible selectors to find the editor
      const editorSelectors = [
        "#prompt-textarea", // Original selector
        "textarea[placeholder*='Send a message']", // Direct textarea
        "div[contenteditable='true']", // Contenteditable div
        "div[role='textbox']", // Role textbox
        "form[class*='stretch'] textarea" // Form textarea
      ];
      
      let editor: HTMLTextAreaElement | HTMLDivElement | Element | null = null;
      
      // Try each selector
      for (const selector of editorSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          editor = element;
          break;
        }
      }
      
      if (editor) {
        // Handle different types of input elements
        if (editor instanceof HTMLTextAreaElement) {
          // For textarea elements
          const originalValue = editor.value;
          editor.value = originalValue + prompt;
          editor.dispatchEvent(new Event('input', { bubbles: true }));
          editor.focus();
        } else {
          // For contenteditable or other elements
          try {
            insertHTML(editor as HTMLDivElement, prompt);
          } catch (e) {
            console.error("Error inserting HTML:", e);
            // Fallback: try to set innerText if insertHTML fails
            if ('innerHTML' in editor) {
              (editor as HTMLElement).innerHTML += prompt;
            } else if ('textContent' in editor) {
              (editor as Node).textContent += prompt;
            }
          }
          
          // Only call focus if it's available on the element
          if ('focus' in editor && typeof (editor as HTMLElement).focus === 'function') {
            (editor as HTMLElement).focus();
          }
        }
      } else {
        console.error("Could not find text editor element");
      }
    } catch (error) {
      console.error("Error loading file contents:", error);
    }
  }

  render() {
    const vdom = (
      <div
        class="inbound-button"
        aria-disabled="false"
        aria-label="Add Source Code"
        id="codespin-chatgpt-inbound-icon-wrapper"
      >
        <codespin-icon></codespin-icon>
      </div>
    );
    applyDiff(this.shadowRoot!, vdom);
  }

  async handleClick() {
    await this.initializeDialog();
    const importer = this.#dialog?.querySelector("codespin-file-importer");
    if (importer) {
      (importer as any).show();
    }
    this.#dialog?.showModal();
  }
}

customElements.define("codespin-chatgpt-inbound-button", ChatGPTInboundButton);