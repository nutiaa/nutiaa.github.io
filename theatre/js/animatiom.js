// Анимация Штор главный экран

window.addEventListener("load", function () {
  setTimeout(startAnimation, 500);
});

function startAnimation() {
  const tl = gsap.timeline();

  let curtainX = "-72%";
  if (window.innerWidth <= 1500) {
    curtainX = "-79%"; // для 768–1500px
  }

  if (window.innerWidth <= 767) {
    curtainX = "-125%"; // например, для мобильных — ещё дальше
  }
  if (window.innerWidth <= 500) {
    curtainX = "-148%"; // например, для мобильных — ещё дальше
  }
  tl.to("#curtain-svg", {
    duration: 1.5,
    x: curtainX,
    ease: "power2.inOut",
  })

    .set("#hero-content", {
      opacity: 1,
    })

    .fromTo(
      ".hero-main-text",
      {
        x: -400,
        opacity: 0,
      },
      {
        duration: 1.2,
        x: 0,
        opacity: 1,
        ease: "power3.out",
      }
    )

    .fromTo(
      ".hero-circle",
      {
        x: 400,
        opacity: 0,
      },
      {
        duration: 1.2,
        x: 0,
        opacity: 1,
        ease: "power3.out",
      },
      "-=0.8"
    )

    .fromTo(
      ".hero-additional-text",
      {
        y: 100,
        opacity: 0,
      },
      {
        duration: 1,
        y: 0,
        opacity: 1,
        ease: "power2.out",
      },
      "-=0.5"
    )

    .to(
      ".header",
      {
        duration: 0.8,
        opacity: 1,
        ease: "power2.out",
      },
      "-=0.3"
    )
    .set("#curtain-container", {
      pointerEvents: "none",
    });
}

// Анимация Смены цветов

const colors = ["#9F2921", "#EB81B2", "#E33B2F", "#F2BED9", "white"];

function seamlessColorAnimation() {
  const elements = [
    document.querySelector("#rect-bg"),
    document.querySelector("#path1"),
    document.querySelector("#path2"),
    document.querySelector("#path3"),
    document.querySelector("#path4"),
    document.querySelector("#path5"),
  ];

  if (elements.some((el) => !el)) return;

  let isAnimating = false;

  function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;

    const shuffled = [...colors].sort(() => Math.random() - 0.5);

    const tweens = elements.map((el, i) => {
      return gsap.to(el, {
        attr: { fill: shuffled[i % shuffled.length] },
        duration: 1,
        ease: "sine.inOut",
        delay: i * 0.07,
      });
    });

    const lastTween = tweens[tweens.length - 1];

    let triggered = false;
    lastTween.eventCallback("onUpdate", function () {
      if (!triggered && this.progress() >= 0.75) {
        triggered = true;
        this.eventCallback("onUpdate", null);
        isAnimating = false;
        startAnimation();
      }
    });
    lastTween.eventCallback("onComplete", () => {
      if (!triggered) {
        isAnimating = false;
        startAnimation();
      }
    });
  }

  startAnimation();
}

window.addEventListener("load", () => {
  if (typeof gsap !== "undefined") {
    gsap.delayedCall(4, seamlessColorAnimation);
  }
});

// Анимация смены цветов фигурок
const PINK = "#EB81B2";
const WHITE = "white";

const elements = document.querySelectorAll(".pulse-shape");

function startPulsing() {
  elements.forEach((el, i) => {
    const original = el.getAttribute("fill"); // исходный цвет элемента

    // К белому
    gsap.to(el, {
      attr: { fill: WHITE },
      duration: 2.3,
      ease: "sine.inOut",
      delay: i * 0.06,
      yoyo: true,
      repeat: -1,
      repeatDelay: 0.4,
    });

    // Обратно к оригинальному (сдвиг для отсутствия пауз)
    gsap.to(el, {
      attr: { fill: original },
      duration: 2.3,
      ease: "sine.inOut",
      delay: 1.4 + i * 0.06,
      yoyo: true,
      repeat: -1,
      repeatDelay: 0.4,
    });
  });
}

