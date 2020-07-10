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
	modalBtnWarning = document.querySelector(".modal__btn-warning"),
	modalFileInput = document.querySelector(".modal__file-input"),
	modalFileBtn = document.querySelector(".modal__file-btn"),
	modalImageAdd = document.querySelector(".modal__image-add");

const textFileBtn = modalFileBtn.textContent;
const srcModalImage = modalImageAdd.src;

const elementsModalSubmit = [...modalSubmit.elements] //получили элементы из модального окна, кроме кнопок
	.filter((elem) => elem.tagName !== "BUTTON");

const infoPhoto = {};

const saveDB = () => localStorage.setItem("awito", JSON.stringify(dataBase)); // отправляем данные в LocalStorage

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
		modalImageAdd.src = srcModalImage;
		modalFileBtn.textContent = textFileBtn;
		checkForm(); //возвращаем наш warning
	}
};

const renderCard = () => {
	catalog.textContent = "";

	dataBase.forEach((item, i) => {
		catalog.insertAdjacentHTML(
			"beforeend",
			`
			<li class="card" data-id="${i}">
				<img class="card__image" src="data:image/jpeg;base64,${item.image}" alt="test" />
				<div class="card__description">
					<h3 class="card__header">${item.nameItem}</h3>
					<div class="card__price">${item.costItem} ₽</div>
				</div>
			</li>
		`
		);
	});
};

modalFileInput.addEventListener("change", (event) => {
	const target = event.target;

	const reader = new FileReader(); //создали объект для чтения картинки

	const file = target.files[0];

	infoPhoto.filename = file.name;
	infoPhoto.size = file.size;

	reader.readAsBinaryString(file);

	reader.addEventListener("load", (event) => {
		if (infoPhoto.size < 200000) {
			modalFileBtn.textContent = infoPhoto.filename; // записали имя картинки
			infoPhoto.base64 = btoa(event.target.result);
			modalImageAdd.src = `data:image/jpeg;base64,${infoPhoto.base64}`; // отобразили картинку в объявлении
		} else {
			modalFileBtn.textContent = "Размер файла не должен превышать 200кб";
			modalFileInput.value = "";
			checkForm();
		}
	});
});

modalSubmit.addEventListener("input", checkForm);

modalSubmit.addEventListener("submit", (event) => {
	event.preventDefault(); // чтобы страница не перезагружалась после нажатия на кнопку "отправить"
	const itemObj = {};
	for (const elem of elementsModalSubmit) {
		itemObj[elem.name] = elem.value;
	}
	itemObj.image = infoPhoto.base64; //добавили к объекту картинку
	dataBase.push(itemObj); // добавили itemObj в dataBase
	closeModal({ target: modalAdd });
	saveDB();
	renderCard();
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

renderCard();

// напишем функцию, которая будет создавать карточки на основе нашей базы данных
