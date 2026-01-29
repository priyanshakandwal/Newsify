import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const html = await response.text();
        const $ = cheerio.load(html);

        // Noise removal
        $('script, style, nav, footer, iframe, header, noscript, .ad, .advertisement, .related-news, .social-share').remove();

        const unwantedPhrases = [
            'Copyright',
            'All rights reserved',
            'dainikbhaskar.com',
            'timesofindia',
            'indiatimes',
            'Copyright ©',
            'Privacy Policy',
            'Terms of Service',
            'Contact Us',
            'Follow us on',
            'Subscribe to'
        ];

        const cleanText = (text: string) => {
            const lines = text.split('\n');
            return lines
                .map(line => line.trim())
                .filter(line => line.length > 5)
                .filter(line => !unwantedPhrases.some(phrase => line.toLowerCase().includes(phrase.toLowerCase())))
                .join('\n\n');
        };

        // Check if we are on a listing page
        const isListing = url.includes('/news/') || url.includes('/business/') || url.includes('/sport/') || url.includes('/sci-tech/') || url.includes('/india') || url.includes('/national');

        if (isListing) {
            const articles: any[] = [];
            $('.story-card, .article, .row, .item, .story-card-75, .story-card-100, .element, .VW69V, .I5379').each((i, el) => {
                if (articles.length >= 15) return;

                const titleEl = $(el).find('h2, h3, .title, .story-card-news-heading, a, .heading').first();
                const title = titleEl.text().trim();
                const link = titleEl.attr('href') || titleEl.find('a').attr('href') || $(el).find('a').attr('href');

                const imageEl = $(el).find('img');
                const image = imageEl.attr('data-src') ||
                    imageEl.attr('src') ||
                    imageEl.attr('data-original');

                const summary = $(el).find('.summary, p, .story-card-news-introduction, .description').first().text().trim();

                if (title && title.length > 15) {
                    articles.push({
                        title,
                        link: link ? (link.startsWith('http') ? link : new URL(link, url).href) : null,
                        image: image ? (image.startsWith('http') ? image : new URL(image, url).href) : null,
                        summary: cleanText(summary) || 'Latest update from official sources.'
                    });
                }
            });

            if (articles.length > 0) {
                const briefingContent = articles.map(a => `## ${a.title}\n\n${a.summary}\n\n`).join('---\n\n');
                return NextResponse.json({
                    type: 'article',
                    title: 'Daily Briefing',
                    content: briefingContent,
                    articles: articles,
                    heroImage: articles[0]?.image || null
                });
            }
        }

        // Single article logic
        let title = $('h1').first().text().trim();
        let image = $('meta[property="og:image"]').attr('content') || $('.main-image img').attr('src');
        let content = '';

        const bodies = ['article', '.article-body', '.content', '.entry-content', '.story-content', '#story-body', '.main-content', '.left-column', '.story-section'];
        for (const selector of bodies) {
            const el = $(selector);
            if (el.length > 0) {
                const paragraphs = el.find('p').map((i, p) => $(p).text().trim()).get();
                content = cleanText(paragraphs.join('\n'));
                if (content.length > 150) break;
            }
        }

        if (!content) {
            const allP = $('p').map((i, p) => $(p).text().trim()).get();
            content = cleanText(allP.join('\n'));
        }

        return NextResponse.json({
            type: 'article',
            title: title || 'Live Article',
            image: image,
            content: content.substring(0, 5000),
            source: url
        });

    } catch (error: any) {
        console.error('Scraping error:', error);
        return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
    }
}
