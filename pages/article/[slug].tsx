import Link from 'next/link';
import { useRouter } from 'next/router';

const { CONTENT_API_KEY, BLOG_URL } = process.env;


async function getArticle(slug: string) {
    const results = await fetch(
        `${BLOG_URL}/ghost/api/v3/content/posts/slug/${slug}/?key=${CONTENT_API_KEY}&fields=title,slug,html`
    ).then((results) => results.json());
    
    const articles = results.posts;
    
    return articles[0];
}

export const getStaticProps = async ({ params }) => {
    const article = await getArticle(params.slug);
    return {
        props: { article },
        revalidate: 10
    }
}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: true
    }
}

type Article = {
    title: string;
    html: string;
    slug: string;
}

const Article: React.FC<{article: Article}> = (props) => {
    console.log("PROPS", props);

    const { article } = props;

    const router = useRouter();

    if (router.isFallback) {
        return <h1>Loading...</h1>
    }

    return (
        <div>
            <Link href="/">
                <a>Go Back</a>
            </Link>
            <h1>{ article.title }</h1>
            <div dangerouslySetInnerHTML={ {__html: article.html} }></div>
        </div>
    )
}

export default Article;