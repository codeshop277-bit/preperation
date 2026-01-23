function myatoi(s) {
    let i = 0; let sign = -1;
    while (i <= s.length && s[i] == " ") {
        i++
    }
    if (s[i] == '-') {
        sign = -1
    } else {
        sign = 1
    }
    i++;

    return recursiveatoi(i, s, num = 0, sign)
};

function recursiveatoi(i, s, num, sign) {
    if (i >= s.length && isNaN(Number(s[i]))) return num * sign
    num = num * 10 + Number(s[i])

    if (num > 2147483647) return 2147483647
    if (num < -2147483647) return -2147483647

    return recursiveatoi(i + 1, s, num, sign)
}

function Pow(x, n) {
    if (x == 1) return x;
    if (n == 0) return 1

    let temp = n;
    if (n < 0) {
        x = 1 / x
        temp = -n;
    }
    let ans = 1;
    for (let i = 0; i < temp; i++) {
        ans *= x
    }
    return ans
}
function insert(stack, temp) {
    if (stack.length == 0 || stack[stack.length - 1] <= temp) {
        stack.push(temp)
    }
    let val = stack.pop();
    insert(stack, val)
    stack.push(val)
}
function SortStack(stack) {
    if (stack.length > 0) {
        let temp = stack.pop();
        SortStack(stack);
        insert(stack, temp)
    }
}
function reverseInsert(stack, temp) {
    if (stack.length == 0) {
        stack.push(temp)
        return;
    }
    let val = stack.pop();
    reverseInsert(stack, val)
    stack.push(val)
}
function ReverseSTack(stack) {
    if (stack.length > 0) {
        let temp = stack.pop();
        ReverseSTack(stack);
        insert(stack, temp)
    }
}

function generateBinaryStrings(n, curr, result) {
    if (curr.length == n) {
        result.push(curr)
        return
    }
    generateBinaryStrings(n, curr + "0", result)
    if (curr.length == 0 || curr[curr.length - 1] != 1) {
        generateBinaryStrings(n, curr + "1", result)
    }
    return result
}
// console.log(generateBinaryStrings(5, "", []))

function generateParanthesis(curr, back, open, n, res) {
    if (curr.length == 2 * n) {
        res.push(curr)
        return
    }
    if (open < n) generateParanthesis(curr + "(", back, open + 1, n, res)
    if (back < open) generateParanthesis(curr + ")", back + 1, open, n, res)

    return res
}
// console.log(generateParanthesis("", 0, 0, 3, []))
function PowrSet(current, index, result, s) {
    if (index == s.length) {
        result.push(current.join(""))
        return
    }
    PowrSet(current, index + 1, result, s)
    current.push(s[index])
    PowrSet(current, index, result, s)
    current.pop()
}
// console.log(PowrSet([], 0, [], "abc"))

function CountSubSeq(index, arr, sum) {
    if (sum == 0) return 1;
    if (sum < 0 || index == arr.length) return 0;

    return CountSubSeq(index + 1, arr, sum - arr[index]) + CountSubSeq(index + 1, arr, sum)
}

function CheckSubSequence(i, arr, k) {
    if (k === 0) return true;
    if (k < 0) return false;
    if (i === arr.length) return k === 0;

    return CheckSubSequence(i + 1, arr, k - arr[i]) || CheckSubSequence(i + 1, arr, k)
}
function RecurseCombSum(index, arr, k, current, ans) {
    if (index == arr.length) {
        if (k === 0) {
            ans.push([...current])
        }
        return
    }
    if (arr[index] <= k) {
        current.push(arr[index])
        RecurseCombSum(index + 1, arr, k - arr[index], current, sum)
        current.pop()
    }
    RecurseCombSum(index + 1, arr, k, current, sum)
}
function CombinationSum(arr, k) {
    let ans = []
    let current = []
    return RecurseCombSum(0, arr, k, current, ans)
}
function RecurseCombTwoSum(index, arr, k, current, ans) {
    if (k === 0) {
        ans.push([...current])
        return
    }
    for (let i = index; i < arr.length; i++) {
        if (i > index && arr[i] === arr[i - 1]) continue
        if (arr[i] > k) break;
        current.push(arr[i])
        RecurseCombSum(i + 1, arr, k - arr[i], current, sum)
        current.pop()
    }
}
function CombinationTwoSum(arr, k) {
    arr.sort()
    let ans = []
    let current = []
    return RecurseCombTwoSum(0, arr, k, current, ans)
}

function RecurseCombThreeSum(sum, last, k, current, ans) {
    if (sum === 0 && current.lenght === k) {
        ans.push([...current])
        return
    }
    if (sum < 0 && current.lenght === k) return
    for (i = last; i <= 9; i++) {
        if (i <= sum) {
            current.push(i)
            RecurseCombThreeSum(sum - i, i + 1, k, current, ans)
            current.pop()
        } else {
            break
        }
    }
}
function Combination3Sum(arr, k) {
    let ans = []
    let current = []
    let sum = 7;
    return RecurseCombThreeSum(sum, 1, k, current, ans)
}

