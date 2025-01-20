document.addEventListener<"DOMContentLoaded", () => {
    // ======================
    // Smooth Scrolling
    // ======================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // ======================
    // Dark/Light Mode Toggle
    // ======================
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Toggle Dark Mode';
    toggleButton.classList.add('toggle-mode');
    document.body.prepend(toggleButton);

    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
    });

    // ======================
    // Lazy Loading for Images
    // ======================
    const lazyImages = document.querySelectorAll('.lazy-load');

    const lazyLoad = (target) => {
        const io = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-load');
                    observer.unobserve(img);
                }
            });
        });

        io.observe(target);
    };

    lazyImages.forEach(lazyLoad);

    // ======================
    //  thios is the Snowflakes Animation 
    // ======================
    const createSnowflake = () => {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.textContent = '❄️';

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

    // ======================
    // IndexedDB with Dexie.js
    // ======================
    
  // ======================
    // IndexedDB Setup
    // ======================
    const db = new Dexie("MyDatabase");
    db.version(1).stores({
        users: "++id, name, email, message",
    });

    // ======================
    // Contact Form Handling with IndexedDB
    // ======================
    const form = document.getElementById("contact-form");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        // Sanitize inputs
        const name = sanitizeInput(nameInput.value);
        const email = sanitizeInput(emailInput.value);
        const message = sanitizeInput(messageInput.value);

        // Add the data to IndexedDB
        db.users.add({ name, email, message }).then(() => {
            alert("Your message has been saved in the browser!");
            form.reset();
        }).catch((error) => {
            console.error("Error saving message to IndexedDB:", error);
        });
    });

    // Sanitize inputs to prevent script injection
    function sanitizeInput(input) {
        const div = document.createElement("div");
        div.textContent = input;
        return div.innerHTML;
    }

    // ======================
    // LocalStorage Example
    // ======================
    // Save data to localStorage
    localStorage.setItem("defaultUser", "Mugisha Michael");
    const defaultUser = localStorage.getItem("defaultUser");
    console.log("Default User from LocalStorage:", defaultUser);
}