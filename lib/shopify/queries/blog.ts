// /lib/shopify/queries/blog.ts
import articleFragment from '../fragments/article';

export const getBlogQuery = /* GraphQL */ `
  query getBlog($handle: String!, $first: Int = 20) {
    blog(handle: $handle) {
      id
      handle
      title
      articles(first: $first, sortKey: PUBLISHED_AT, reverse: true) {
        edges {
          node {
            ...article
          }
        }
      }
    }
  }
  ${articleFragment}
`;

export const getArticleQuery = /* GraphQL */ `
  query getArticle($blogHandle: String!, $articleHandle: String!) {
    blog(handle: $blogHandle) {
      articles(first: 1, query: $articleHandle) {
        edges {
          node {
            ...article
          }
        }
      }
    }
  }
  ${articleFragment}
`;