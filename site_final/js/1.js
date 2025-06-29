const container = document.getElementById("container");
const centerImage = document.getElementById("centerImage");
const registerBtn = document.getElementById("registerBtn");
let isAnimated = false;

function toggleCircles(show) {
  const circles = document.querySelectorAll(".circle");
  circles.forEach((circle) => {
    circle.style.display = show ? "block" : "none";
  });
}

function closeAllOverlays() {
  Object.values(overlays).forEach((overlay) => {
    if (overlay) overlay.style.display = "none";
  });
  toggleCircles(true); // Показываем кружочки при закрытии всех оверлеев
}

centerImage.addEventListener("click", function () {
  if (!isAnimated) {
    container.classList.add("animated");
    isAnimated = true;
    setTimeout(() => {
      registerBtn.style.display = "block";
      setTimeout(() => {
        registerBtn.classList.add("visible");
      }, 20);
    }, 500);
    setTimeout(() => {
      registerBtn.classList.remove("visible");
      setTimeout(() => {
        registerBtn.style.display = "none";
      }, 500);
      container.classList.remove("animated");
      isAnimated = false;
    }, 4000);
  }
});

const navItems = document.querySelectorAll(".nav-item");
const overlays = {
  program: null,
  calendar: document.getElementById("calendarOverlay"),
  tickets: document.getElementById("ticketsOverlay"),
  services: document.getElementById("servicesOverlay"),
  about: document.getElementById("aboutOverlay"),
  shop: document.getElementById("shopOverlay"),
};

function closeAllOverlays() {
  Object.values(overlays).forEach((overlay) => {
    if (overlay) overlay.style.display = "none";
  });
}

function resetActiveNav() {
  navItems.forEach((item) => item.classList.remove("active"));
}

function showShop() {
  const overlay = document.getElementById("shopOverlay");
  overlay.style.display = "flex";
  overlay.classList.add("active");

  gsap.from(".text-line .line-box", {
    x: () => (Math.random() > 0.5 ? -500 : 500),
    rotation: () => Math.random() * 20 - 10,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "elastic.out(1, 0.5)",
  });
}

class ShopComponent {
  constructor() {
    this.overlay = document.getElementById("shopOverlay");
    this.init();
  }

  init() {
    this.createElements();
    this.setupAnimations();
    this.setupEventListeners();
  }

  createElements() {
    const circlesContainer = document.createElement("div");
    circlesContainer.className = "shop-circles";

    circlesContainer.innerHTML = `
      <div class="shop-circle shop-circle-1"></div>
      <div class="shop-circle shop-circle-2"></div>
      <div class="shop-circle shop-circle-3"></div>
    `;

    document.querySelector(".shop-header").prepend(circlesContainer);

    const linesContainer = document.createElement("div");
    linesContainer.className = "shop-lines";
    document.querySelector(".shop-header").appendChild(linesContainer);

    const bgContainer = document.createElement("div");
    bgContainer.className = "catalog-bg-elements";

    // for (let i = 0; i < 8; i++) {
    //   const circle = document.createElement("div");
    //   circle.className = "catalog-circle";

    //   const size = Math.random() * 150 + 50;
    //   const posX = Math.random() * 100;
    //   const posY = Math.random() * 100;
    //   const delay = Math.random() * 10;
    //   const duration = 15 + Math.random() * 10;

    //   circle.style.cssText = `
    //     width: ${size}px;
    //     height: ${size}px;
    //     left: ${posX}%;
    //     top: ${posY}%;
    //     animation-delay: ${delay}s;
    //     animation-duration: ${duration}s;
    //   `;

    //   bgContainer.appendChild(circle);
    // }

    document.querySelector(".shop-catalog").prepend(bgContainer);
  }

  setupAnimations() {
    this.startLineAnimation();

    this.setupScrollAnimations();

    this.animateHeader();
  }

  startLineAnimation() {
    const createLines = () => {
      const container = document.querySelector(".shop-lines");

      for (let i = 0; i < 3; i++) {
        const line = document.createElement("div");
        line.className = "shop-line";

        const width = Math.random() * 200 + 100;
        const top = Math.random() * 70 + 10;
        const delay = Math.random() * 1.5;
        const duration = 2 + Math.random() * 1;
        const thickness = Math.random() > 0.7 ? 3 : 2;

        line.style.cssText = `
          width: ${width}px;
          height: ${thickness}px;
          top: ${top}%;
          left: -${width}px;
          animation-delay: ${delay}s;
          animation-duration: ${duration}s;
        `;

        container.appendChild(line);

        setTimeout(() => line.remove(), (duration + delay) * 1000);
      }
    };

    createLines();
    this.lineInterval = setInterval(createLines, 2000);
  }

