const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" })
      .setLocale("it")
      .toFormat("d LLLL yyyy");
  });

  eleventyConfig.addFilter("isoDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toISO();
  });

  eleventyConfig.addFilter("head", (array, n) => {
    return array.slice(0, n);
  });

  eleventyConfig.addFilter("hasRecentPost", (posts, days) => {
    if (!posts || !posts.length) return false;
    const now = DateTime.now().startOf("day");
    const latest = DateTime.fromJSDate(posts[0].date, { zone: "utc" }).startOf("day");
    return now.diff(latest, "days").days <= (days || 7);
  });

  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi
      .getFilteredByTag("post")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("categories", (collectionApi) => {
    const posts = collectionApi.getFilteredByTag("post");
    const categories = {};
    posts.forEach((post) => {
      const cat = post.data.category;
      if (cat) {
        if (!categories[cat]) categories[cat] = [];
        categories[cat].unshift(post);
      }
    });
    Object.keys(categories).forEach((cat) => {
      categories[cat].sort((a, b) => b.date - a.date);
    });
    return categories;
  });

  return {
    pathPrefix: process.env.ELEVENTY_PATH_PREFIX || "/",
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