window.addEventListener("load", () => {
  if (typeof gsap !== "undefined") {
    gsap.delayedCall(0.5, startPulsing);
  }
});

// Анимация бегущей строки\

function createUnifiedRunningText() {
  const svg = document.querySelector(".card2 svg");
  if (!svg) return;

  // Конфигурация строк (направление и диапазон Y)
  const textLinesConfig = [
    { name: "top", direction: 1, yRange: [50, 200] }, // вправо
    { name: "middle", direction: -1, yRange: [300, 450] }, // влево
    { name: "bottom", direction: 1, yRange: [550, 700] }, // вправо
  ];

  const SPEED = 40; // пикселей в секунду (одинаковая для всех строк)
  const GAP = 3; // пауза между циклами в секундах

  textLinesConfig.forEach((config) => {
    // Находим все текстовые path в данном диапазоне Y
    const textPaths = Array.from(
      svg.querySelectorAll('path[fill="#F2BED9"]')
    ).filter((path) => {
      const bbox = path.getBBox();
      const centerY = bbox.y + bbox.height / 2;
      return centerY >= config.yRange[0] && centerY <= config.yRange[1];
    });

    if (textPaths.length === 0) return;

    // Создаём группу-контейнер для строки
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("class", `running-text-${config.name}`);

    // Клонируем все элементы строки в группу
    textPaths.forEach((el) => {
      const clone = el.cloneNode(true);
      group.appendChild(clone);
      el.style.opacity = "0"; // скрываем оригинал
    });

    svg.appendChild(group);

    // Вычисляем реальную ширину строки (с учётом всех букв)
    const lineWidth = group.getBBox().width;

    // Начальная и конечная позиции
    const startX =
      config.direction > 0 ? svg.viewBox.baseVal.width + 50 : -lineWidth - 50;
    const endX =
      config.direction > 0 ? -lineWidth - 50 : svg.viewBox.baseVal.width + 50;

    // Длительность движения в секундах (одинаковая скорость для всех строк!)
    const duration = Math.abs(lineWidth / SPEED);

    // Бесконечная timeline
    const tl = gsap.timeline({
      repeat: -1,
      defaults: { ease: "none" },
    });

    tl.fromTo(
      group,
      { x: startX, opacity: 1 },
      { x: endX, opacity: 1, duration: duration + GAP }
    ).to(group, { opacity: 1, duration: 0.4 }, "-=0.4"); // плавное затухание перед рестартом
  });
}

// Запуск после загрузки страницы
document.addEventListener("DOMContentLoaded", () => {
  // Даём время на рендер SVG
  setTimeout(createUnifiedRunningText, 800);
});

// Анимация хаотичного движения