  setupScrollAnimations() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".shop-item, .shop-discount").forEach((el) => {
      observer.observe(el);
    });
  }

  animateHeader() {
    document.querySelectorAll(".subtitle-line").forEach((line, i) => {
      setTimeout(() => line.classList.add("visible"), i * 200);
    });
  }

  setupEventListeners() {
    document.addEventListener("overlayClose", () => {
      if (this.lineInterval) clearInterval(this.lineInterval);
    });
  }

  open() {
    this.overlay.style.display = "flex";
    this.overlay.scrollTo(0, 0);
    this.init();
  }

  close() {
    this.overlay.style.display = "none";
    if (this.lineInterval) clearInterval(this.lineInterval);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.shopComponent = new ShopComponent();
});

class Cart {
  constructor() {
    this.cart = [];
    this.initElements();
    this.setupEventListeners();
    this.loadCart();
  }

  initElements() {
    this.cartToggle = document.getElementById("cartToggle");
    this.cartItems = document.getElementById("cartItems");
    this.cartCount = document.querySelector(".cart-count");
    this.totalPrice = document.querySelector(".total-price");
    this.cartContainer = document.querySelector(".shop-cart");
    this.clearCartBtn = document.querySelector(".clear-cart-btn");
    this.checkoutBtn = document.querySelector(".checkout-btn");
  }

  setupEventListeners() {
    this.cartToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      this.cartContainer.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      if (
        !e.target.closest(".shop-cart") &&
        !e.target.classList.contains("add-to-cart")
      ) {
        this.cartContainer.classList.remove("active");
      }
    });

    this.clearCartBtn.addEventListener("click", () => {
      if (this.cart.length > 0 && confirm("Очистить всю корзину?")) {
        this.clearCart();
      }
    });

    this.checkoutBtn.addEventListener("click", () => {
      if (this.cart.length > 0) {
        alert("Заказ оформлен! Сумма: " + this.totalPrice.textContent);
        this.clearCart();
      } else {
        alert("Корзина пуста!");
      }
    });
  }

  addItem(name, author, price) {
    this.cartToggle.classList.add("cart-animate");
    setTimeout(() => {
      this.cartToggle.classList.remove("cart-animate");
    }, 500);

    const item = {
      id: Date.now(),
      name,
      author,
      price: parseInt(price.replace(/\s/g, "")),
    };
    this.cart.push(item);
    this.updateCart();
    this.saveCart();
  }

  removeItem(id) {
    const itemElement = document.querySelector(`.cart-item[data-id="${id}"]`);
    if (itemElement) {
      itemElement.classList.add("item-remove-animation");
      setTimeout(() => {
        this.cart = this.cart.filter((item) => item.id !== id);
        this.updateCart();
        this.saveCart();
      }, 400);
    }
  }

  clearCart() {
    if (this.cart.length === 0) return;

    this.cartItems.style.transition = "all 0.4s ease";
    this.cartItems.style.opacity = "0";
    this.cartItems.style.transform = "translateX(100px)";

    setTimeout(() => {
      this.cart = [];
      this.updateCart();
      this.saveCart();

      setTimeout(() => {
        this.cartItems.style.opacity = "1";
        this.cartItems.style.transform = "translateX(0)";
        this.cartItems.style.transition = "";
      }, 10);

      this.cartToggle.classList.add("cart-animate");
      setTimeout(() => {
        this.cartToggle.classList.remove("cart-animate");
      }, 500);
    }, 400);
  }

  updateCart() {
    this.cartCount.textContent = this.cart.length;
    this.cartCount.style.display = this.cart.length > 0 ? "flex" : "none";

    this.cartItems.innerHTML = "";

    if (this.cart.length === 0) {
      const emptyElement = document.createElement("div");
      emptyElement.className = "cart-empty";
      emptyElement.textContent = "Корзина пуста";
      this.cartItems.appendChild(emptyElement);
      this.cartItems.classList.add("cart-empty-animate");
      setTimeout(() => {
        this.cartItems.classList.remove("cart-empty-animate");
      }, 600);

      this.clearCartBtn.style.display = "none";
    } else {
      this.cart.forEach((item) => {
        const itemElement = document.createElement("div");
        itemElement.className = "cart-item";
        itemElement.dataset.id = item.id;
        itemElement.innerHTML = `
          <div>
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-author">${item.author}</div>
          </div>
          <div>
            <div class="cart-item-price">${item.price.toLocaleString(
              "ru-RU"
            )} ₽</div>
            <button class="remove-item-btn" data-id="${item.id}">×</button>
          </div>
        `;
        this.cartItems.appendChild(itemElement);

        itemElement
          .querySelector(".remove-item-btn")
          .addEventListener("click", (e) => {
            e.stopPropagation();
            this.removeItem(item.id);
          });
      });

      this.clearCartBtn.style.display = "flex";
    }

    const total = this.cart.reduce((sum, item) => sum + item.price, 0);
    this.totalPrice.textContent = `${total.toLocaleString("ru-RU")} ₽`;
  }

  saveCart() {
    localStorage.setItem("shopCart", JSON.stringify(this.cart));
  }

  loadCart() {
    const savedCart = localStorage.getItem("shopCart");
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
      this.updateCart();
    }
  }
}

