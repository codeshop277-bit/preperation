function priority(ch) {
    if (ch == '^') {
        return 3;
    } else if (ch == '*' || ch == '/') {
        return 2;
    } else if (ch == '+' || ch == '-') {
        return 1;
    } else {
        return -1;
    }
};

function InfixToPostfix(str){
    let stack = new Stack()
    let i= 0;
    let ans = ''

    while(i< str.length){
        if((exp[i] >= 'a' && exp[i] <= 'z') || (exp[i] >= 'A' && exp[i] <= 'Z') || (exp[i] >= '0' && exp[i] <= '9')){
            ans+=str[i]
        }else if(exp[i] == '('){
            stack.push(str[i])
        }else if(str[i] == ')'){
            while(stack.top() != '('){
                ans += stack.top()
                stack.top()
            }
        }else if(priority(str[i] <= priority(stack.top()))){
            ans += stack.top()
            stack.top()

        }
        i++
    }
    while(!stack.isEmpty()){
        ans+= stack.top()
        stack.top()
    }
}

function InfixToPostfix(str){
    let stack = new Stack()
    let ans = ''
    let i =0

    while(i< str.length){
        if((exp[i] >= 'a' && exp[i] <= 'z') || (exp[i] >= 'A' && exp[i] <= 'Z') || (exp[i] >= '0' && exp[i] <= '9')){
            stack.push(str[i])
        }else{
            let s1 = stack.top()
            stack.pop()
            let s2 = stack.top()
            stack.pop()
            let newC = '(' + s2 + str[i] + s1 + ')';
            stack.push(newC)
        }
        i++
    }
    return stack.top()
}