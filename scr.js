(function() { 'use strict';
    async function main() {
        const tenge = document.querySelector('[name=tenge]');
        if (tenge.value === '') return;
        const url = "./?tenge=" + tenge.value + "&silent=1";
        const out = document.getElementById('out');
        out.textContent = 'Please wait...';
        fetch(url)
            .then(response => response.text())
            .then((data) => {
                out.textContent = data;
            });
    }
    document.querySelector('[name=btngo]').onclick = main;
    document.querySelector('[name=tenge]').addEventListener('keypress', (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            main();
        }
    });
})();