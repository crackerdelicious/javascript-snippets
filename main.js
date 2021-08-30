(() => {
    // Define the first page number
    var page = 1;
    // Set default values
    var empty_page = false;
    var block_request = false;

    // Start load new items after scrolling down.
    window.onscroll = () => {
        // get the document and window height value
        var docHeight = document.body.clientWidth;
        var winHeight = window.innerHeight;
        // set a margin
        var margin = docHeight - winHeight - 200;
        // if window has scrolled down to the given margin, run this.
        if (window.scrollY > margin && empty_page == false && block_request == false) {
            // stop request multiple times before load content
            block_request = true;
            // plus the page number up by one.
            // Ex: ?page=2, ?page=3
            page += 1;
            // User fetch API to get the content within the page include in template
            fetch(`?page=${page}`, {
                method: 'GET',
                headers: {
                    // tell server we sent it as AJAX
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.text()) // response as text.
            .then(data => {
                if (data == '') {
                    // set empty page if return nothings.
                    empty_page = true;
                } else {
                    // set block request to false in order to make fetch load again.
                    block_request = false;
                    // set response text to DOM parser
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(data, 'text/html');
                    const images = doc.querySelectorAll('.image-list__item');

                    for (const img of images ) {
                        document.getElementById('image-list').append(img);
                    }
                }
            });
        }
    };
})();
