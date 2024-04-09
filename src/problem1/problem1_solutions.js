var sum_to_n_a = function(n) {
    // your code here
    var sum = n * (n + 1) / 2
    return sum
};


var sum_to_n_b = function(n) {
    // your code here
    var sum = 0;
    for(let i = 1; i <= n; i++){
        sum+=i;
    }
    return sum
};

var sum_to_n_c = function(n) {
    // your code here
    if(n <= 0){
        return 0
    }
    return n + sum_to_n_c(n-1)
};