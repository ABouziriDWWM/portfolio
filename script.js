// Navigation mobile
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav-link");

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  navToggle.classList.toggle("active");
});

// Fermer le menu mobile quand on clique sur un lien
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    navToggle.classList.remove("active");
  });
});

// Navigation sticky
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Smooth scrolling pour les liens d'ancrage
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const offsetTop = target.offsetTop - 70; // Hauteur de la navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// Animation des barres de compétences
const observerOptions = {
  threshold: 0.5,
  rootMargin: "0px 0px -100px 0px",
};

const skillsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const skillBars = entry.target.querySelectorAll(".skill-progress");
      skillBars.forEach((bar) => {
        const width = bar.getAttribute("data-width");
        setTimeout(() => {
          bar.style.width = width;
        }, 200);
      });
    }
  });
}, observerOptions);

const skillsSection = document.querySelector(".skills");
if (skillsSection) {
  skillsObserver.observe(skillsSection);
}

// Animation d'apparition des éléments
const fadeElements = document.querySelectorAll(
  ".skills-category, .timeline-item, .education-item, .contact-item"
);

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in", "visible");
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }
);

fadeElements.forEach((element) => {
  element.classList.add("fade-in");
  fadeObserver.observe(element);
});

// Effet de typing pour le titre
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = "";

  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  type();
}

// Démarrer l'effet de typing quand la page est chargée
window.addEventListener("load", () => {
  const typingElement = document.querySelector(".typing-text");
  if (typingElement) {
    typeWriter(typingElement, "Bonjour, je suis", 80);
  }
});

// Gestion du formulaire de contact
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Récupérer les données du formulaire
    const formData = new FormData(this);
    const name = formData.get("name");
    const email = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");

    // Créer le lien mailto
    // const mailtoLink = `mailto:a.bouziri.dwwm@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;

    // Ouvrir le client de messagerie
    // window.location.href = mailtoLink;

    // Afficher un message de confirmation
    emailjs
      .send("service_xxxxxxx", "template_xxxxxxx", {
        from_name: name,
        from_email: email,
        subject: subject,
        message: message,
        to_email: "a.bouziri.dwwm@gmail.com",
      })
      .then(
        function (response) {
          showNotification(
            "Votre message a bien été envoyé. Merci de votre contact !",
            "success"
          );
          contactForm.reset();
        },
        function (error) {
          showNotification(
            "Erreur lors de l'envoi du message. Veuillez réessayer.",
            "error"
          );
        }
      );
  });
}

// Fonction pour afficher des notifications
function showNotification(message, type = "info") {
  // Créer l'élément de notification
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

  // Ajouter les styles CSS si ils n'existent pas
  if (!document.querySelector("#notification-styles")) {
    const styles = document.createElement("style");
    styles.id = "notification-styles";
    styles.textContent = `
            .notification {
                position: fixed;
                top: 90px;
                right: 20px;
                background: white;
                border-radius: 10px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                z-index: 10000;
                transform: translateX(400px);
                transition: transform 0.3s ease-out;
                max-width: 400px;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification-success {
                border-left: 4px solid #10b981;
            }
            
            .notification-error {
                border-left: 4px solid #ef4444;
            }
            
            .notification-info {
                border-left: 4px solid #3b82f6;
            }
            
            .notification-content {
                padding: 1rem;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                gap: 1rem;
            }
            
            .notification-message {
                flex: 1;
                color: #374151;
                line-height: 1.5;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                color: #9ca3af;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .notification-close:hover {
                color: #374151;
            }
        `;
    document.head.appendChild(styles);
  }

  // Ajouter la notification au DOM
  document.body.appendChild(notification);

  // Afficher la notification
  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  // Gérer la fermeture
  const closeBtn = notification.querySelector(".notification-close");
  closeBtn.addEventListener("click", () => {
    hideNotification(notification);
  });

  // Auto-fermeture après 5 secondes
  setTimeout(() => {
    hideNotification(notification);
  }, 5000);
}

function hideNotification(notification) {
  notification.classList.remove("show");
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
}