function initCard3Animation() {
  const svg = document.querySelector(".card3 svg");
  if (!svg) return;

  const container = { width: 627, height: 701 };
  const margin = 100;

  const shapes = svg.querySelectorAll("rect, circle, path");
  if (shapes.length === 0) return;

  const elements = Array.from(shapes).map((el) => {
    const tag = el.tagName.toLowerCase();
    let x, y;

    if (tag === "rect") {
      x = parseFloat(el.getAttribute("x") || 0);
      y = parseFloat(el.getAttribute("y") || 0);
    } else if (tag === "circle") {
      x = parseFloat(el.getAttribute("cx") || 0);
      y = parseFloat(el.getAttribute("cy") || 0);
    } else {
      const bbox = el.getBBox();
      x = bbox.x + bbox.width / 2;
      y = bbox.y + bbox.height / 2;
    }

    el.dataset.centerX = x;
    el.dataset.centerY = y;

    return {
      el,
      tag,
      x,
      y,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.max(el.getBBox().width, el.getBBox().height) / 2 + 30,
    };
  });

  function animate() {
    elements.forEach((item, i) => {
      let fx = 0;
      let fy = 0;

      elements.forEach((other, j) => {
        if (i === j) return;

        const dx = item.x - other.x;
        const dy = item.y - other.y;
        const dist = Math.hypot(dx, dy);
        const minDist = item.radius + other.radius;

        if (dist < minDist && dist > 1) {
          const force = Math.pow((minDist - dist) / minDist, 2) * 2;
          fx += (dx / dist) * force * 20;
          fy += (dy / dist) * force * 20;
        }
      });

      const strength = 0.08;
      if (item.x < margin) fx += (margin - item.x) * strength;
      if (item.x > container.width - margin)
        fx -= (item.x - (container.width - margin)) * strength;
      if (item.y < margin) fy += (margin - item.y) * strength;
      if (item.y > container.height - margin)
        fy -= (item.y - (container.height - margin)) * strength;

      fx += (Math.random() - 0.5) * 0.3;
      fy += (Math.random() - 0.5) * 0.3;

      item.vx += fx * 0.005;
      item.vy += fy * 0.005;

      item.vx *= 0.995;
      item.vy *= 0.995;

      const minSpeed = 0.2;
      const speed = Math.hypot(item.vx, item.vy);
      if (speed < minSpeed) {
        const scale = minSpeed / speed;
        item.vx *= scale;
        item.vy *= scale;
      }

      item.x += item.vx;
      item.y += item.vy;

      if (item.tag === "rect") {
        gsap.set(item.el, {
          attr: { x: item.x, y: item.y },
        });
      } else if (item.tag === "circle") {
        gsap.set(item.el, {
          attr: { cx: item.x, cy: item.y },
        });
      } else {
        const offsetX = item.x - item.el.dataset.centerX;
        const offsetY = item.y - item.el.dataset.centerY;
        gsap.set(item.el, {
          x: offsetX,
          y: offsetY,
        });
      }
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(animate);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".card3")) {
    setTimeout(initCard3Animation, 500);
  }
});

// Анимация белых кружочков
// universal-white-circles-animation.js
// Работает для .card5 и .card8 (и любых похожих карточек с белыми кружками)

function initWhiteCirclesAnimation() {
  // Поддерживаемые карточки
  const cards = document.querySelectorAll(".card5, .card8");
  if (cards.length === 0) return;

  cards.forEach((card) => {
    const svg = card.querySelector("svg");
    if (!svg) return;

    // Определяем размеры контейнера по viewBox или width/height
    const viewBox = svg.viewBox.baseVal;
    const container = {
      width: viewBox
        ? viewBox.width
        : parseFloat(svg.getAttribute("width") || 600),
      height: viewBox
        ? viewBox.height
        : parseFloat(svg.getAttribute("height") || 1400),
    };

    const margin = 100; // отступ от краёв

    // Находим только белые КРУГИ (path с fill="white" и круглой формой через C...Z)
    const whiteCircles = Array.from(
      svg.querySelectorAll('path[fill="white"]')
    ).filter((path) => {
      const d = path.getAttribute("d");
      return d && d.includes("C") && d.includes("Z"); // типичный признак круга в path
    });

    if (whiteCircles.length === 0) return;

    const elements = whiteCircles.map((circle) => {
      const bbox = circle.getBBox();
      const cx = bbox.x + bbox.width / 2;
      const cy = bbox.y + bbox.height / 2;

      circle.dataset.cx = cx;
      circle.dataset.cy = cy;

      return {
        el: circle,
        x: cx,
        y: cy,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: bbox.width / 2 + 25,
      };
    });

    function animate() {
      elements.forEach((item) => {
        let fx = 0;
        let fy = 0;

        // Отталкивание от других кружков
        elements.forEach((other) => {
          if (item === other) return;

          const dx = item.x - other.x;
          const dy = item.y - other.y;
          const dist = Math.hypot(dx, dy);
          const minDist = item.radius + other.radius;

          if (dist < minDist && dist > 1) {
            const force = Math.pow((minDist - dist) / minDist, 2) * 1.3;
            fx += (dx / dist) * force * 14;
            fy += (dy / dist) * force * 14;
          }
        });

        // Отталкивание от границ
        const wallForce = 0.05;
        if (item.x < margin) fx += (margin - item.x) * wallForce;
        if (item.x > container.width - margin)
          fx -= (item.x - (container.width - margin)) * wallForce;
        if (item.y < margin) fy += (margin - item.y) * wallForce;
        if (item.y > container.height - margin)
          fy -= (item.y - (container.height - margin)) * wallForce;

        // Слабое блуждание
        fx += (Math.random() - 0.5) * 0.18;
        fy += (Math.random() - 0.5) * 0.18;

        // Обновление скорости
        item.vx += fx * 0.0035;
        item.vy += fy * 0.0035;

        item.vx *= 0.997;
        item.vy *= 0.997;

        // Минимальная скорость для постоянного движения
        const minSpeed = 0.13;
        const speed = Math.hypot(item.vx, item.vy);
        if (speed < minSpeed) {
          const scale = minSpeed / speed;
          item.vx *= scale;
          item.vy *= scale;
        }

        item.x += item.vx;
        item.y += item.vy;

        // Применяем смещение
        const offsetX = item.x - item.el.dataset.cx;
        const offsetY = item.y - item.el.dataset.cy;

        gsap.set(item.el, {
          x: offsetX,
          y: offsetY,
        });
      });

      requestAnimationFrame(animate);
    }

    // Запуск анимации для этой карточки
    requestAnimationFrame(() => requestAnimationFrame(animate));
  });
}

