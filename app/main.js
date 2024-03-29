(function () {
  /* random quote */

  const container = document.querySelector("figure");

  function createElement(type, textContent) {
    const el = document.createElement(type);
    el.textContent = textContent;
    return el;
  }

  function createQuoteElement({ quote, cite = "" }) {
    const blockquote = createElement("blockquote", quote);

    if (cite.trim()) {
      blockquote.setAttribute("cite", cite);
    }

    return blockquote;
  }

  async function getQuotes() {
    const LOCAL_STORAGE_KEY = "quotes";

    const cache = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

    if (cache && Date.now() < cache.expiration && cache.quotes) {
      return cache.quotes;
    }

    const response = await fetch(
      "https://raw.githubusercontent.com/MauricioRobayo/quotes-to-live-by/master/quotes-to-live-by.json"
    );
    if (!response.ok) {
      throw new Error(
        `Error fetching quotes: ${response.status} ${response.statusText}`
      );
    }
    const { quotes } = await response.json();

    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        quotes,
        expiration: Date.now() + 7 * 24 * 60 * 60 * 1000,
      })
    );

    return quotes;
  }

  function render(...elements) {
    container.innerHTML = "";
    container.append(...elements);
  }

  function renderQuote(quote) {
    const blockquote = createQuoteElement(quote);

    if (quote.author.trim()) {
      render(blockquote, createElement("figcaption", quote.author));
    } else {
      render(blockquote);
    }
  }

  function renderError(error) {
    render(createElement("div", error));
  }

  function loadQuote() {
    getQuotes()
      .then((quotes) => {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        renderQuote(randomQuote);
      })
      .catch((error) => {
        renderError(error);
      });
  }

  loadQuote();
  container.addEventListener("click", loadQuote);

  /* theme selection */

  const DEFAULT_THEME = "zen";
  const userTheme = localStorage.getItem("theme");
  const currentTheme = userTheme || DEFAULT_THEME;
  const themeButtons = document.querySelectorAll(".theme");

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);

    updateButtons(theme);
  }

  function updateButtons(theme) {
    themeButtons.forEach((button) => {
      if (button.dataset.theme === theme) {
        button.classList.add("active");
        button.setAttribute("disabled", true);
      } else {
        button.classList.remove("active");
        button.removeAttribute("disabled");
      }
    });
  }

  themeButtons.forEach((themeButton) => {
    themeButton.addEventListener("click", (event) => {
      setTheme(event.target.dataset.theme);
    });
  });

  setTheme(currentTheme);
})();
