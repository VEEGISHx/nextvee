import Link from 'next/link';
import { useRouter } from 'next/router';
import Navigation from '../../components/Navigation/src/Navigation';
import styled, { css } from 'styled-components';

const { CONTENT_API_KEY, BLOG_URL } = process.env;

type Page = {
    title: string;
    slug: string;
    html?: string;
}

type Article = {
    title: string;
    html: string;
    slug: string;
}

interface ArticlePageProps {
    pages: Page[];
    article: Article;
}

async function getPages() {
    const results = await fetch(
      `${BLOG_URL}/ghost/api/v3/content/pages/?key=${CONTENT_API_KEY}`
    ).then((results) => results.json());
  
    const pages = results.pages;
  
    return pages;
}

async function getArticle(slug: string) {
    const results = await fetch(
        `${BLOG_URL}/ghost/api/v3/content/posts/slug/${slug}/?key=${CONTENT_API_KEY}&fields=title,slug,html`
    ).then((results) => results.json());
    
    const articles = results.posts;
    
    return articles[0];
}

export const getStaticProps = async ({ params }) => {
    const article = await getArticle(params.slug);
    const pages = await getPages();
    return {
        props: { article, pages },
        revalidate: 10
    }
}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: true
    }
}

const Article: React.FC<ArticlePageProps> = (props) => {
    console.log("PROPS", props);

    const { article, pages } = props;

    const router = useRouter();

    if (router.isFallback) {
        return <h1>Loading Article...</h1>
    }

    return (
        <div>
            <Navigation pages={ pages } />
            <StyledWrapper>
                <div className="page-wrapper">
                    <Link href="/">
                        <a>Go Back</a>
                    </Link>
                    <h1>{ article.title }</h1>
                    <div dangerouslySetInnerHTML={ {__html: article.html} }></div>
                </div>
            </StyledWrapper>
            
        </div>
    )
}

const PageStyles = css`
    .page-wrapper {
        padding: 20px 40px;
    }

    img {
        width: 100%;
        height: 100%;
        max-width: 800px;
    }
`;

const StyledWrapper = styled.div<{className: string }>`
 ${ PageStyles }
`;

export default Article;