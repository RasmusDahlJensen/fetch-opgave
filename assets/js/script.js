//Initial empty array
const employees = [];
//API endpoint
const endpoint = "https://reqres.in/api/users";

//Fetch data
fetch(endpoint)
	.then((result) => result.json())
	.then((data) => employees.push(data.data))
	.catch((error) => console.error(error))
	.finally(() => {
		employees[0].map((employee) => render(employee));
	});

const render = (employee) => {
	//Fetch dom elements
	const employeeContainer = document.getElementById("employees");
	//Destructuring
	let { email, first_name, last_name, avatar } = employee;
	//manipulate dom
	employeeContainer.innerHTML += `
    <div class="position">
        <div class="card">
            <div class="minimized">
                <img src="${avatar}">
                <p>${first_name} ${last_name}</p>
            </div>
            <div class="maximised" style="display: none;">
                <p class="email">Email:${email}</p>
                <p class="description">Employee description</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Phasellus consectetur ligula quis sem iaculis, eu tincidunt lectus porta.</p>
            </div>
        </div>
    <div>
    
    `;
	const cards = document.querySelectorAll(".card");
	//when all cards are rendered on the screen then run the eventHandler function
	if (cards.length == employees[0].length) {
		eventHandlers();
	}
};

const eventHandlers = () => {
	const cards = document.querySelectorAll(".card");
	cards.forEach((card) => {
		card.addEventListener("click", (event) => {
			expandCard(event.currentTarget);
		});
	});
};

//Expand card and show email and description
const expandCard = (card) => {
	if (!card.classList.contains("expand")) {
		card.classList.add("expand");
		card.querySelector(".maximised").style.display = "";
	} else {
		card.classList.remove("expand");
		card.querySelector(".maximised").style.display = "none";
	}
};

//Burgermenu
const burgerClosed = document.getElementById("burgerMenu");
const burgerOpen = document.getElementById("burgerMenuOpen");
const links = document.getElementById("navLinks");

burgerClosed.addEventListener("click", () => {
	if (links.classList.contains("hide")) {
		//Show links
		links.classList.remove("hide");

		//transition burger menu icon
		burgerClosed.classList.add("hide");
		burgerOpen.classList.remove("hide");
	}
});

burgerOpen.addEventListener("click", () => {
	if (!links.classList.contains("hide")) {
		//Hide links
		links.classList.add("hide");
		//Transition burgermenu icon
		burgerOpen.classList.add("hide");
		burgerClosed.classList.remove("hide");
	}
});
