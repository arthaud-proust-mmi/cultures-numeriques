// Menu burger
document.querySelector("#open-menu-btn").addEventListener("click", () => {
    displayMenuBurger(true);
});

document.querySelector("#close-menu-btn").addEventListener("click", () => {
    displayMenuBurger(false);
});

const menuContainer = document.querySelector("#menu-burger");

function displayMenuBurger(value) {
    if(value)
        menuContainer.classList.add("active");
    else
        menuContainer.classList.remove("active");
}

// Theme mode
{
    const sunIcon = document.getElementById("sun-icon");
    const moonIcon = document.getElementById("moon-icon");
    let lightMode = true;
    updateTheme();

    document.querySelector("#toggle-theme-btn").addEventListener("click", () => {
        toggleTheme();
    });

    function toggleTheme() {
        lightMode = !lightMode;
        updateTheme();
    }

    function updateTheme() {
        if(lightMode) {
            document.body.classList.remove("dark-theme");
            sunIcon.classList.remove("active");
            moonIcon.classList.add("active");
        }
        else {
            document.body.classList.add("dark-theme");
            sunIcon.classList.add("active");
            moonIcon.classList.remove("active");
        }
    }
}