import Head from 'next/head'
import Link from 'next/link';
import styles from '../styles/Home.module.css'

const { CONTENT_API_KEY, BLOG_URL } = process.env;

type Post = {
  title: string;
  slug: string;
}

async function getPosts() {
  const results = await fetch(
    `${BLOG_URL}/ghost/api/v3/content/posts/?key=${CONTENT_API_KEY}`
  ).then((results) => results.json());

  const posts = results.posts;

  return posts;
}

export const getStaticProps = async ({ params }) => {
  const posts = await getPosts();
  return {
    props: { posts }
  }
}

const Home:React.FC<{ posts: Post[] }> = (props) => {
  const { posts } = props;
  
  console.log(posts);
  
  return (
    <div className={styles.container}>
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
    </div>
  )
}

export default Home;