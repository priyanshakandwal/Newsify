export interface Newspaper {
    id: string;
    name: string;
    language: string;
    region: string;
    category: "National" | "Regional" | "International";
    thumbnail: string;
    content: string;
    pdfUrl: string;
    articleUrl: string;
}

export const newspapers: Newspaper[] = [
    {
        id: "the-hindu",
        name: "The Hindu",
        language: "English",
        region: "National",
        category: "National",
        thumbnail: "https://images.unsplash.com/photo-1504711331083-9c895941bf81?q=80&w=400&auto=format&fit=crop",
        content: "Loading live content from The Hindu...",
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        articleUrl: "https://www.thehindu.com/news/national/"
    },
    {
        id: "times-of-india",
        name: "Times of India",
        language: "English",
        region: "National",
        category: "National",
        thumbnail: "https://images.unsplash.com/photo-1566378246598-5b11a0fe77d7?q=80&w=400&auto=format&fit=crop",
        content: "Loading live content from Times of India...",
        pdfUrl: "https://www.clickdimensions.com/links/TestPDFfile.pdf",
        articleUrl: "https://timesofindia.indiatimes.com/india"
    },
    {
        id: "dainik-bhaskar",
        name: "Dainik Bhaskar",
        language: "Hindi",
        region: "National",
        category: "National",
        thumbnail: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=400&auto=format&fit=crop",
        content: "Loading live content from Dainik Bhaskar...",
        pdfUrl: "https://www.soundczech.cz/temp/lorem-ipsum.pdf",
        articleUrl: "https://www.bhaskar.com/national-news/"
    }
];