const cart = new Cart();

document.querySelectorAll(".shop-item").forEach((item) => {
  const button = document.createElement("button");
  button.className = "add-to-cart";
  button.textContent = "В корзину";
  button.style.cssText = `
    background: #F51E1E;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 0px;
    margin-top: 10px;
    cursor: pointer;
    transition: background 0.3s;
    width: 100%;
    font-size: 30px;
  `;

  button.addEventListener("mouseenter", () => {
    button.style.background = "#c82333";
  });

  button.addEventListener("mouseleave", () => {
    button.style.background = "#dc3545";
  });

  button.addEventListener("click", () => {
    const name = item.querySelector(".shop-item-name").textContent;
    const author = item.querySelector(".shop-item-author").textContent;
    const price = item.querySelector(".shop-item-price").textContent;

    cart.addItem(name, author, price);
    cart.cartContainer.classList.add("active");
  });

  item.appendChild(button);


});


  setTimeout(() => {
    let shopItems = document.querySelectorAll(".shop-item");

    shopItems.forEach((item) => {
      let priceItem = item.querySelector(".shop-item-price");
      let buttonItem = item.querySelector(".add-to-cart");
buttonItem.textContent = priceItem.textContent;
    });
  }, 1000);

navItems.forEach((item) => {
  item.addEventListener("click", function () {
    this.style.transform = "scale(1.1)";
    setTimeout(() => {
      this.style.transform = "scale(1)";
    }, 200);

    const section = this.getAttribute("data-section");

    if (section === "program") {
      closeAllOverlays();
      resetActiveNav();
      this.classList.add("active");
      toggleCircles(true);
      return;
    }

    const overlay = overlays[section];
    if (overlay) {
      if (overlay.style.display === "flex") {
        closeAllOverlays();
        resetActiveNav();
        document
          .querySelector('.nav-item[data-section="program"]')
          .classList.add("active");
        toggleCircles(true);
      } else {
        closeAllOverlays();
        resetActiveNav();
        this.classList.add("active");
        overlay.style.display = "flex";
        toggleCircles(false);

        if (section === "calendar") {
          const calendarDays = overlay.querySelectorAll(".calendar-day");
          calendarDays.forEach((day, i) => {
            setTimeout(() => {
              day.classList.add("visible");
              day.style.opacity = "1";
              day.style.transform = "translateX(0)";
            }, 200 + i * 200);
          });
        } else if (section === "tickets") {
          const ticketItems = overlay.querySelectorAll(".ticket-item");
          ticketItems.forEach((item, i) => {
            setTimeout(() => {
              item.classList.add("visible");
            }, 200 + i * 200);
          });
        } else if (section === "services") {
          const serviceItems = overlay.querySelectorAll(".service-item");
          serviceItems.forEach((item, i) => {
            setTimeout(() => {
              item.classList.add("visible");
            }, 200 + i * 200);
          });
        } else if (section === "about") {
          const aboutItems = overlay.querySelectorAll(".about-items");
          aboutItems.forEach((items, i) => {
            items.style.opacity = "0";
            items.style.transform = "translateY(50px)";
            setTimeout(() => {
              items.style.transition = "opacity 0.5s ease, transform 0.5s ease";
              items.style.opacity = "1";
              items.style.transform = "translateY(0)";
            }, 100 + i * 100);
          });
        } else if (section === "shop") {
          closeAllOverlays();
          resetActiveNav();
          this.classList.add("active");
          window.shopComponent.open();
        }
      }
    }
  });
});
