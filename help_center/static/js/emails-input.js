function EmailsInput(inputContainerNode) {
	var _this = this // store a reference to the object context

	this.container = inputContainerNode

	this.inputEl = document.createElement('input')

	let inputData = document.getElementById('email_data')

	this.controlVPressed = false

	this.validEmailCount = 0

	this.render = () => {
		_this.inputEl.placeholder = 'Enter email addresses...'
		_this.inputEl.addEventListener('input', (e) => {
			if (_this.controlVPressed) {
				if (_this.inputEl.value.includes(',')) {
					const emailList = _this.inputEl.value.split(',')
					for (let item of emailList) {
						let emailAddress = item.trim()
						_this.inputEl.value = emailAddress
						updateUI()
					}
				} else {
					updateUI()
				}
			}
		})
		_this.inputEl.addEventListener('focusout', (event) => {
			if (_this.inputEl.value)
				updateUI()
		})
		_this.inputEl.onkeyup = (event) => {
			const key = event.key || event.keyCode;
			// Number 13 is the "Enter" key, 
			// Number 188 is the comma on the keyboard
			// 
			if (
				(key === 13 || key === 'Enter') || (key === 188 || key === ',') || (key === 32 || key === ' ')
			) {
				updateUI()
			}
		}
		_this.inputEl.onkeydown = (event) => {
			const key = event.key || event.keyCode;
			if ((key === 86 || key === 'v') && (event.metaKey || event.ctrlKey)) {
				// Ctrl+V or Cmd+V pressed?
				_this.controlVPressed = true
			} else _this.controlVPressed = false
		}
		_this.container.appendChild(_this.inputEl)
	}

	this.getEmailCount = () => { return _this.validEmailCount }

	this.addEmail = () => {
		const emailAddress = getRandomEmail("@gigi.com", 15)
		_this.inputEl.value = emailAddress
		updateUI()
	}

	function updateUI() {
		let divEl = document.createElement("button") // create a new div element
		divEl.setAttribute('type', 'button')
		var str = getText()
		str = str.replace(/\s+/g, '');
		const inputValue = str
		if (validateEmail(inputValue)) {
			divEl.innerHTML = inputValue // assign text value
			_this.validEmailCount += 1 // increase count
			getData(inputValue)
		}
		else {
			divEl.classList.add('invalid')
			divEl.innerHTML = inputValue // assign text value
			divEl.setAttribute('data-toggle', 'tooltip')
			divEl.setAttribute('title', 'Invalid Email')
		}
		let imageEl = document.createElement("div")
		imageEl.classList.add('fas')
		imageEl.classList.add('fa-times')
		imageEl.classList.add('remEmail')
		imageEl.onclick = () => {
			var em_data = divEl.innerText + ",";
			inputData.value = inputData.value.replace(em_data, '');
			divEl.remove()
			_this.validEmailCount -= 1 // decrease count
		}
		divEl.appendChild(imageEl)
		_this.inputEl.before(divEl) // add it previous
		_this.inputEl.value = '' // clear

		// scroll down
		_this.container.scrollBy(0, _this.container.scrollHeight)
	}

	function validateEmail(email) {
		const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	}

	function getText() {
		const keyword = _this.inputEl.value
		// last char
		const lastChar = keyword[keyword.length - 1]
		// 10 is a new line character
		// 44 is a comma character
		if (lastChar.charCodeAt() === 10 || lastChar.charCodeAt() === 44) {
			return _this.inputEl.value.slice(0, _this.inputEl.value.length - 1)
		}
		return _this.inputEl.value
	}

	function getData(value) {
		var val = inputData.value + value + ','
		inputData.value = val
    }

	function getRandomEmail(domain, length) {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for (var i = 0; i < length; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text + domain;
	}

}