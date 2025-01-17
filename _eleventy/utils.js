const markdownIt = require('markdown-it');
const slugify = require('slugify');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItTocDoneRight = require('markdown-it-toc-done-right');
const markdownItDefList = require('markdown-it-deflist');
const markdownItContainer = require('markdown-it-container');
const markdownItFitMedia = require('markdown-it-fitmedia');
const markdownItTrimmer = require('markdown-it-trimmer');
const markdownItCooklang = require('markdown-it-cooklang');
const markdownItScrollTable = require('markdown-it-scrolltable');
const markdownItAttrs = require('markdown-it-attrs');
const markdownItFootnote = require('markdown-it-footnote');
const markdownItMark = require('markdown-it-mark');
const markdownItMathJax = require('markdown-it-mathjax3');
const markdownItEmoji = require('markdown-it-emoji');
const markdownItInclude = require('markdown-it-include');
const sizeOf = require('image-size');
const striptags = require('striptags');
const fs = require('fs');
const path = require('path');

const dayjs = require('dayjs');
const advancedFormat = require('dayjs/plugin/advancedFormat');
dayjs.extend(advancedFormat);
const utc = require('dayjs/plugin/utc')
dayjs.extend(utc);
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(timezone);

function mySlugify(s) {
  return slugify(s, { lower: true });
}

const site = require('../_data/site.js');

