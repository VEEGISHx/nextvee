import Link from 'next/link';
import styled, { css } from 'styled-components';


interface NavigationProps {
    pages: any;
    className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ pages, className }) => {
const renderPages = pages.map((page) => 
    <div className="navigation-menu--link" key={page.slug}>
        <Link href="/[slug]" as={`/${page.slug}`}>
              <a>{ page.title }</a>
        </Link>
    </div>
);
    return (
        <StyledWrapper className={ className ? className : '' }>
            <nav>
                <div className="navigation-menu">
                    { renderPages }
                </div>
            </nav>
        </StyledWrapper>
    );
}

const NavigationStyles = css`
    nav {
        width: 100%;
        height: 64px;
        background: #111111;
    }
        
    .navigation-menu {
        padding: 20px 0;
        display: flex;
        align-items: center;
        justify-content: start;
    }

    .navigation-menu--link {
        font-size: 18px;
        display: flex;
        margin: 0 10px;
        color: var(--white);
    }
`;

const StyledWrapper = styled.div<{className: string }>`
 ${ NavigationStyles }
`;

export default Navigation;