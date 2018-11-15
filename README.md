# tjandnina.com
Our wedding website

Uses node, express, vue, mysql, and passport in combination with Cloudflare-cached pre-built static pages to serve
our wedding website with minimal server load. Currently running on a Google Cloud instance with pm2 and nginx.

Static pages are built using `/build/build.js` using a layout/component pattern. Templates are rendered twice, once from the components and then again for each langauge using [tjschiffer/multi-language-site-generator](https://github.com/tjschiffer/multi-language-site-generator).

Guests can RSVP using their name and zipcode, which gets stored in the db and emailed to site admin using the gmial api.

The admin page at `/invites` shows the satus of the guests and allows for filtering of guests by name and status (RSVP yes, no, ot not responded).
