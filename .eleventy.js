// eleventy configuration

const moment = require('moment');

moment.locale('en');


module.exports = function(eleventyConfig) {

    // Copy site assests to /_site/assets
    eleventyConfig.addPassthroughCopy('src/assets');

    // NetlifyCMS
    // Copy NetlifyCMS index.html to /_site/admin
    eleventyConfig.addPassthroughCopy('src/admin');
  
    // Copy NetlifyCMS config to /_site/admin
    eleventyConfig.addPassthroughCopy("./src/admin/config.yml");

    // Copy user images folder to /_site/images
    eleventyConfig.addPassthroughCopy("./src/images");

    eleventyConfig.addFilter('dateIso', date => {
        return moment(date).toISOString();
    });

    eleventyConfig.addFilter('dateReadable', date => {
        return moment(date).utc().format('LL');    // E.g. May 31, 2019
    });

    eleventyConfig.addShortcode('excerpt', article => extractExcerpt(article));

    return {
        dir: {
            input: 'src',
        }
    }
}  

function extractExcerpt(article) {
    if (!article.hasOwnProperty('templateContent')) {
        console.warn('Failed to extract excerpt: Document has no property "templateContent".');
        return null;
    }
 
    let excerpt = null;
    const content = article.templateContent;
 
    // The start and end separators to try and match to extract the excerpt
    const separatorsList = [
        { start: '<!-- Excerpt Start -->', end: '<!-- Excerpt End -->' },
        { start: '<p>', end: '</p>' }
    ];
 
    separatorsList.some(separators => {
        const startPosition = content.indexOf(separators.start);
        const endPosition = content.indexOf(separators.end);
 
        if (startPosition !== -1 && endPosition !== -1) {
            excerpt = content.substring(startPosition + separators.start.length, endPosition).trim();
            return true; // Exit out of array loop on first match
        }
    });
 
    return excerpt;
}