module.exports = {

  excerptFromText: function(text) {
    let excerpt = this.removeHtml(text);
    if (excerpt) {
      let excerptWordCount = site.excerptWordCount ? site.excerptWordCount : 25;
      let words = excerpt.split(' ');
      excerpt = words.slice(0, excerptWordCount)
        .join(' ');
      if (words.length > excerptWordCount) {
        excerpt += ' …'
      }
    }
    return excerpt;
  },

  firstImageTag: function(html) {

    if (html) {
      const match = html.match(/<img\s+([^>]*)src="(.*?)"(.*?)[^>]*>/);
      if (match) {
        return match[0];
      }
    }
  },

  getAttr: function(html, attr) {
    if (html) {
      const match = html.match(new RegExp(`${attr}="(.*?)"`));
      if (match) {
        return match[1];
      }
    }
  },

  srcAttr: function(html) {
    return this.getAttr(html, 'src');
  },

  srcsetAttr: function(html) {
    return this.getAttr(html, 'srcset');
  },

  altAttr: function(html) {
    return this.getAttr(html, 'alt');
  },

  widthAttr: function(html) {
    return this.getAttr(html, 'width');
  },

  heightAttr: function(html) {
    return this.getAttr(html, 'height');
  },

  getDimensions: function(src) {
    return sizeOf(src);
  },

  isLiveItem: function(item) {
    const now = new Date();
    return item.date <= now &&
      item.data.draft !== true &&
      item.data.draft !== 'yes';
  },

  isPost: function(item) {
    return item.inputPath.startsWith(`./${site.input}/posts/`);
  },

  tagUrl: function(tag) {
    let standard = {
      tag: '*',
      url: '*'
    };
    let empty = {
      tag: '',
      url: ''
    };
    let siteTags = site.tagnav;
    if (siteTags) {
      for (let v of siteTags) {
        if (typeof v != 'string' && !(v instanceof String)) {
          if (v.tag == tag) {
            return v.url;
          }
          if (v.tag == '*') {
            standard = v;
          }
          if (!v.tag) {
            empty = v;
          }
        }
      }
    }

    if (tag == '') {
      return empty.url;
    } else {
      return standard.url.replace(/\*/g, tag);
    }
  },

  isSearchAble: function(item) {
    if (item.templateContent && item.templateContent.trim()) {
      return item.data.nosearch == null && this.isLiveItem(item) && !item.inputPath.startsWith(`./${site.input}/tagintros/`);
    }
    return false;
  },

  removeHtml: function(text) {
    if (text) {
      return striptags(text);
    }
  },

  mapItem: function(item) {
    let tagsWithUrls = [];

    if (item.data.tags) {
      let tags = [...new Set(item.data.tags)].sort();
      for (let tag of tags) {
        tagsWithUrls.push({
          name: tag,
          url: this.tagUrl(tag)
        });
      }
    }

    return {
      id: item.url,
      title: item.data.title,
      date: item.date,
      humanDate: this.humanDate(item.date),
      abstract: item.data.abstract,
      author: item.data.author,
      refer: item.data.refer,
      layout: item.data.layout,
      tags: tagsWithUrls,
      notags: item.data.notags,
      starred: item.data.starred,
      content: this.removeHtml(item.templateContent),
      excerpt: this.excerptFromText(item.templateContent),
      commentContents: item.data.comments ? item.data.comments.map(comment => comment.body).join(' ') : undefined,
      commentAuthors: item.data.comments ? item.data.comments.map(comment => comment.author).join(' ') : undefined
    }
  },

  compareItemDate: function(a, b) {
    return a.date - b.date;
  },

  ensureDirectory: function(filePath) {
    let dirName = path.dirname(filePath);
    if (fs.existsSync(dirName)) {
      return;
    } else {
      fs.mkdirSync(dirName, { recursive: true });
    }
  },

  imgAspectRatio: function(src) {
    try {
      dimensions = this.getDimensions(`${site.output}${src}`);
      if (dimensions.height > 0 && dimensions.width > 0) {
        return `aspect-ratio:${dimensions.width}/${dimensions.height};`;
      }
    } catch (e) {
      console.log(e);
    }
  },

  imgSizeHint: function(src) {
    try {
      dimensions = this.getDimensions(`${site.output}${src}`);
      if (dimensions.height > 0 && dimensions.width > 0) {
        return `width="${dimensions.width}" height="${dimensions.height}"`;
      }
    } catch (e) {
      console.log(e);
    }
  },

  isResponsive: function(filePath) {
    let fileName = path.basename(filePath);
    return /@picture|@responsive/i.test(fileName);
  },

  clearResponsive: function(filePath) {
    return filePath.replace(/@picture|@responsive/ig, '');
  },

  compareInputFileName: function(a, b) {
    const aFileName = path.basename(a.inputPath);
    const bFileName = path.basename(b.inputPath);
    return aFileName.localeCompare(bFileName);
  },

  isoDate: function(d) {
    return dayjs(d).toISOString();
  },

  humanDate: function(d) {
    if (d) {
      const locale = site.locale ? site.locale : 'en';
      let dt = dayjs(d).locale(locale);
      return dt.format('DD MMM YYYY')
    } else {
      return '';
    }
  },

  humanDateTime: function(d) {
    if (d) {
      const locale = site.locale ? site.locale : 'en';
      let dt = dayjs(d).locale(locale);
      return dt.format('DD MMM YYYY at HH:mm:ss');
    } else {
      return '';
    }
  },

  extractTags: function(collection) {
    let tagSet = new Set();
    for (let post of collection) {
      if (post.data.tags) {
        for (let tag of post.data.tags) {
          tagSet.add(tag);
        }
      }

      if (post.data?.tags?.includes(site.starTag)) {
        post.data.starred = site.starTag;
      } else {
        post.data.starred = '';
      }

    }
    return [...tagSet].sort();
  },


  chunk: function(arr = [], chunkSize = 1) {
    let chunks = [];
    let tmp = [...arr];
    if (chunkSize <= 0) return chunks;
    while (tmp.length) {
      chunks.push(tmp.splice(0, chunkSize));
    }
    return chunks
  },

  newestPage: function(path) {
    return path;
  },

  oldestPage: function(path, max) {
    return path + max + '/';
  },

  newerPage: function(path, currentIndex) {
    if (currentIndex > 1) {
      return path + currentIndex + '/';
    } else if (currentIndex == 1) {
      return path;
    } else {
      return '';
    }
  },

  currentPage: function(path, currentIndex) {
    if (currentIndex >= 1) {
      return path + (currentIndex + 1) + '/';
    } else
      return path;
  },

  olderPage: function(path, currentIndex, max) {
    if (currentIndex < max - 1) {
      return path + (currentIndex + 2) + '/';
    } else {
      return '';
    }
  },

  getMarkdownLib: function() {
    const mdlib = markdownIt({
      html: true,
      breaks: true,
      linkify: false,
      typographer: true,
      quotes: "„“‚‘"
    })
      .use(markdownItContainer)
      .use(markdownItAnchor, {
        permalink: markdownItAnchor.permalink.headerLink({ safariReaderFix: true, class: 'heading-anchor' }),
        slugify: mySlugify
      })
      .use(markdownItTocDoneRight, {
        slugify: mySlugify,
      })
      .use(markdownItMark)
      .use(markdownItDefList)
      .use(markdownItScrollTable)
      .use(markdownItAttrs)
      .use(markdownItFootnote)
      .use(markdownItTrimmer)
      .use(markdownItFitMedia, {
        imgDir: `./${site.input}`,
        decoding: 'async'
      })
      .use(markdownItMathJax)
      .use(markdownItEmoji)
      .use(markdownItInclude)
      .use(markdownItCooklang);


    return mdlib;
  },

  hashCode: function(value, seed = 0) {
    //from https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript/52171480#52171480
    let h1 = 0xdeadbeef ^ seed,
      h2 = 0x41c6ce57 ^ seed;
    str = String(value);
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  },

  stat: function(path) {
    return fs.statSync(path);
  },

  getTrimBase: function() {
    let base = site.base;
    if (base) {
      return base.replace(/\//g, '');
    } else {
      return '';
    }
  },

  getBase: () => {
    let base = site.base;
    if (base && base != '/') {
      return `/${base.replace(/\//g, '')}/`;
    } else {
      return '/';
    }
  }
}
