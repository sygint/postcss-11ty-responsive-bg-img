# postcss-11ty-responsive-bg-img

A [PostCSS] plugin to generate responsive images and companion css using [eleventy-img].

[PostCSS]: https://github.com/postcss/postcss
[eleventy-img]: https://github.com/11ty/eleventy-img

## basic example

### input:

```css
/* input css */
.foo {
  background-image: responsive-bg-img(images/happy-cat.png, 400, 640, 768)
}
```

```
# starting directory tree

images
├── happy-cat.png
```

### output:

```css
/* output css */

.foo {
  background: url("/img/HOdUYjZ3EM-400.webp");
}
  
@media (min-width: 640px) {
  background-image: url("/img/HOdUYjZ3EM-640.webp");
}
@media (min-width: 768px) {
  background-image: url("/img/HOdUYjZ3EM-768.webp");
}
```

```
# ending directory tree

images
├── happy-cat.png
optimized-images
├── HOdUYjZ3EM-400.webp
├── HOdUYjZ3EM-640.webp
└── HOdUYjZ3EM-768.webp
```

## Usage

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-11ty-responsive-bg-img
```

**Step 2:** Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-11ty-responsive-bg-img'),
    req
  ]
}
```

[official docs]: https://github.com/postcss/postcss#usage
