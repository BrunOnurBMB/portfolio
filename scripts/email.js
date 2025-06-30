
const form = document.querySelector("form");
const successMessage = document.getElementById("success-message");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
            Accept: "application/json"
        }
    })
        .then(response => {
            if (response.ok) {
                form.reset();
                successMessage.classList.remove("hidden");
            } else {
                alert("Erro ao enviar. Tente novamente.");
            }
        })
        .catch(() => alert("Erro ao enviar. Verifique sua conexão."));
});

function closeSuccessMessage() {
    successMessage.classList.add("hidden");
}
