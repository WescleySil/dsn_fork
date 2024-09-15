document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('modal');
    const openButton = document.getElementById('cadastrarCliente');
    const closeButton = document.getElementById('modalClose');

    openButton.addEventListener('click', function () {
        modal.classList.add('active');
    });

    closeButton.addEventListener('click', function () {
        modal.classList.remove('active');
    });

    
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });
});