// Автозапуск при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".card5") || document.querySelector(".card8")) {
    setTimeout(initWhiteCirclesAnimation, 600);
  }
});

// Анимация повляения текста со стрелками

// universal-card6-card9-spring-animation.js
// Работает для .card6 и .card9

function initSpringLinesAnimation() {
  const cards = document.querySelectorAll(".card6, .card9");
  if (cards.length === 0) return;

  cards.forEach((card) => {
    const svg = card.querySelector("svg");
    if (!svg) return;

    const viewBox = svg.viewBox.baseVal;
    const width = viewBox
      ? viewBox.width
      : parseFloat(svg.getAttribute("width") || 1900);

    // Только текст и стрелки (исключаем фон)
    const movablePaths = Array.from(svg.querySelectorAll("path")).filter(
      (path) => {
        const fill = path.getAttribute("fill");
        return fill === "white" || fill === "#FBFBFB" || fill === "#F2BED9";
      }
    );

    if (movablePaths.length === 0) return;

    // Группы по Y-центру
    const groups = [[], [], []];

    movablePaths.forEach((path) => {
      const bbox = path.getBBox();
      const centerY = bbox.y + bbox.height / 2;

      if (centerY < 280) groups[0].push(path); // верхняя строка
      else if (centerY < 520) groups[1].push(path); // средняя строка
      else groups[2].push(path); // нижняя строка
    });

    const directions = ["rtl", "ltr", "rtl"]; // направления

    const springDuration = 1.6;
    const holdDuration = 3.2;
    const fadeDuration = 1.3;
    const pauseBetweenCycles = 2.0;

    groups.forEach((groupPaths, index) => {
      if (groupPaths.length === 0) return;

      const container = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g"
      );
      container.classList.add(`spring-line-${index + 1}`);

      groupPaths.forEach((original) => {
        const clone = original.cloneNode(true);
        container.appendChild(clone);
        original.style.opacity = "0";
      });

      svg.appendChild(container);

      const isRTL = directions[index] === "rtl";
      const startX = isRTL ? width + 400 : -width - 400;
      const endX = isRTL ? -width - 400 : width + 400;

      gsap.set(container, { x: startX, opacity: 0 });

      function runCycle() {
        gsap
          .timeline()
          .to(container, {
            x: 0,
            opacity: 1,
            duration: springDuration,
            ease: "elastic.out(1, 0.35)",
          })
          .to(container, { duration: holdDuration })
          .to(container, {
            x: endX,
            opacity: 0,
            duration: fadeDuration,
            ease: "power2.in",
          })
          .to(container, { duration: pauseBetweenCycles })
          .call(() => {
            gsap.set(container, { x: startX, opacity: 0 });
            runCycle();
          });
      }

      // Запуск с небольшой задержкой по строкам
      gsap.delayedCall(index * 2.4, runCycle);
    });
  });
}

// Автозапуск
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".card6") || document.querySelector(".card9")) {
    setTimeout(initSpringLinesAnimation, 600);
  }
});

