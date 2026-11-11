#include<stdio.h>
#include<conio.h>
int stack[6];
int top = -1;
int size = 6;

void push()
{
    if(top==size-1){
        printf("Stock overflow");
        return;
    }
    top=top+1;
    int data;
    printf("\n Enter Value:");
    scanf("%d",&data);
    stack[top] = data;

    printf("\nValue Inserted:- %d",stack[top]);

}
void pop()
{
    if(top==-1)
    {
        printf("Stack Underflow");
        return;
    
    }
    printf("\nValue deleted %d",stack[top]);
    top = top-1;
    
}

void peep() {
    if(top==-1)
    {
        printf("Stack is Empty");
        return;
    
    }
    for (int i = 0; i <= top; i++)
    {
        printf("\n%d",stack[i]);
    }
    
}


int main()
{
    push();
    push();
    push();
    pop();
    peep();
    return 1;
}