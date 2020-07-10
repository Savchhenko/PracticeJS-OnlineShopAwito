"use strict";

const dataBase = JSON.parse(localStorage.getItem("awito")) || []; // массив для хранения всех объявлений
// массив форматируется из строки в другой формат, который можно считывать
// но при отсутствии данных в LocalStorage, в массиве будет null, поэтому учитываем это,используя оператор ИЛИ и []

const modalAdd = document.querySelector(".modal__add"),
	addAd = document.querySelector(".add__ad"),
	modalBtnSubmit = document.querySelector(".modal__btn-submit"),
	modalSubmit = document.querySelector(".modal__submit"),
	catalog = document.querySelector(".catalog"),
	modalItem = document.querySelector(".modal__item"),
	modalBtnWarning = document.querySelector(".modal__btn-warning");

const elementsModalSubmit = [...modalSubmit.elements] //получили элементы из модального окна, кроме кнопок
	.filter((elem) => elem.tagName !== "BUTTON");

const saveDB = () => localStorage.setItem("awito", JSON.stringify(dataBase)); // отправляем данные в LocalStorage

console.log(dataBase);

//функция для проверки полей формы на заполненность
const checkForm = () => {
	const validForm = elementsModalSubmit.every((elem) => elem.value); // если все поля ввода будут заполнены, значение поменяется на true
	modalBtnSubmit.disabled = !validForm; // снимаем блокировку кнопки
	modalBtnWarning.style.display = validForm ? "none" : ""; // убрали надпись "Заполните все поля"
};

//функция закрытия окон
const closeModal = (event) => {
	const target = event.target;
	if (
		target.closest(".modal__close") ||
		target.classList.contains("modal") ||
		event.code === "Escape"
	) {
		modalAdd.classList.add("hide");
		modalItem.classList.add("hide");
		document.removeEventListener("keydown", closeModal);
		modalSubmit.reset(); //очистка формы
		checkForm(); //возвращаем наш warning
	}
};

modalSubmit.addEventListener("input", checkForm);

modalSubmit.addEventListener("submit", (event) => {
	event.preventDefault(); // чтобы страница не перезагружалась после нажатия на кнопку "отправить"
	const itemObj = {};
	for (const elem of elementsModalSubmit) {
		itemObj[elem.name] = elem.value;
	}
	dataBase.push(itemObj); // добавили itemObj в dataBase
	closeModal({ target: modalAdd });
	saveDB();
});

//открываем модальное окно
addAd.addEventListener("click", () => {
	modalAdd.classList.remove("hide");
	modalBtnSubmit.disabled = true;
	document.addEventListener("keydown", closeModal);
});

catalog.addEventListener("click", (event) => {
	const target = event.target;

	if (target.closest(".card")) {
		modalItem.classList.remove("hide");
		document.addEventListener("keydown", closeModal);
	}
});

modalAdd.addEventListener("click", closeModal);
modalItem.addEventListener("click", closeModal);
