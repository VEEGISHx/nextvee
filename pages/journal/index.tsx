
import React from 'react';
import Head from 'next/head'
import Link from 'next/link';
import Navigation from '../../components/Navigation/src/Navigation';
import styled, { css } from "styled-components";

const { CONTENT_API_KEY, BLOG_URL } = process.env;

type Post = {
  title: string;
  slug: string;
}

type Page = {
  title: string;
  slug: string;
  access: true;
  canonical_url?: string;
  codeinjection_foot?: string;
  codeinjection_head?: string;
  comment_id?: string;
  created_at?: string;
  custom_excerpt?: string;
  custom_template?: string;
  excerpt?: string;
  feature_image?: string;
  featured?: boolean;
  html?: string;
  id?: string;
  meta_description?: string;
  meta_title?: string;
  og_description?: string;
  og_image?: string;
  og_title?: string;
  page: boolean
  published_at?: string;
  twitter_description?: string;
  twitter_image?: string;
  twitter_title?: string;
  updated_at?: string;
  url?: string;
  uuid?: string;
  visibility?: string;
}

interface JournalProps {
  posts: Post[]
  pages: Page[];
}

async function getPosts() {
  const results = await fetch(
    `${BLOG_URL}/ghost/api/v3/content/posts/?key=${CONTENT_API_KEY}`
  ).then((results) => results.json());

  const posts = results.posts;

  return posts;
}

async function getPages() {
  const results = await fetch(
    `${BLOG_URL}/ghost/api/v3/content/pages/?key=${CONTENT_API_KEY}`
  ).then((results) => results.json());

  const pages = results.pages;

  return pages;
}

export const getStaticProps = async ({ params }) => {
  const posts = await getPosts();
  const pages = await getPages();

  return {
    props: { posts, pages }
  }
}

const Home:React.FC<JournalProps> = (props) => {
  const { posts, pages } = props;
  const pageData:Page = pages.find(obj => { return obj.slug === 'the-digital-journal' || ''});
  return (
    <React.Fragment>
      <Head>
        <title>{ pageData?.title }</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content={ pageData?.title } key="title" />
        <meta name="description" content={ pageData?.meta_description || pageData?.excerpt }/>
        <meta name="og:title" content={ pageData?.og_title }/>
        <meta name="og:type" content="website"/>
        <meta name="og:url" content={ pageData?.slug }/>
        <meta name="og:image" content={ pageData?.og_image }/>
        <meta name="og:site_name" content={ pageData?.title }/>
        <meta name="og:description" content={ pageData?.og_description }/>
      </Head>
      <Navigation pages={ pages } />
      <StyledWrapper>
        <div className="journal-banner">
          <h1 className="journal-banner-title">{ pageData?.title }</h1>
          <p className="journal-banner-subtitle">{ pageData?.excerpt }</p>
        </div>
        <div className="journal-entries">
          <ul>
            {posts.map((post, index) => {
              return <li key={ post.slug }>
                <Link href="/journal/entry/[slug]" as={`/journal/entry/${post.slug}`}>
                  <a>{ post?.meta_title || post?.title || '' }</a>
                </Link>
                </li>
            })}
          </ul>
        </div>
      </StyledWrapper>
    </React.Fragment>
  )
}

const PageStyles = css`
  .journal-banner {
    text-align: center;
    width: 100%;
    max-width: 500px;
    margin: 0px auto;
    padding-top: 20px;
  }
  .journal-banner-title {
    line-height: 0.5;
    font-family: var(--faustina);
  }
  .journal-banner-subtitle {
    font-family: var(--tajawal);
  }
  .journal-entries {
    max-width: 300px;
    margin: 0px auto;
    padding-top: 20px;
    white-space: pre-wrap;
    @media (min-width: 768px) {
      max-width: 450px;
    }
    ul {
      display: flex;
      flex-flow: wrap;
      padding: 0;
      list-style-type: none;
      li {
        margin-bottom: 5px;
        a {
          position: relative;
          padding-bottom: 2px;
          text-decoration: none;
        }

        a:hover {
          background: yellow;
          font-weight: bold;
        }

        a:hover::before {
          content: "";
          position: absolute;
          top: 5px;
          height: 8px;
          width: 8px;
          border-radius: 50px;
          background: red;
          background-image: linear-gradient(transparent 64px, #F243B3 50%, #FFCA47 100%);
        }
      }
    }
  }
`;

const StyledWrapper = styled.div<{ className: string }>`
  ${PageStyles}
`;

export default Home;