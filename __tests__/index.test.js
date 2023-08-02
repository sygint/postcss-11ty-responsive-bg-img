const { rimrafSync } = require("rimraf");
const postcss = require("postcss");

const plugin = require("../");

const imgUrl = "./__tests__/images/happy-cat.png";
const singleQuoteImgUrl = './__tests__/images/happy-ca\'t.png';
const doubleQuoteImgUrl = './__tests__/images/happy-ca\"t.png';
const singleWidth = "500";
const multipleWidths = "400, 640, 768";

const errorCases = {
  "no params": [
    ".no-params-error { background: responsive-bg-img() }",
    "Missed required url and width parameters",
  ],
  "missing url parameter": [
    `.missing-url-error { background: responsive-bg-img(${singleWidth}) }`,
    "Missed required url parameter",
  ],
  "missing width parameter": [
    `.missing-width-error { background: responsive-bg-img(${imgUrl}) }`,
    "Missed required width parameter",
  ],
  "incorrect url parameter": [
    `.incorrect-url-error { background: responsive-bg-img(${imgUrl}.invalid, ${singleWidth}) }`,
    "Invalid filename: ./__tests__/images/happy-cat.png.invalid",
  ],
};

const cases = {
  "background-image rule": `.background-image-test { background-image: responsive-bg-img(${imgUrl}, ${singleWidth}) }`,
  "single quotes for url": `.single-quote-test { background: responsive-bg-img('${imgUrl}', ${singleWidth}) }`,
  "double quotes for url": `.double-quote-test { background: responsive-bg-img("${imgUrl}", ${singleWidth}) }`,
  "single quotes for double quote url": `.single-quote-double-quote-test { background: responsive-bg-img('${doubleQuoteImgUrl}', ${singleWidth}) }`,
  "double quotes for single quote url": `.double-quote-single-quote-test { background: responsive-bg-img("${singleQuoteImgUrl}", ${singleWidth}) }`,
  "multiple widths": `.multiple-widths-test { background: responsive-bg-img(${imgUrl}, ${multipleWidths}) }`,
  "url function": `.url-function-test { background: responsive-bg-img(url(${imgUrl}), ${multipleWidths}) }`,
  "url function with single quotes": `.url-function-single-quotes-test { background: responsive-bg-img(url('${imgUrl}'), ${singleWidth}) }`,
  "url function with double quotes": `.url-function-double-quotes-test { background: responsive-bg-img(url("${imgUrl}"), ${singleWidth}) }`,
};

async function test(input, opts = {}) {
  const result = await postcss([plugin(opts)]).process(input, {
    from: undefined,
  });

  expect(result.css).toMatchSnapshot();
  expect(result.warnings()).toHaveLength(0);
}

async function testError(input, error) {
  const result = async () =>
    await postcss([plugin]).process(input, { from: undefined });
  await expect(result).rejects.toThrow(error);
}

describe("postcss-11ty-responsive-bg-img", () => {
  afterAll(() => {
    rimrafSync("./img/");
  });

  for (let errorCase in errorCases) {
    const [input, errorText] = errorCases[errorCase];
    const description = `throws "${errorText}" error when called with ${errorCase}`;
    it(description, async () => await testError(input, errorText));
  }

  for (let caseName in cases) {
    const input = cases[caseName];
    const description = `renders correctly when called with ${caseName}`;
    it(description, async () => await test(input));
  }
});
