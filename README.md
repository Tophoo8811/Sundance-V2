# Sundance-V2 Static Site

This is a simple static site for Sundance Retreats.  Properties are listed
in `properties.html`; galleries are shown in a modal driven by `script.js`.

## Images and GitHub Pages

Because GitHub Pages (and other static hosts) do **not** return filesystem
listings, the JavaScript cannot automatically discover all files in a
photo directory.  There are two supported approaches:

1. **Explicit list.** Add a `data-images` attribute to each `.bcard` with a
   comma-separated list of image URLs.  The script will use these values
   directly.

2. **Static manifest.** Place an `index.json` file inside each
   `Properties/list/<property>/Photos/` folder.  The manifest should be an
   array of filenames (e.g. `["1.jpg","2.jpg"]`).  After adding or
   removing images, run:

   ```bash
   node gen_manifests.js
   ```

   This will regenerate all `index.json` files automatically.  The frontend
   will fetch the manifest and build the gallery from it.

### Naming

Filenames and folder names must match exactly in the HTML. Avoid spaces or
capitalize inconsistently; the repo (and Pages) is case-sensitive.  The
`gen_manifests.js` script already renames the `VN Villa` directory to
`VN-Villa`, and the HTML has been updated accordingly.

---

Feel free to modify or extend the code.  Happy coding!