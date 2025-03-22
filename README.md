creating calculator 

dynamic font sizing added depending on display number length 

overflow function added, which uses scientific notation if too large / too small, and determines how to round / display decimals
-the browser can only be precise with 16-17 sig figs so some precision is lost but this shouldn't affect the logic 

percentage button & sign button don't interfere with logic 

user cannot input multiple decimals in a number, or exceed 20 digits in a number 

the actual computation logic seems sound so far:
-running totals work with operators and equals 
-equals self works 
-if user inputs number after equals without pressing an operator, it should start a new expression
-if user inputs multiple operators in a row, it uses the last one 
-if user presses operators and equals in some combination after each other, then presses a number, if the operator was pressed last, 
 the next equals / operator pressed will update the result of the operation. If the equals was pressed last, then a number is pressed, it starts
 a new operation. 

might add keyboard functionality or backspace button next 