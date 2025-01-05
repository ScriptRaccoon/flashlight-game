// @ts-check

// CONSTANTS AND VARIABLES

const LEVELS = Object.freeze([
	{
		heading: "The Flashlight Game 🔦",
		texts: [
			"The goal is to use your flashlight to find a letter which is not like the other ones. Click on the odd letter to complete the level!",
			`In the first level, you need to look for the red letter such as <span class="colored">a</span>.`,
			"PS: Your flashlight becomes smaller over time ...",
		],
		class_name: "colored",
	},
	{
		heading: "Level 1 complete!",
		texts: [
			"Right here! That was a bit easy, right?",
			`In the next level, you need to find the letter which is bigger such as <span class="bigger">b</span>.`,
		],
		class_name: "bigger",
	},
	{
		heading: "Level 2 complete!",
		texts: [
			"This is still a warm-up!",
			`In the next level, you need to find the letter which is underlined such as <span class="underlined">c</span>.`,
		],
		class_name: "underlined",
	},
	{
		heading: "Level 3 complete!",
		texts: [
			"Well done!",
			`In the next level, you need to find the letter which is shifted downwards like <span class="shifted">d</span>.`,
		],
		class_name: "shifted",
	},
	{
		heading: "Level 4 complete!",
		texts: [
			"Wow, that was fast! But now it gets harder!",
			`In the next level, you need to find the letter which is boldface such as <span class="boldface">e</span>.`,
		],
		class_name: "boldface",
	},
	{
		heading: "Level 5 complete!",
		texts: [
			"Great! Are you up for another challenge?",
			`In the next level, you need to find the letter which is flipped horizontally like <span class="flipped">f</span>.`,
			"No worries, symmetric letters such as x will not be used.",
		],
		class_name: "flipped",
		forbidden: ["i", "I", "l", "x", "X", "o", "O", "p", "q", "v"],
	},
	{
		heading: "Level 6 complete!",
		texts: [
			"Did someone already tell you how great your eyes are?",
			`In the next level, you need to find the letter which is in Times New Roman like <span class="times">g</span>.`,
		],
		class_name: "times",
	},
	{
		heading: "Level 7 complete!",
		texts: [
			"Yes, you nailed it!",
			`In the next level, you need to find the letter which is opaque such as <span class="opaque">h</span>.`,
		],
		class_name: "opaque",
	},
	{
		heading: "Level 8 complete!",
		texts: [
			"I bet you won't solve the next one.",
			`In the next level, you need to find the letter which is occasionally jumping such as <span class="jumping">i</span> (wait for it).`,
		],
		class_name: "jumping",
	},
	{
		heading: "Level 9 complete!",
		texts: [
			"Awesome! The jumper couldn't hide in front of you!",
			`In the next and last level, you need to find the letter which is vanishing when you hover it such as:<br><span class="vanishes">[hover me]</span>`,
		],
		class_name: "vanishes",
	},
	{
		heading: "Won!",
		texts: ["Congratulations! All 10 levels are complete."],
	},
])

const forbidden_characters = [" ", "\n", "\t", "\r", ".", ",", "!", "?"]

let current_level_index = 0

const initial_light_size = 400
let light_size = initial_light_size

// WARNING FOR TOUCH DEVICES

const warning_message =
	"It seems you are currently on a touch device. This game requires a mouse to work."

const has_hover_effects = window.matchMedia("(hover: hover)").matches
if (!has_hover_effects) alert(warning_message)

// HTML ELEMENTS

const overlay = document.getElementById("overlay")

const paragraphs = /** @type {HTMLParagraphElement[]} */ (
	Array.from(document.querySelectorAll("main p"))
)

// DIALOG STARTING THE GAME

function construct_dialog() {
	const dialog = document.createElement("dialog")
	dialog.className = "dialog"

	const current_level = LEVELS[current_level_index]

	const heading = document.createElement("h1")
	heading.innerText = current_level.heading
	dialog.appendChild(heading)

	for (const text of current_level.texts) {
		const paragraph = document.createElement("p")
		paragraph.innerHTML = text
		dialog.appendChild(paragraph)
	}

	const is_last = current_level_index === LEVELS.length - 1

	const button = document.createElement("button")
	button.innerText = is_last ? "Ok" : "Start level"
	button.className = "primary"

	button.addEventListener("click", () => {
		dialog.remove()
		if (!is_last) adjust_letter()
	})

	dialog.appendChild(button)

	document.body.appendChild(dialog)
	dialog.showModal()
}

construct_dialog()

// SHRINK LIGHT

function shrink_light() {
	if (light_size > 0) {
		light_size--
		update_light_size()
	}
}

function update_light_size() {
	overlay?.style.setProperty("--light-size", `${light_size}px`)
}

update_light_size()

// UPDATE OVERLAY POSITION

/**
 * @param {MouseEvent} e
 */
function update_overlay_position(e) {
	const x = e.clientX
	const y = e.clientY
	overlay?.style.setProperty("--x", `${x}px`)
	overlay?.style.setProperty("--y", `${y}px`)
}

window.addEventListener("mousemove", update_overlay_position)

// MAIN FUNCTION: ADJUST RANDOM LETTER

function adjust_letter() {
	const interval = setInterval(shrink_light, 500)

	const level = LEVELS[current_level_index]
	const class_name = level.class_name
	const paragraph = paragraphs[random_integer(0, paragraphs.length)]
	const text = paragraph.innerText

	let index = random_integer(0, text.length)
	let letter = text[index]

	while (
		forbidden_characters.includes(letter) ||
		level.forbidden?.includes(letter)
	) {
		index = random_integer(0, text.length)
		letter = text[index]
	}

	const text_before = text.slice(0, index)
	const text_after = text.slice(index + 1)

	const button = document.createElement("button")
	button.innerText = letter
	button.className = class_name ?? ""
	button.tabIndex = -1

	button.addEventListener("click", () => {
		clearInterval(interval)
		paragraph.innerText = text
		light_size = initial_light_size
		update_light_size()
		increase_level()
	})

	paragraph.innerHTML = ""
	paragraph.append(text_before, button, text_after)
}

function increase_level() {
	if (current_level_index < LEVELS.length - 1) {
		current_level_index++
		construct_dialog()
	}
}

// UTILITIES

/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function random_integer(a, b) {
	return a + Math.floor(Math.random() * (b - a))
}
