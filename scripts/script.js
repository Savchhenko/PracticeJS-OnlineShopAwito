"use strict";

const modalAdd = document.querySelector(".modal__add"),
	addAd = document.querySelector(".add__ad"),
	modalBtnSubmit = document.querySelector(".modal__btn-submit"),
	modalSubmit = document.querySelector(".modal__submit"),
	catalog = document.querySelector(".catalog"),
	modalItem = document.querySelector(".modal__item");

const closeModal = (event) => {
	const target = event.target;
	if (target.classList.contains("modal__close") || target === modalAdd || target === modalItem) {
		modalAdd.classList.add("hide");
		modalItem.classList.add("hide");
		modalSubmit.reset(); // сделали очистку формы
	}
};

// закрытие модального окна по кнопке Escape
const closeModalEsc = (event) => {
	console.log("close");

	if (event.code === "Escape") {
		modalAdd.classList.add("hide");
		modalItem.classList.add("hide");
		document.removeEventListener("keydown", closeModalEsc);
	}
};

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
