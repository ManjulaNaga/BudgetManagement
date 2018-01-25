//script1.js


//budget controller

var budgetController = (function(){
		//var totprice = {'inc','exp'};
		//totprice['inc'] = 0;
		//totprice['exp'] = 0;
	var Expense = function(id,description,value){
		this.id = id;
		this.description = description;
		this.value = value;
	}
	var Income = function(id,description,value){
		this.id = id;
		this.description = description;
		this.value = value;
	}
	var data = {
		allItems : {
			inc : [],
			exp : []
		},
		totals : {
			inc : 0,
			exp : 0,
		},
		budget : 0,
		percent : -1
		
	};
	return{
		addItem: function(type,desc,val){
			var newItem;
			var len = ['inc','exp'];
			//console.log("type : "+type);
			//console.log("desc : "+desc);
			//console.log("val : "+val);
			len[type] = data.allItems[type].length;
			//console.log("len : " +len[type]);
			//create new id
			if(data.allItems[type].length > 0)
				id = len[type];
			else
				id = 0;
			//create new item based on inc or exp type
			if(type === 'exp')
			{
				newItem = new Expense(id,desc,val);
			}else if(type == 'inc'){
				newItem = new Income(id,desc,val);
			}
			//push data into data structure.
			data.allItems[type].push(newItem);
			//return the new item
			return newItem;
		},
		
		addPrice : function(type,desc,val){	
			//push total price in to data structure
			//console.log("in addPrice()....");
			//console.log("type : "+type);
			//console.log("desc : "+desc);
			//console.log("val : "+val);
			data.totals[type]  = parseFloat(data.totals[type]) + parseFloat(val);
			console.log("data.totals["+type+"] : "+data.totals[type]);
			console.log("value added");
			return (data.totals[type]).toFixed(2);
		},
		getTotalBudget : function()	{
			console.log("getTotalBudget");
			var inc_val = 0,exp_val = 0;
			inc_val = parseFloat(data.totals['inc']);
			exp_val = parseFloat(data.totals['exp']);
			console.log("inc_val :"+inc_val);	
			console.log("exp_val :"+exp_val);
			if(inc_val > exp_val){
				data.budget = (inc_val - exp_val).toFixed(2);
				return ('+' +data.budget);
			}
			else if(inc_val < exp_val){
				data.budget = exp_val - inc_val;
				return ('-' +data.budget);
			}
		},
		getTotalPercent : function(){
			console.log("in getTotalPercent");
			var i = 0,e = 0;
			i = parseFloat(data.totals['inc']);
			e = parseFloat(data.totals['exp']);
			console.log("inc_val :"+i);	
			console.log("exp_val :"+e);
			if(i>0 && (i -  e) >0){
				data.percent = Math.round((e/i) *100);
				console.log("data.percent" +data.percent);
				return (data.percent + '%');
			}
			
			 
		},
		calExpPercent: function(val){
			//get total income ---data.totals['budget']
			var inc_val = 0,exp_val = 0,exp_per =[];
			inc_val = parseFloat(data.totals['inc']);
			exp_val = parseFloat(data.totals['exp']);
			/*data.allItems['exp'].forEach(function(element){
				exp_per.push((data.allItems['exp'][element] / inc_val)* 100);
				console.log(exp_per[element]);
			});
			
			*/
			if(inc_val > exp_val){
				exp_per = ((val/inc_val) * 100).toFixed(2);
			}
			else if(inc_val < exp_val){
				exp_per = 0;
			}			
			//get expenditure percent--- exp/total *100
			//display exp percent on UI 
			return exp_per;         
		},
		testing : function(){
			console.log(data);
		}
	};
})();

//ui controller

