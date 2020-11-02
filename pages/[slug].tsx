import Link from 'next/link';
import { useRouter } from 'next/router';

const { CONTENT_API_KEY, BLOG_URL } = process.env;


async function getPage(slug: string) {
    const results = await fetch(
        `${BLOG_URL}/ghost/api/v3/content/pages/slug/${slug}/?key=${CONTENT_API_KEY}&fields=title,slug`
    ).then((results) => results.json());
    
    const pages = results.pages;
    
    return pages[0];
}

export const getStaticProps = async ({ params }) => {
    const page = await getPage(params.slug);
    return {
        props: { page },
        revalidate: 10
    }
}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: true
    }
}

type Page = {
    title: string;
    slug: string;
}

const Page: React.FC<{page: Page}> = (props) => {
    console.log("PROPS", props);

    const { page } = props;

    const router = useRouter();

    if (router.isFallback) {
        return <h1>Loading...</h1>
    }

    return (
        <div>
            <Link href="/">
                <a>Go Back</a>
            </Link>
            <h1>{ page.title }</h1>
        </div>
    )
}

export default Page;