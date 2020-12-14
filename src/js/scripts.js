import { setupFullpage } from "./setups/setupFullpage";
import Portfolio from "./components/Portfolio";
import "./setups/resetAlert";
import CustomModal from "./components/Modal";
// import Form from "./components/Form";

document.addEventListener("DOMContentLoaded", function() {
	setupFullpage(".main-content");
	const portfolio = new Portfolio(".portfolio-container");
	window.portfolioShown = portfolio.mixer.getState().matching;
	const portfolioModal = new CustomModal(
		document.getElementById("portfolio-item"),
		window.portfolioShown
	);
	document.body.classList.remove("loader-open");
	document.getElementById("intro").classList.add("start-animation");

	document.getElementById("intro").addEventListener("animationend", e => {
		// check if it's the latest animated element
		if (e.target.classList.contains("intro-menu")) {
			document.querySelector(".btn-skip") &&
				document.querySelector(".btn-skip").classList.add("d-none");
		}
	});
});
