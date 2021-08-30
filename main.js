(() => {
    // Define the first page number
    var page = 1;
    // Set default values
    var empty_page = false;
    var block_request = false;

    window.onscroll = () => {
        var docHeight = document.body.clientWidth;
        var winHeight = window.innerHeight;
        var margin = docHeight - winHeight - 200;
        if (window.scrollY > margin && empty_page == false && block_request == false) {
            block_request = true;
            page += 1;
            fetch(`?page=${page}`, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.text())
            .then(data => {

                if (data == '') {
                    empty_page = true;
                } else {
                    block_request = false;

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
