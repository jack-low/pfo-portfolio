/* config.js — site-wide configuration.
   Edit these values before deploying. No build step required. */
window.SITE_CONFIG = {
  /* Contact form */
  contactEndpoint: '/api/v1/contact',
  contactEmail: 'contact@solo-map.app',
  showEmail: true,                    // show the email card in the contact section

  /* Cloudflare Turnstile — leave empty to disable the widget.
     Set to your real site key to enable bot protection on the form. */
  turnstileSiteKey: '',

  /* Social links — disabled by default (plan: email + form only).
     Flip `enabled` to true to render a link in the contact section. */
  social: {
    github: { handle: '__nullx2__', url: 'https://github.com/__nullx2__', enabled: false },
    x:      { handle: '',           url: '',                              enabled: false }
  }
};