function RecursiveSubSet(index, current, arr, sum) {
    if (index === arr.length) {
        sum.push(current)
        return
    }
    RecursiveSubSet(index + 1, current + arr[index], arr, sum)
    RecursiveSubSet(index + 1, current, arr, sum)
}
function SubsetSum(arr) {
    let sum = []
    RecursiveSubSet(0, 0, arr, sum)
    sum.sort((a, b) => a - b)
    return sum
}
function RecursiveSubSetTwo(index, arr, current, sum) {
    sum.push([...current])
    for (let i = index; i < arr.length; i++) {
        if (i > index && arr[i] === arr[i - 1]) continue;
        current.push(arr[i])
        RecursiveSubSetTwo(i + 1, arr, current, cum)
        current.pop();
    }
}
function SubsetTwoSum(arr) {
    arr.sort((a, b) => a - b)
    let sum = []
    RecursiveSubSet(0, arr, [], sum)
    return sum
}
const map = ["", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"];
function RecursiveLetterToDigits(index, digits, current, sum){
    if(index === digits.length){
        sum.push(current)
        return
    }
    let string = map[digits[index] - "0"];
    for(let i=0; i< string.length; i++){
        RecursiveLetterToDigits(index+1, digits, current+string[i], sum)
    }

}
function LetterToDigits(digits){
    RecursiveLetterToDigits(0, digits, "" , [])
}

function isPalindrome(s, left, right){
    while(left<right){
        if(s[left] != s[right]) return false
        left++
        right--
    }
    return true
}
function RecursiveReturnPalindrome(index, s, ans, path){
    if(index === s.length){
        ans.push([...path])
        return
    }; 
    for(let i=index; i<s.length; i++){
        if(isPalindrome(s, index, i)){
            RecursiveReturnPalindrome(index+1, s, ans, path)
            path.pop()
        }
    }
}
function ReturnPalindrome(s){
    let ans = []
    RecursiveReturnPalindrome(0, s, ans, [])
}

function wordSearch(grid, word){
    const rows = grid.length;
    const cols = grid[0].length;

    const findWord = (i, j, idx) => {
        if(idx == word.length) return true;
        if(i< 0 || j <0 || i>= rows || j>=cols || grid[i][j] != word[idx] ) return false;
        let temp = grid[i][j]
        grid[i][j] = '#'
        const found = findWord(i+1, j, idx+1) || findWord(i-1,j, idx+1 ) || findWord(i, j+1, idx+1) || findWord(i, j-1, idx+1);
        grid[i][j] = temp;
        return found
    }

    for(let i=0; i<rows; i++){
        for(let j=0; j<cols; j++){
            if(findWord(i, j, 0)) return true;
        }
    }
    return false
}
function isSafe(x,y,n, maze, visited){
    return (x>0 && x<n && y>0 && y<n && visited[x][y] == 0 && maze[x][y] == 1)
}
function solve(x,y,n,maze, visited, res, path){
    if(x == n-1 && y == n-1){
        res.pus(path)
        return
    }
    visited[x][y] = 1
    if(isSafe(x+1,y,n, maze, visited)){
        solve(x+1, y, n, maze, visited, res, path+"D")
    }
     if(isSafe(x,y-1,n, maze, visited)){
        solve(x, y-1, n, maze, visited, res, path+"L")
    }
     if(isSafe(x,y+1,n, maze, visited)){
        solve(x, y_1, n, maze, visited, res, path+"R")
    }
     if(isSafe(x-1,y,n, maze, visited)){
        solve(x-1, y, n, maze, visited, res, path+"U")
    }
    visited[x][y] = 0
}
function RatInMaze(maze, n){
    const res = [];
    const visited = Array.from({length: n}, () => Array.fill(0) )
    solve(0,0, n, maze, visited, res, "")

}

function wordSearch(string, wordDict){
    const dict = new Set(wordDict);
    const n = string.length
    let dp = Array(n+1).fill(false)
    dp[0] = true
    let maxLen = 0;

    for(let word of wordDict){
        maxLen = Math.max(maxLen, word.length)
    }

    for(let i=1; i<n; i++){
        for(let j= Math.max(0, i-maxLen); j<i; j++){
            if(dp[j] && dict.has(string.slice(j,i))){
                dp[i] = true
                break
            }
        }
    }
    return dp[n]
}
function isSafeColor(node, color, graph, N, i){
    for(let k=0; k<N; k++){
        if(k!== node && graph[k][node] ==1 && color[k] == i){
            return false
        }
    }
    return true
}
function solveGraph(node, graph,  m, N, color){
    if(node === N) return true;

    for(let i=0; i<m; i++){
        if(isSafeColor(node, color, graph, N, i)){
            color[node] = i;
            if(solveGraph(node+1, graph, m, N, color)) return true
            color[node] = 0
        }
    }
}
function colorGraph(graph, m, N){
    const color = Array(N).fill(0)
    if (solveGraph(0, graph, m, N, color)) return true
    return false
}
function  RecurseStringOperation(nums, target, result, start, current_val, last_operand, expression){
    if(start == nums.length ){
        if(current_val == target){
        result.push(expression)
        }
        return
    }

    for(let i=start; i<nums.length; i++){
        if( i> start  && nums[start] == '0') return
        let current_num = parseInt(nums.slice(start, i+1));
        if(start === 0){
             RecurseStringOperation(nums, target, result, i+1, current_val, last_operand, expression)
        }else{
             RecurseStringOperation(nums, target, result, i+1, current_val+current_num, current_num, expression+ "+" + current_num)
             RecurseStringOperation(nums, target, result, i+1, current_val-current_num, -current_num, expression+ "-" + current_num)
             RecurseStringOperation(nums, target, result, i+1, current_value - last_operand + last_operand * current_num_val, last_operand * current_num_val, expression + "*" + current_num)

        }

    }
}

function stringOperations(nums, target){
    const result = []
    RecurseStringOperation(nums, target, result, start, current_val, last_operand, expression)
}