var UIController = (function(){
	var DOMStrings = {
		inputType : '.budget_type',
		inputDesc : '.desc',
		inputVal : '.val',
		inputBtn : '.tickmark',
		incomeContainer : '.income_list',
		expensesContainer : '.expenses_list'
	};
	   var formatNumber = function(num, type) {
        var numSplit, int, dec, type;
        /*
            + or - before number
            exactly 2 decimal points
            comma separating the thousands

            2310.4567 -> + 2,310.46
            2000 -> + 2,000.00
            */

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };
		return 	{
		getInput :function(){	
			//var org_price = parseFloat(document.querySelector(DOMStrings.inputVal).value);
			//var org_type = document.querySelector(DOMStrings.inputType).value;
			return {
				type : document.querySelector(DOMStrings.inputType).value,
				desc : document.querySelector(DOMStrings.inputDesc).value,
				price : parseFloat(document.querySelector(DOMStrings.inputVal).value)
				//price : formatNumber(org_price,org_type)
				
			};
		},
		clearFields : function(){
			var fields,fieldsArr;
			fields = document.querySelectorAll(DOMStrings.inputDesc +', '+DOMStrings.inputVal);
			fieldsArr = Array.prototype.slice.call(fields);
			fieldsArr.forEach(function(current,index,array){
				current.value ="";
			});
			fieldsArr[0].focus();
		},
		getDOMStrings: function(){
			return DOMStrings;
		},
		addListItem : function(obj,type){
			//1. create html text with placeholder text
			var html,newHtml,element;
			if(type === 'inc')
			{
				element	= DOMStrings.incomeContainer;
				html ='<table><tr><td><div class = "item_desc" id = "income_%id%">%description%</div></td><td><div class = "item_val">%value%</div></td><td><div class = "item_delete"><button><i class = "hiddenButton" onclick ="deleteItem()" >delete</i></button></div></td></tr></table>';
			}
			else if(type === 'exp')
			{
				element = DOMStrings.expensesContainer;
				html = '<table><tr><td><div class = "item_desc" id ="expense_%id%">%description%</div></td><td><div class = "item_val">%value%</div></td><td><div class = "exp_percent">(25%)</div></td><td><div class = "item_delete"><button><i class = "hiddenButton" onclick ="deleteItem"()>delete</i></button></div></td></tr></table>';
			}

			//2. replace placeholder with actual data
			newHtml = html.replace("%id%",obj.id);
			newHtml = newHtml.replace("%description%",obj.description);
			newHtml = newHtml.replace("%value%",formatNumber(obj.value,type));
			//newHtml = newHtml.replace("%value%",obj.value);
			//3. insert the html into DOM
			//console.log(element);
			var el = document.querySelector(element);
			//console.log(el);
			//console.log(newHtml);
			if (el) {
				el.insertAdjacentHTML('beforeend', newHtml);
			}
		},
		deleteItem : function(){
			//delete entire row with class ="clear_fix"
			var parent  = querySelector('.clear_fix').value;
			var child = querySelector('.income_list').value;
			parent.removeChild(child);
		}
	};
})(); 

//global controller
var controller = (function(budgetCtrl,UICtrl){
		var setMonth =function(){
			var d,month,month_name ="January";
			d = new Date();
			month = d.getMonth();
			//console.log(month);
			switch(month)
			{
				case 0 :month_name = 'January';
						break;
				case 1 :month_name = 'Febraury';
						break;
				case 2 :month_name = 'March';
						break;
				case 3 :month_name = 'April';
						break;
				case 4 :month_name = 'May';
						break;
				case 5 :month_name = 'June';
						break;
				case 6 :month_name = 'July';
						break;
				case 7 :month_name = 'August';
						break;
				case 8 :month_name = 'September';
						break;
				case 9 :month_name = 'October';
						break;
				case 10 :month_name = 'November';
						break;
				case 11 :month_name = 'December';
						break;
			}
			//console.log(month_name);
			//document.querySelector('.curr_month').innerHTML = "month_name";
			//console.log(document.querySelector('.curr_month').innerHTML);
	}
	var setupEventListeners = function(){
		var newTotal = 0;
		console.log("in setupEventListener");
		var DOM = UICtrl.getDOMStrings();
		
		document.addEventListener('keypress',function(event){
		if(event.keyCode === 13 || event.which === 13){
			addItem();
			addPrice();
		}
		});
	}
	var addItem = function(){
		//1.get input data;
		var input,newItem;
		input = UICtrl.getInput();
		if(input.desc != "" && !isNaN(input.price) && input.price > 0)
		{
		//2. add input to budgetController
		newItem = budgetCtrl.addItem(input.type,input.desc,input.price);
		//3. add item to UI
		UICtrl.addListItem(newItem,input.type);
		//4.  add exp percentage of total income
		if(input.type === 'exp')
		{
			document.querySelector('.tot_percent').innerHTML = budgetCtrl.getTotalPercent();
			document.querySelector('.exp_percent').innerHTML = budgetCtrl.calExpPercent(input.price);
		}
		//5. calculate the budget
		//6. display the budet on UI

		}
		
	}
	var addPrice= function(){
		var i,format_val;
		i = UICtrl.getInput();
		if(i.desc != "" && !isNaN(i.price) && i.price > 0){

		//format_val = UICtrl.formatNumber(i.price,i.type);
		//2. add price to budgetController
		newTotal = budgetCtrl.addPrice(i.type,i.desc,i.price);
		//3. add total to UI
		if(i.type === 'inc'){
			document.querySelector('#curr_income').innerHTML = '+'+newTotal;
		}
		else if(i.type === 'exp'){
			document.querySelector('#curr_expense').innerHTML = '-'+newTotal;
		}
	
		
		//4.clear input fields an focus at inputs
			UICtrl.clearFields();
			//6. display the budet on UI
			var budget = budgetCtrl.getTotalBudget();
			document.querySelector('.total_budget').innerHTML = budget;
	}
	}
	
 	return{ 
		init:function(){
			console.log("Application has started");
			setMonth();
			setupEventListeners();
		}
	}
		
})(budgetController,UIController);

controller.init();