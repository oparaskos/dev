class MarkdownRenderer extends HTMLElement {
  private markdown: string;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.markdown = '';
  }

  static get observedAttributes() {
    return ['src'];
  }

  connectedCallback() {
    this.renderMarkdown();
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'src' && oldValue !== newValue) {
      this.renderMarkdown();
    }
  }

  private loadMarkdown(): Promise<string> {
    const src = this.getAttribute('src');
    if (src) {
      return fetch(src)
        .then(response => response.text())
        .catch(error => {
          console.error('Error fetching Markdown:', error);
          throw error;
        });
    } else {
      return Promise.resolve(this.innerHTML);
    }
  }

  private renderMarkdown() {
    this.loadMarkdown()
      .then(markdown => {
        this.markdown = markdown;
        this.render();
      })
      .catch(error => {
        console.error('Error loading Markdown:', error);
        this.markdown = '';
        this.render();
      });
  }

  private render() {
    this.shadowRoot!.innerHTML = '';

    if (this.markdown) {
      const container = document.createElement('div');
      container.innerHTML = marked(this.markdown);
      this.shadowRoot!.appendChild(container);
    }
  }
}

customElements.define('markdown-renderer', MarkdownRenderer);
