import "./components/ChatGPTInboundButton.js";
import "./components/ChatGPTSyncButton.js";
import "../components/FileImporter.js";
import "../components/FileTree.js";
import "../components/FileContentViewer.js";
import "../components/icons/CodeSpinIcon.js";
import "../components/icons/SyncIcon.js";
import "../components/FileWriter.js";
import "../components/ChangeTree.js";
import "../components/FileEdits.js";
import { createDOMElement } from "webjsx";

/**
 * Attaches a sync button (<codespin-chatgpt-sync-button>) to a specific <pre> element.
 * @param preElement The <pre> element to which the sync button will be attached.
 */
function addSyncButtonToDOM(preElement: HTMLElement) {
  const previousElement = preElement.previousElementSibling;
  if (!previousElement?.textContent?.startsWith("File path:")) {
    return;
  }

  // Look for copy button container - trying multiple selectors to increase compatibility
  const copyButtonContainer = 
    preElement.querySelector("div > div > div > span > button")?.parentElement?.parentElement ||
    preElement.querySelector("div[class*='flex'] button[class*='copy']")?.closest("div[class*='flex']") ||
    preElement.querySelector("button[aria-label*='Copy']")?.closest("div");

  if (copyButtonContainer) {
    const syncButton = createDOMElement(<codespin-chatgpt-sync-button />);
    copyButtonContainer.parentElement?.insertBefore(
      syncButton,
      copyButtonContainer
    );
  }
}

/**
 * Attaches CodeSpin links to all <pre> elements on the page.
 * This function should be called periodically to handle dynamically added code blocks.
 */
async function attachSyncButton() {
  const codeBlocks = document.querySelectorAll("pre");

  codeBlocks.forEach((preElement) => {
    if (!preElement.dataset.codespinAttached) {
      addSyncButtonToDOM(preElement);
      preElement.dataset.codespinAttached = "true";
    }
  });
}

// This needs to run only once because the textbox is created only once.
async function attachInboundButton() {
  if (!document.querySelector("codespin-chatgpt-inbound-button")) {
    // Try multiple possible selectors to find the message input area
    const possibleSelectors = [
      "#composer-background", // Original selector
      "form[class*='stretch']", // Common pattern in recent versions
      "div[data-testid='text-input-box']", // By test ID
      "div[class*='text-input']", // By class name pattern
      "textarea[placeholder*='Send a message']" // Direct textarea
    ];

    let targetElement = null;
    
    // Try each selector
    for (const selector of possibleSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        targetElement = element;
        break;
      }
    }

    if (!targetElement) return;

    // Find appropriate container for our button
    let targetContainer = null;
    
    // If we found the form or a div container
    if (targetElement.tagName === 'FORM') {
      // Look for button/toolbar container in form
      targetContainer = targetElement.querySelector("div[class*='button']") || 
                        targetElement.querySelector("div[class*='toolbar']") ||
                        targetElement.querySelector("div[class*='stretch']");
    } else if (targetElement.tagName === 'DIV') {
      // Use the element itself or look for a child container
      targetContainer = targetElement.querySelector("div[class*='flex']") || targetElement;
    } else if (targetElement.tagName === 'TEXTAREA') {
      // Find parent container for textarea
      targetContainer = targetElement.closest("div[class*='flex']") || 
                        targetElement.closest("div[class*='relative']");
    }

    // Fallback to composer if available or use the target element
    targetContainer = targetContainer || document.getElementById("composer-background") || targetElement;

    const inboundButton = createDOMElement(
      <codespin-chatgpt-inbound-button></codespin-chatgpt-inbound-button>
    );

    // Append as last element or at beginning based on layout
    targetContainer.appendChild(inboundButton as Element);
  }
}

/**
 * Initializes the CodeSpin functionality by setting up necessary components
 * and observers.
 */
export function initializeCodeSpin() {
  console.log("CodeSpin: Initializing for ChatGPT...");
  
  // Initial attachment of CodeSpin links
  attachSyncButton();

  // We need to attach the inbound button
  attachInboundButton();

  // Optionally, set up periodic checks (if necessary)
  setInterval(() => {
    attachSyncButton();
    attachInboundButton();
  }, 3000);
}
