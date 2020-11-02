import React from 'react';
import Head from 'next/head'
import Link from 'next/link';
import Navigation from '../components/Navigation/src/Navigation';

const { CONTENT_API_KEY, BLOG_URL } = process.env;

type Post = {
  title: string;
  slug: string;
}

type Page = {
  title: string;
  slug: string;
}

interface HomepageProps {
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

const Home:React.FC<HomepageProps> = (props) => {
  const { posts, pages } = props;
  
  return (
    <React.Fragment>
      <Navigation pages={ pages } />
      <h1>Hello to my blog</h1>
      <ul>
        {posts.map((post, index) => {
          return <li key={ post.slug }>
            <Link href="/article/[slug]" as={`/article/${post.slug}`}>
              <a>{ post.title }</a>
            </Link>
            </li>
        })}
      </ul>
    </React.Fragment>
  )
}

export default Home;