const axios = require('axios')
const cheerio = require('cheerio')
const NumberConverter = require('number-converter').NumberConverter

// getting some hotbits!

const scrapeRandomNumber = () => {

	// good, old-fashioned web scraping
	// we'll just go ahead and make a request to the hotbits page
	return axios.get('https://www.fourmilab.ch/cgi-bin/Hotbits?nbytes=16&fmt=hex&npass=1&lpass=8&pwtype=3')
	.then(res => {
		// and then use cheerio to parse out the results!
		let $ = cheerio.load(res.data)
		let nc = new NumberConverter(NumberConverter.HEXADECIMAL, NumberConverter.DECIMAL)
		let scrapedHexadecimalNumber = $('pre').text().replace(/\n/g, '')
		
		// here's a little house keeping, because they give us a hexadecimal number
		// and I am operating under the assumption that we would rather have a decimal
		let randomNumber = nc.convert(scrapedHexadecimalNumber)

		console.log('Behold, our web-scraped random number', randomNumber)
		return randomNumber
	})
}

scrapeRandomNumber()


// aaaaand here's a pseudo random number generator

// first, let's generate our array of 12 random numbers
let genNumArr = () => {
	let numArr = []

	for(var i = 0; i < 12; i++){
		// here's where we use our system's nanosecond counter
		let nanoString = process.hrtime()[1].toString()
		let nanoSlice = nanoString.slice(nanoString.length - 2, nanoString.length)
		numArr.push(parseInt(nanoSlice))
	}
	return numArr
}

// then, we'll need a function to convert each number to the specified range
const convertVal = (oldValue, oldMax, oldMin) => {	
	let newMax = 0.5
	let newMin = -0.5

	let oldRange = (oldMax - oldMin)  
	let newRange = (newMax - newMin)  

	let newValue = (((oldValue - oldMin) * newRange) / oldRange) + newMin

	return newValue
}

// here's our reduce function that simply sums up all of the values in the array
const sumVals = (numArr) => {
	return numArr.reduce(function(a, b) {
  	return a + b;
	}, 0);
}

// and here's where we pull it all together!
const normRand = () => {
	let numArr = genNumArr()

	let oldMax = Math.max(...numArr)
	let oldMin = Math.min(...numArr)

	let numArrInRange = numArr.map((num) => convertVal(num, oldMax, oldMin))
	
	return sumVals(numArrInRange)
}

console.log('Behold, our pseudo-random number', normRand())