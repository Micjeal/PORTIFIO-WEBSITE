document.addEventListener("DOMContentLoaded", () => {
    // Contact Form Handling
    const form = document.getElementById("contact-form");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = sanitizeInput(nameInput.value);
        const email = sanitizeInput(emailInput.value);
        const message = sanitizeInput(messageInput.value);

        clearErrors();

        let isValid = true;
        if (!name) {
            showError(nameInput, "Name is required.");
            isValid = false;
        }
        if (!email || !isValidEmail(email)) {
            showError(emailInput, "Valid email is required.");
            isValid = false;
        }
        if (!message) {
            showError(messageInput, "Message cannot be empty.");
            isValid = false;
        }

        if (isValid) {
            saveMessage({ name, email, message });
            sendWhatsAppMessage(name, email, message).catch(err => console.error(err));
            displaySuccessMessage(`Thank you, ${name}! Your message has been sent successfully.`);
            form.reset();
        }
    });

    function sanitizeInput(input) {
        return input.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showError(input, message) {
        const error = document.createElement("small");
        error.className = "error";
        error.textContent = message;
        input.classList.add("input-error");
        input.parentNode.insertBefore(error, input.nextSibling);
    }

    function clearErrors() {
        const errors = document.querySelectorAll(".error");
        errors.forEach(error => error.remove());

        const inputs = document.querySelectorAll(".input-error");
        inputs.forEach(input => input.classList.remove("input-error"));
    }

    function displaySuccessMessage(message) {
        const successMessage = document.createElement("div");
        successMessage.className = "success-message";
        successMessage.textContent = message;
        form.parentNode.insertBefore(successMessage, form);

        setTimeout(() => {
            successMessage.classList.add("fade-out");
            successMessage.addEventListener("transitionend", () => successMessage.remove());
        }, 3000);
    }

    function saveMessage(message) {
        const contactMessages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        contactMessages.push(message);
        localStorage.setItem('contactMessages', JSON.stringify(contactMessages));
    }

    function sendWhatsAppMessage(name, email, message) {
        const phoneNumber = '256707319452'; // Your WhatsApp number in international format without '+'
        const waMessage = 'Hello, you have a new message from ${name} (${email}): ${message}';
        const encodedMessage = encodeURIComponent(waMessage);
        const whatsappURL = 'https://wa.me/${phoneNumber}?text=${encodedMessage}';

        return new Promise((resolve, reject) => {
            window.open(whatsappURL, '_blank');
            resolve();
        });
    }

    function getMessages() {
        return JSON.parse(localStorage.getItem('contactMessages')) || [];
    }

    // Snowflakes
    const createSnowflake = () => {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.textContent = '❅';

        const size = Math.random() * 15 + 15 + 'px';
        snowflake.style.width = size;
        snowflake.style.height = size;
        snowflake.style.left = Math.random() * window.innerWidth + 'px';
        snowflake.style.animationDuration = `${Math.random() * 4 + 3}s`;
        snowflake.style.animationDelay = `${Math.random() * 3}s`;

        document.body.appendChild(snowflake);

        setTimeout(() => {
            snowflake.remove();
        }, 5000);
    };

    setInterval(createSnowflake, 200);

    // Testimonials Slider
    const slider = document.querySelector(".testimonials-slider");
    let isDown = false;
    let startX;
    let scrollLeft;

    const moveSlides = () => {
        const totalWidth = slider.scrollWidth;
        const visibleWidth = slider.clientWidth;
        const maxScrollLeft = totalWidth - visibleWidth;

        if (slider.scrollLeft >= maxScrollLeft) {
            slider.scrollLeft = 0;
        } else {
            slider.scrollLeft += visibleWidth;
        }
    };

    let slideInterval = setInterval(moveSlides, 3000);

    slider.addEventListener("mousedown", (e) => {
        isDown = true;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        clearInterval(slideInterval);
    });

    slider.addEventListener("mouseleave", () => {
        isDown = false;
        slideInterval = setInterval(moveSlides, 3000);
    });

    slider.addEventListener("mouseup", () => {
        isDown = false;
        slideInterval = setInterval(moveSlides, 3000);
    });

    slider.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 3;
        slider.scrollLeft = scrollLeft - walk;
    });

    // Log stored messages
    console.log(getMessages());
});
