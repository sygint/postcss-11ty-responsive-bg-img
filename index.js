const Image = require("@11ty/eleventy-img");

function stripDecl(text) {
  return text.replace(/^responsive-bg-img\(/, "").replace(/\)$/, "");
}

function stripUrlFunction(text) {
  return text.replace(/^url\(/, "").replace(/\)$/, "");
}

function stripQuotes(text) {
  return text.replace(/^\"/g, "").replace(/\"$/g, "").replace(/^\'/g, "").replace(/\'$/g, "");
}

function checkParams(params) {
  const [url, ...widths] = params;

  if (url === "") {
    return "Missed required url and width parameters";
  }

  if (/^\d+$/.test(url)) {
    return "Missed required url parameters";
  }

  if (widths.length === 0) {
    return "Missed required width parameter";
  }

  return null;
}

function paramsList(params) {
  let [url, ...widths] = params;

  widths = widths.map((x) => parseInt(x));
  url = stripUrlFunction(url);
  url = stripQuotes(url);

  return {
    url,
    widths,
  };
}

async function processDecl(decl, url, options) {
  options.alt = "";

  const metadata = await Image(url, options);

  const metadataValues = Object.values(metadata.webp);
  const defaultData = metadataValues[0];
  const mediaQueries = metadataValues
    .slice(1)
    .map(
      (x) =>
        `\n@media (min-width: ${x.width}px) { ${decl.parent.selector} { background-image: url("${x.url}"); } }`
    )
    .join("");

  decl.value = `url("${defaultData.url}")`;
  decl.parent.parent.append(mediaQueries);
}

async function processResponsiveBgImg(decl, opts) {
  if (decl.value.includes("responsive-bg-img(")) {
    const params = stripDecl(decl.value)
      .split(",")
      .map((x) => x.trim());
    const error = checkParams(params);

    if (error) throw decl.error(error);

    const { url, widths } = paramsList(params);

    try {
      await processDecl(decl, url, {
        ...opts,
        widths,
      });
    } catch (error) {
      if (error.message.includes("no such file")) {
        const filePathRegex = /stat\s'(.*?)'/;
        const filePathMatch = error.message.match(filePathRegex);

        throw decl.error(`Invalid filename: ${filePathMatch[1]}`);
      }
      throw decl.error(error);
    }
  }
}

/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = (opts = {}) => ({
  postcssPlugin: "postcss-11ty-responsive-bg-img",
  Declaration: {
    "background-image": (decl) => processResponsiveBgImg(decl, opts),
    background: (decl) => processResponsiveBgImg(decl, opts),
  },
});

module.exports.postcss = true;
