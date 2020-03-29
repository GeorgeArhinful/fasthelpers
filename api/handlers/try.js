/**
 * @param {character[][]} grid
 * @return {number}
 */
function numOffices(grid) {
    let result = 0;
    //Put your code here.
    let counter = 0;
    let pointer = 0
    while(counter < grid.length){
    	if(counter === 0){
			if(grid[counter][pointer] && grid[counter][pointer+1] && grid[counter + 1][pointer] && grid[counter + 1][pointer]){
				result = result + 1
				pointer = pointer + 2
			}else if(grid[counter][pointer] && grid[counter][pointer+1] && grid[counter+1][pointer] || grid[counter+1][pointer+1] ){
				result = result +1
				pointer + 2
			}else if(grid[counter][pointer] && grid[counter][pointer+1] && !grid[counter+1][pointer] && !grid[counter+1][pointer+1] ){
				result = result +1
				pointer + 2
			}else if(grid[counter][pointer] && !grid[counter][pointer+1] && grid[counter+1][pointer] ){
				result = result +1
				pointer + 2
			}else if(grid[counter][pointer] && !grid[counter][pointer+1] && !grid[counter+1][pointer] ){
				result = result +1
				pointer + 2
			}else{
				pointer ++
			}
    	}else if(counter === grid.length -1){
    		if(grid[counter][pointer] && grid[counter][pointer+1] && !grid[counter-1][pointer] && !grid[counter-1][pointer+1] ){
        	result = result +1
        	pointer + 2
            }else if(grid[counter][pointer] && !grid[counter][pointer+1] && !grid[counter-1][pointer] && !grid[counter-1][pointer+1] ){
        	result = result +1
        	pointer + 2
            }else{
            	pointer ++
            }
    	}else{
    		if(grid[counter][pointer] && grid[counter][pointer+1] && grid[counter + 1][pointer] && grid[counter + 1][pointer]){
    			if(!grid[counter - 1][pointer] && !grid[counter - 1][pointer]){
					result = result + 1
					pointer = pointer + 2	
    			}
			}else if(grid[counter][pointer] && grid[counter][pointer+1] && grid[counter+1][pointer] || grid[counter+1][pointer+1] ){
			    if(!grid[counter - 1][pointer] && !grid[counter - 1][pointer]){
					result = result + 1
					pointer = pointer + 2	
    			}
			}else if(grid[counter][pointer] && grid[counter][pointer+1] && !grid[counter+1][pointer] && !grid[counter+1][pointer+1] ){
			    if(!grid[counter - 1][pointer] && !grid[counter - 1][pointer]){
					result = result + 1
					pointer = pointer + 2	
    			}
			}else if(grid[counter][pointer] && !grid[counter][pointer+1] && grid[counter+1][pointer] ){
			    if(!grid[counter - 1][pointer]){
					result = result + 1
					pointer = pointer + 2	
    			}
			}else if(grid[counter][pointer] && !grid[counter][pointer+1] && !grid[counter+1][pointer] ){
		        if(!grid[counter - 1][pointer]){
					result = result + 1
					pointer = pointer + 2	
    			}
			}else{
				pointer ++
			}
        }
           if(pointer >= grid.length-1){
        	counter ++
        	pointer = 0
        }
 
     
    }    
    return result;
};

// let height = parseInt(readline());
// let width =  parseInt(readline());
// let grid = [];
// for (var i = 0; i < height; i++) {
// 	grid[i] = (readline() || "").split("");
// }

let grid = [[1, 1, 0, 0, 0],
	 [1, 1, 0, 0, 0],
	 [0, 0, 1, 0, 0],
	 [0, 0, 0, 1, 1]]
console.log(numOffices(grid));