// Chargement des projets GitHub (simulation)
function loadGitHubProjects() {
  const projectsContainer = document.getElementById("github-projects");

  // Simulation de projets (en réalité, on utiliserait l'API GitHub)
  const sampleProjects = [
    {
      name: "Taekwondo Scoring System",
      description:
        "Système de scoring pour compétitions de Taekwondo développé en VB.NET",
      language: "VB.NET",
      stars: 5,
      url: "https://github.com/ABouziriDWWM",
    },
    {
      name: "Portfolio Web",
      description:
        "Site portfolio personnel développé en HTML, CSS et JavaScript",
      language: "JavaScript",
      stars: 3,
      url: "https://github.com/ABouziriDWWM",
    },
    {
      name: "Application Web Mobile",
      description: "Application web responsive avec React et Node.js",
      language: "React",
      stars: 8,
      url: "https://github.com/ABouziriDWWM",
    },
  ];

  // Simuler un délai de chargement
  setTimeout(() => {
    projectsContainer.innerHTML = "";

    sampleProjects.forEach((project) => {
      const projectCard = document.createElement("div");
      projectCard.className = "project-card";
      projectCard.innerHTML = `
                <div class="project-header">
                    <h4>${project.name}</h4>
                    <div class="project-stars">
                        <i class="fas fa-star"></i>
                        <span>${project.stars}</span>
                    </div>
                </div>
                <p class="project-description">${project.description}</p>
                <div class="project-footer">
                    <span class="project-language">
                        <i class="fas fa-circle"></i>
                        ${project.language}
                    </span>
                    <a href="${project.url}" target="_blank" class="project-link">
                        <i class="fas fa-external-link-alt"></i>
                        Voir le projet
                    </a>
                </div>
            `;

      projectsContainer.appendChild(projectCard);
    });

    // Ajouter les styles pour les cartes de projet
    if (!document.querySelector("#project-card-styles")) {
      const styles = document.createElement("style");
      styles.id = "project-card-styles";
      styles.textContent = `
                .project-card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 15px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid #e5e7eb;
                }
                
                .project-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                }
                
                .project-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                
                .project-header h4 {
                    color: #1f2937;
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin: 0;
                }
                
                .project-stars {
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                    color: #fbbf24;
                    font-size: 0.9rem;
                }
                
                .project-description {
                    color: #6b7280;
                    margin-bottom: 1rem;
                    line-height: 1.5;
                }
                
                .project-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .project-language {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #6b7280;
                    font-size: 0.9rem;
                }
                
                .project-language i {
                    color: #2563eb;
                }
                
                .project-link {
                    color: #2563eb;
                    text-decoration: none;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                    font-size: 0.9rem;
                    transition: color 0.3s ease;
                }
                
                .project-link:hover {
                    color: #1e40af;
                }
            `;
      document.head.appendChild(styles);
    }
  }, 1500);
}

// Charger les projets quand la section devient visible
const projectsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        loadGitHubProjects();
        projectsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

const projectsSection = document.querySelector(".projects");
if (projectsSection) {
  projectsObserver.observe(projectsSection);
}

// Effet parallax léger pour le hero
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector(".hero");
  if (hero) {
    hero.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

// Animation des éléments au scroll
const animateOnScroll = () => {
  const elements = document.querySelectorAll(".fade-in:not(.visible)");

  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add("visible");
    }
  });
};

window.addEventListener("scroll", animateOnScroll);

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  // Ajouter la classe fade-in aux éléments qui doivent être animés
  const elementsToAnimate = document.querySelectorAll(
    ".section-header, .about-text, .github-card"
  );
  elementsToAnimate.forEach((element) => {
    element.classList.add("fade-in");
  });

  // Déclencher l'animation initiale
  animateOnScroll();
});

// Gestion des erreurs JavaScript
window.addEventListener("error", (e) => {
  console.error("Erreur JavaScript:", e.error);
});

// Performance: Lazy loading des images
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}

// @@
// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  let zindex = 10;

  // Get all elements with class 'card'
  const cards = document.querySelectorAll("div.card");
  const cardsContainer = document.querySelector("div.cards");

  // Add event listener to each card
  cards.forEach((card) => {
    card.addEventListener("click", function (e) {
      e.preventDefault();

      let isShowing = card.classList.contains("show");

      if (cardsContainer.classList.contains("showing")) {
        // a card is already in view
        const showingCard = document.querySelector("div.card.show");
        if (showingCard) {
          showingCard.classList.remove("show");
        }

        if (isShowing) {
          // this card was showing - reset the grid
          cardsContainer.classList.remove("showing");
        } else {
          // this card isn't showing - get in with it
          card.style.zIndex = zindex;
          card.classList.add("show");
        }

        zindex++;
      } else {
        // no cards in view
        cardsContainer.classList.add("showing");
        card.style.zIndex = zindex;
        card.classList.add("show");

        zindex++;
      }
    });
  });
});
