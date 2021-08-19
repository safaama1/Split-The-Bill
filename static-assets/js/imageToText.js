var input = document.getElementById('image');
input.addEventListener('change', () => {
	if (!input.files) {
		return null;
	}
	Tesseract.recognize(input.files[0],'eng',{logger:m =>{console.log(m); q.innerHTML+=m;}})
		.then(result=>{
			console.log(result.data.text);
		}).catch((err) => {
			console.log(err.message);
		});


});

