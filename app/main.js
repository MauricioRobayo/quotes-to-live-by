(function () {
  function createElement(type, textContent) {
    const el = document.createElement(type);
    el.textContent = textContent;
    return el;
  }

  function createQuoteElement({ quote, author = "", cite = "" }) {
    const blockquote = createElement("blockquote", quote);

    if (cite.trim()) {
      blockquote.setAttribute("cite", cite);
    }

    return blockquote;
  }

  async function getQuotes() {
    const SESSION_STORAGE_KEY = "quotes";

    const sessionStorageQuotes = sessionStorage.getItem(
      SESSION_STORAGE_KEY
    );
    if (sessionStorageQuotes) {
      return JSON.parse(sessionStorageQuotes);
    }

    const response = await fetch(
      "https://raw.githubusercontent.com/MauricioRobayo/quotes-to-live-by/master/quotes-to-live-by.json"
    );
    if (!response.ok) {
      throw new Error(
        `Error fetching quotes: ${response.status} ${response.statusText}`
      );
    }
    const quotes = await response.json();

    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(quotes));

    return quotes;
  }

  function render(container, ...children) {
    container.innerHTML = "";
    container.append(...children);
  }

  function renderQuote(container, quote) {
    const blockquote = createQuoteElement(quote);

    if (quote.author.trim()) {
      render(
        container,
        blockquote,
        createElement("figcaption", quote.author)
      );
    } else {
      render(container, blockquote);
    }
  }

  function renderError(container, error) {
    render(container, createElement("div", error));
  }

  function loadQuote(container) {
    getQuotes()
      .then((quotes) => {
        renderQuote(container, quotes[Math.floor(Math.random() * quotes.length)]);
      })
      .catch((error) => {
        renderError(container, error);
      });
  }

  const container = document.querySelector("figure");
  loadQuote(container);
  container.addEventListener("click", function () {
    loadQuote(container);
  });
})();
