// 1. Give the user the ability to search for mulitple symbols.
// 2. Multiple will bring back an array inside of quote. A single will bring back one object.


// 1. Make an AJAX request when the user submits the form
// 2. get the users input.
// 3. When the AJAX has a response/JSON, check to see if there was any valid data
// 4. If there is, load up the table with the data

$(document).ready(function(){

	$('#arrow1').click(function(){
		$('#page1,#page2').css({
			'right':'100vw'
		});
	})
	$('#arrow2').click(function(){
		$('#page1,#page2').css({
			'right':'0vw'
		});
	})

	// console.log("DOM loaded. Awaiting orders...")

	var userStockSavedIfAny = localStorage.getItem('lastSymbolSearched');

	if(userStockSavedIfAny){
		var url = encodeURI(`http://query.yahooapis.com/v1/public/yql?q=env 'store://datatables.org/alltableswithkeys';select * from yahoo.finance.quotes where symbol in ("${userStockSavedIfAny}");&format=json`);
		// var url = 'http://query.yahooapis.com/v1/public/yql?q=env%20%27store://datatables.org/alltableswithkeys%27;select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22'+symbol+'%22)%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json'
		$.getJSON(url,(theDataJSFound)=>{
			console.log(theDataJSFound);
			if(theDataJSFound.query.count > 1){
				// we need to loop.
				var stocksArray = theDataJSFound.query.results.quote;
				var newRow = '';
				for(let i = 0; i< stocksArray.length; i++){
					newRow += buildStockRow(stocksArray[i]);	
				}
			}else{
				var newRow = buildStockRow(theDataJSFound.query.results.quote);			
			}			
			// Update the HMLT inside of the table body
			$('#stock-ticker-body').append(newRow);
		});		
	}
	// console.log(userStockSavedIfAny);

	$('.yahoo-finance-form').submit((event)=>{
		// Prevent the browser from submitting the form. JS will handle everything
		event.preventDefault();
		// console.log("The for was just submitted");
		// Get whatever the user typed and stash it in a var
		var symbol = $('#symbol').val();
		// Store in localStorage (new version cookies), that will last
		// even after the browser closers or changes pages
		localStorage.setItem("lastSymbolSearched", symbol);	

		// var url = encodeURI(`http://query.yahooapis.com/v1/public/yql?q=env%20%27store://datatables.org/alltableswithkeys%27;select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22${symbol}%22)%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json`);
		var url = encodeURI(`http://query.yahooapis.com/v1/public/yql?q=env 'store://datatables.org/alltableswithkeys';select * from yahoo.finance.quotes where symbol in ("${symbol}");&format=json`);		console.log(url);
		// var url = 'http://query.yahooapis.com/v1/public/yql?q=env%20%27store://datatables.org/alltableswithkeys%27;select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22'+symbol+'%22)%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json'
		console.log(url);
		$.getJSON(url,(theDataJSFound)=>{
			// console.log(theDataJSFound);
			if(theDataJSFound.query.count > 1){
				// we need to loop.
				var stocksArray = theDataJSFound.query.results.quote;
				var newRow = '';
				for(let i = 0; i< stocksArray.length; i++){
					newRow += buildStockRow(stocksArray[i]);	
				}
			}else{
				var newRow = buildStockRow(theDataJSFound.query.results.quote);			
			}			
			// Update the HMLT inside of the table body
			$('#stock-ticker-body').append(newRow);
		});
	})
	console.log("I'm the last line... but I'm not last, because JS is async!")

	function buildStockRow(stockInfo){
		// Build the table's new HTML
		var newHTML = '';

		if(stockInfo.Ask == null){
			stockInfo.Ask = "Not Available for this stock";
		}
		if(stockInfo.Change.indexOf('+') > -1){
			var classChange = "success";
		}else{
			var classChange = "danger";
		}

		newHTML += '<tr>';
			newHTML += '<td>'+stockInfo.Symbol+'</td>';
			newHTML += '<td>'+stockInfo.Name+'</td>';
			newHTML += '<td>'+stockInfo.Ask+'</td>';
			newHTML += '<td>'+stockInfo.Bid+'</td>';
			newHTML += '<td class="bg-'+classChange+'">'+stockInfo.Change+'</td>';
		newHTML += '</tr>';
		// console.log(newHTML);		
		return newHTML;
	}

});