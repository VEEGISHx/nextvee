import Link from 'next/link';
import { useRouter } from 'next/router';
import Navigation from '../components/Navigation/src/Navigation';

const { CONTENT_API_KEY, BLOG_URL } = process.env;

type Page = {
    title: string;
    slug: string;
    html: string;
}

interface PageProps {
    page: Page;
    pages: Page[];
}

async function getPages() {
    const results = await fetch(
      `${BLOG_URL}/ghost/api/v3/content/pages/?key=${CONTENT_API_KEY}`
    ).then((results) => results.json());
  
    const pages = results.pages;
  
    return pages;
}

async function getPage(slug: string) {
    const results = await fetch(
        `${BLOG_URL}/ghost/api/v3/content/pages/slug/${slug}/?key=${CONTENT_API_KEY}&fields=title,slug,html`
    ).then((results) => results.json());
    
    const pages = results.pages;
    return pages[0];
}

export const getStaticProps = async ({ params }) => {
    const page = await getPage(params.slug);
    const pages = await getPages();
    return {
        props: { page, pages },
        revalidate: 10
    }
}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: true
    }
}

const Page: React.FC<PageProps> = (props) => {
    console.log("PROPS", props);

    const { page, pages } = props;

    const router = useRouter();

    if (router.isFallback) {
        return <h1>Loading Page...</h1>
    }

    return (
        <div>
            <Navigation pages={ pages } />
            <Link href="/">
                <a>Go Back</a>
            </Link>
            <h1>{ page.title }</h1>
            <div dangerouslySetInnerHTML={ {__html: page.html} }></div>
        </div>
    )
}

export default Page;