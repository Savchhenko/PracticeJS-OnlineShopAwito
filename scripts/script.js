"use strict";

const modalAdd = document.querySelector(".modal__add"),
	addAd = document.querySelector(".add__ad"),
	modalBtnSubmit = document.querySelector(".modal__btn-submit"),
	modalSubmit = document.querySelector(".modal__submit"),
	catalog = document.querySelector(".catalog"),
	modalItem = document.querySelector(".modal__item"),
	modalBtnWarning = document.querySelector(".modal__btn-warning");

const elementsModalSubmit = [...modalSubmit.elements] //получили элементы из модального окна, кроме кнопок
	.filter((elem) => elem.tagName !== "BUTTON");

const closeModal = (event) => {
	const target = event.target;
	if (target.classList.contains("modal__close") || target === modalAdd || target === modalItem) {
		modalAdd.classList.add("hide");
		modalItem.classList.add("hide");
		modalSubmit.reset(); // сделали очистку формы
	}
};
/* 
другой вариант этой функции (через this)
const closeModal = function(event) {
	const target = event.target;
	if (target.closest('.modal__close') || target === this) {
		this.classList.add('hide');
		if (this === modalAdd) {
			modalSubmit.reset();
		}
	}
};
*/

// закрытие модального окна по кнопке Escape
const closeModalEsc = (event) => {
	if (event.code === "Escape") {
		modalAdd.classList.add("hide");
		modalItem.classList.add("hide");
		modalSubmit.reset();
		document.removeEventListener("keydown", closeModalEsc); // удалили это событие после его выполнения
	}
};

modalSubmit.addEventListener("input", () => {
	const validForm = elementsModalSubmit.every((elem) => elem.value); // если все поля ввода будут заполнены, значение поменяется на true
	modalBtnSubmit.disabled = !validForm; // снимаем блокировку кнопки
	modalBtnWarning.style.display = validForm ? "none" : ""; // убрали надпись "Заполните все поля"
	/* или убрать надпись можно так:
	if (validForm) {
		modalBtnWarning.style.display = 'none'
	} else {
		modalBtnWarning.style.display = ''
	}
	*/
});

addAd.addEventListener("click", () => {
	modalAdd.classList.remove("hide");
	modalBtnSubmit.disabled = true;
	document.addEventListener("keydown", closeModalEsc);
});

modalAdd.addEventListener("click", closeModal);
modalItem.addEventListener("click", closeModal);

catalog.addEventListener("click", (event) => {
	const target = event.target;

	if (target.closest(".card")) {
		modalItem.classList.remove("hide");
		document.addEventListener("keydown", closeModal);
	}
});

// оформим проверку на полное заполнение формы модального окна
// если все поля будут заполнены, то надпись пропадет
