const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer-core');
const archiver = require('archiver');
const compression = require('compression');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(compression());

// Serve static files from the public directory
app.use(express.static('public'));

// Handle root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/search', async (req, res) => {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Invalid search query' });
    }

    try {
        const browser = await puppeteer.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ],
            executablePath: process.env.CHROME_BIN || '/usr/bin/google-chrome'
        });
        const page = await browser.newPage();

        // Navigate to Google and perform search
        await page.goto('https://www.google.com');
        await page.type('input[name="q"]', query);
        await page.keyboard.press('Enter');
        await page.waitForNavigation();

        // Capture screenshot
        await page.waitForTimeout(2000); // Wait for page to fully load
        const screenshot = await page.screenshot({
            fullPage: true,
            path: path.join(__dirname, 'temp', 'screenshot.png')
        });

        // Get HTML content
        const html = await page.content();
        
        // Create zip archive
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename=search-results.zip');

        archive.pipe(res);
        
        // Add files to zip
        archive.append(html, { name: 'search-results.html' });
        archive.file(path.join(__dirname, 'temp', 'screenshot.png'), { name: 'screenshot.png' });

        await archive.finalize();
        await browser.close();

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to process search request' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
