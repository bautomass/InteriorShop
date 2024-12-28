// /lib/shopify/fragments/article.ts
import imageFragment from './image';
import seoFragment from './seo';

const articleFragment = `
  fragment article on Article {
    id
    handle
    title
    excerpt
    content
    publishedAt
    author: authorV2 {
      name
    }
    image {
      ...image
    }
    seo {
      ...seo
    }
  }
  ${imageFragment}
  ${seoFragment}
`;

export default articleFragment;