// Анимация круга

// card7-pulsing-rotation.js
function initCard7Pulsing() {
  const svg = document.querySelector(".card7 svg");
  if (!svg) return;

  const wheel = svg.querySelector("g[clip-path]");
  if (!wheel) return;

  gsap.set(wheel, { transformOrigin: "50% 50%" });

  gsap.to(wheel, {
    rotation: 360,
    duration: 40,
    ease: "none",
    repeat: -1,
  });

  gsap.to(wheel, {
    rotation: "+=15",
    duration: 2,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".card7")) {
    setTimeout(initCard7Pulsing, 600);
  }
});

// Анимация Шторки 2

// animation.js
document.addEventListener("DOMContentLoaded", function () {
  // Регистрируем плагин ScrollTrigger (GSAP уже должен быть подключён в HTML)
  gsap.registerPlugin(ScrollTrigger);

  // Создаём timeline с ScrollTrigger
  gsap
    .timeline({
      scrollTrigger: {
        trigger: ".bottom-card1", // элемент, который отслеживаем
        start: "top 80%", // анимация начинается, когда верх карточки на 80% экрана
        toggleActions: "play none none reverse", // играет при входе, откат при выходе вверх
      },
    })
    .to(".reveal-clip", {
      clipPath: "inset(0 0% 0 0)", // полностью раскрываем волну
      duration: 1.8,
      ease: "power4.out", // плавный и мощный выход
    })
    .to(
      ".text-fade",
      {
        opacity: 1,
        y: 0, // убираем смещение вверх
        duration: 1.4,
        ease: "power4.out",
      },
      "-=1.2" // текст начинает появляться раньше окончания волны
    );
});

// Анимация Шариков

// animation.js

// Убедимся, что GSAP загружен и DOM готов
document.addEventListener("DOMContentLoaded", function () {
  gsap
    .timeline()
    // Красный текст PONY сверху — появляется по буквам
    .from(".red-pony path", {
      y: -50,
      opacity: 0,
      rotation: -30,
      duration: 0.8,
      ease: "bounce.out",
      stagger: 0.07,
    })

    // Большие круги P → O → N → Y (эластичное появление)
    .from(
      ".circle-p",
      { y: 100, scale: 0, opacity: 0, duration: 1, ease: "elastic.out(1,0.5)" },
      "-=0.5"
    )
    .from(
      ".circle-o",
      { y: 100, scale: 0, opacity: 0, duration: 1, ease: "elastic.out(1,0.5)" },
      "-=0.7"
    )
    .from(
      ".circle-n",
      { y: 100, scale: 0, opacity: 0, duration: 1, ease: "elastic.out(1,0.5)" },
      "-=0.7"
    )
    .from(
      ".circle-y",
      { y: 100, scale: 0, opacity: 0, duration: 1, ease: "elastic.out(1,0.5)" },
      "-=0.7"
    )

    // Ножки — вырастают снизу вверх
    .from(
      ".leg-p, .leg-o, .leg-n, .leg-y",
      {
        scaleY: 0,
        transformOrigin: "top center",
        duration: 0.8,
        ease: "back.out(1.7)",
        stagger: 0.1,
      },
      "-=2"
    )

    // Буквы внутри кругов (P, O, N, Y)
    .from(
      ".letter-p path, .letter-o path, .letter-n path, .letter-y path",
      {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(2)",
        stagger: 0.2,
      },
      "-=1.5"
    )

    // Конфетти — бесконечный плавный полёт
    .to(
      ".confetti-circle",
      {
        x: "+=120",
        y: "-=180",
        rotation: "+=360",
        opacity: 0.7,
        duration: () => 12 + Math.random() * 12, // разная скорость у каждого
        ease: "none",
        repeat: -1,
        stagger: {
          each: 0.4,
          from: "random",
        },
      },
      "-=4"
    )

    // Пульсация конфетти (увеличение/уменьшение)
    .to(
      ".confetti-circle",
      {
        scale: 1.5,
        duration: () => 1.8 + Math.random() * 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: {
          each: 0.3,
          from: "random",
        },
      },
      "-=20"
    );
});
