import { useEffect } from 'react';

const SEO = ({
    title,
    description,
    keywords,
    canonicalUrl,
    ogImage = 'https://tsaritservices.com/tsar-logo.jpg',
    schema
}) => {
    useEffect(() => {
        // 1. Update Title
        if (title) {
            document.title = `${title} | TSAR IT INTERNSHIP`;
        }

        // 2. Update Meta Description
        if (description) {
            let metaDesc = document.querySelector("meta[name='description']");
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.setAttribute('name', 'description');
                document.head.appendChild(metaDesc);
            }
            metaDesc.setAttribute('content', description);

            let ogDesc = document.querySelector("meta[property='og:description']");
            if (ogDesc) ogDesc.setAttribute('content', description);

            let twDesc = document.querySelector("meta[name='twitter:description']");
            if (twDesc) twDesc.setAttribute('content', description);
        }

        // 3. Update Canonical Tag
        if (canonicalUrl) {
            let linkCanonical = document.querySelector("link[rel='canonical']");
            if (!linkCanonical) {
                linkCanonical = document.createElement('link');
                linkCanonical.setAttribute('rel', 'canonical');
                document.head.appendChild(linkCanonical);
            }
            linkCanonical.setAttribute('href', canonicalUrl);

            let ogUrl = document.querySelector("meta[property='og:url']");
            if (ogUrl) ogUrl.setAttribute('content', canonicalUrl);
        }

        // 4. Update OpenGraph Title
        if (title) {
            let ogTitle = document.querySelector("meta[property='og:title']");
            if (ogTitle) ogTitle.setAttribute('content', `${title} | TSAR IT INTERNSHIP`);

            let twTitle = document.querySelector("meta[name='twitter:title']");
            if (twTitle) twTitle.setAttribute('content', `${title} | TSAR IT INTERNSHIP`);
        }

        // 5. Update Keywords
        if (keywords) {
            let metaKeywords = document.querySelector("meta[name='keywords']");
            if (metaKeywords) metaKeywords.setAttribute('content', keywords);
        }

        // 6. Dynamic JSON-LD Structured Data
        let scriptTag = null;
        if (schema) {
            scriptTag = document.createElement('script');
            scriptTag.type = 'application/ld+json';
            scriptTag.id = 'dynamic-page-schema';
            scriptTag.innerHTML = JSON.stringify(schema);
            document.head.appendChild(scriptTag);
        }

        return () => {
            if (scriptTag && document.head.contains(scriptTag)) {
                document.head.removeChild(scriptTag);
            }
        };
    }, [title, description, keywords, canonicalUrl, ogImage, schema]);

    return null;
};

export default SEO;
