import "swiper/swiper.min.css";
import '../styles/reset.scss';
import '../styles/style.scss';

import Swiper, { Navigation } from "swiper";
import { languages } from "./languages";

Swiper.use([Navigation]);

const header = document.querySelector('.header');
const menuLinks = document.querySelectorAll('.menu-link');
const menuButton = document.querySelector('.header-menu__button');
const menuCloseButton = document.querySelector('.header-menu__close');
const classes = {
  opened: 'opened', hidden: 'hidden', active: 'active',
};
let isPlay = false;
const video = document.querySelector('video');
video.volume = 0.2;
const videoButton = document.querySelector('.video-btn');
const checkbox = document.querySelectorAll('.checkbox');
const checkboxes = {
  requirements: ["minimum", "recommended"], versions: ["standard", "limited"],
};
const faqItem = document.querySelectorAll(".faq-item");
const sections = document.querySelectorAll(".section");
const language = document.querySelectorAll(".language");
const buyButton = document.querySelectorAll(".buy-button");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const modalTitle = document.querySelector(".modal-version");
const modalPrice = document.querySelector(".modal-total__price");
const modalClose = document.querySelector(".modal-close");
const values = [
  {
    price: 19.99,
    title: "Standard Edition",
  },
  {
    price: 18.99,
    title: "Standard Edition",
  },
  {
    price: 29.99,
    title: "Deluxe Edition",
  },
  {
    price: 68.99,
    title: "Deluxe Edition + DualSense",
  },
];

const toggleMenu = () => {
  document.body.classList.toggle(classes.opened);
  header.classList.toggle(classes.opened);
};

const scrollToSection = (e) => {
  e.preventDefault();

  toggleMenu();

  const href = e.currentTarget.getAttribute('href');

  if (!href && !href.startsWith('#')) return;

  const section = href.slice(1);
  const top = document.getElementById(section)?.offsetTop || 0;

  window.scrollTo({
    top: top - 20, behavior: 'smooth',
  })
};

const formatValue = (value) => (value < 10 ? `0${value}` : value);

const getTimerValues = (diff) => ({
  seconds: (diff / 1000) % 60,
  minutes: (diff / (1000 * 60)) % 60,
  hours: (diff / (1000 * 3600)) % 24,
  days: (diff / (1000 * 3600 * 24)) % 30,
});

const setTimerValues = (values) => {
  Object.entries(values).forEach(([key, value]) => {
    const timerValue = document.getElementById(key);
    timerValue.innerText = formatValue(Math.floor(value));
  });
};

const startTimer = (date) => {
  const id = setInterval(() => {
    const diff = new Date(date).getTime() - new Date().getTime();

    if (diff < 0) {
      clearInterval(id);
      return;
    }

    setTimerValues(getTimerValues(diff));
  }, 1000);
};

const handleVideo = ({target}) => {
  const info = target.parentElement;

  isPlay = !isPlay;
  info.classList.toggle(classes.hidden, isPlay);
  target.innerText = isPlay ? 'Pause' : 'Play';
  isPlay ? video.play() : video.pause();
};

const handleCheckbox = ({currentTarget: {checked, name}}) => {
  const {active} = classes;
  const value = checkboxes[name][Number(checked)];
  const list = document.getElementById(value);
  const tabs = document.querySelectorAll(`[data-${name}]`);
  const siblings = list.parentElement.children;

  for (const item of siblings) item.classList.remove(active);
  for (const tab of tabs) {
    tab.classList.remove(active);
    tab.dataset[name] === value && tab.classList.add(active);
  }

  list.classList.add(active);
};

const initSlider = () => {
  new Swiper(".swiper", {
    loop: true,
    slidesPerView: 3,
    spaceBetween: 20,
    initialSlide: 2,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 1,
      },
      // when window width is >= 480px
      100: {
        slidesPerView: 2,
      },
      // when window width is >= 640px
      1400: {
        slidesPerView: 3,
      }
    }
  });
};

const handleFaqItem = ({currentTarget: target}) => {
  target.classList.toggle(classes.opened);
  const isOpened = target.classList.contains(classes.opened);
  const height = target.querySelector(".faq-item__content p").clientHeight;
  const content = target.querySelector(".faq-item__content");

  content.style.height = `${isOpened ? height : 0}px`;
};

const handleScroll = () => {
  const {scrollY: y, innerHeight: h} = window;
  sections.forEach((sec) => {
    if (y > sec.offsetTop - h / 1.5) sec.classList.remove(classes.hidden);
  });
};

const setTexts = () => {
  const lang = localStorage.getItem("lang") || "en";
  const content = languages[lang];

  Object.entries(content).forEach(([key, value]) => {
    const items = document.querySelectorAll(`[data-text="${key}"]`);
    items.forEach((item) => (item.innerText = value));
  });
};

const toggleLanguage = ({ target }) => {
  const { lang } = target.dataset;

  if (!lang) return;

  localStorage.setItem("lang", lang);
  setTexts();
};

const handleBuyButton = ({ currentTarget: target }) => {
  const { value } = target.dataset;

  if (!value) return;

  const { price, title } = values[value];

  modalTitle.innerText = title;
  modalPrice.innerText = `${price}$`;
  document.body.classList.add(classes.opened);
  modal.classList.add(classes.opened);
  overlay.classList.add(classes.opened);
};

const closeModal = () => {
  document.body.classList.remove(classes.opened);
  modal.classList.remove(classes.opened);
  overlay.classList.remove(classes.opened);
};

setTexts();
initSlider();
startTimer("November 30, 2023 00:00:00");

menuButton.addEventListener('click', toggleMenu);
menuCloseButton.addEventListener('click', toggleMenu);
videoButton.addEventListener('click', handleVideo);
window.addEventListener("scroll", handleScroll);

menuLinks.forEach((link) => link.addEventListener('click', scrollToSection));
checkbox.forEach((box) => box.addEventListener('click', handleCheckbox));
faqItem.forEach((item) => item.addEventListener("click", handleFaqItem));
buyButton.forEach((item) => item.addEventListener("click", handleBuyButton));
language.forEach((lang) => lang.addEventListener("click", toggleLanguage));
modalClose.addEventListener("click", closeModal);
