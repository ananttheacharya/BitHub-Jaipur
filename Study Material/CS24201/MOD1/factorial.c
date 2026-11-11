#include<stdio.h>
#include<conio.h>

int factorial(int n) {
    //base case
    if (n == 1 || n == 0) {
        return 1;
    }
    //Operational statement
    return n * factorial(n-1);
}

/*
void main(){
clrscr();
printf("%d",factorial(5));
getch();
}
*/

int main() {
    printf("%d",factorial(5));
    return 0;
}