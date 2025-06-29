document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const statusMessage = document.getElementById('statusMessage');
    const downloadLink = document.getElementById('downloadLink');
    const downloadAnchor = document.getElementById('downloadAnchor');

    searchButton.addEventListener('click', async () => {
        const query = searchInput.value.trim();
        if (!query) {
            statusMessage.textContent = 'Please enter a search query';
            return;
        }

        try {
            statusMessage.textContent = 'Processing search...';
            downloadLink.style.display = 'none';

            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to process search');
            }

            // Create a Blob from the response
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            downloadAnchor.href = url;
            downloadAnchor.download = 'search-results.zip';
            downloadLink.style.display = 'block';
            statusMessage.textContent = 'Search complete! Click to download.';

        } catch (error) {
            statusMessage.textContent = `Error: ${error.message}`;
            console.error('Error:', error);
        }
    });
});
