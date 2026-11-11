#include<stdio.h>
#include<conio.h>

int queue[5];
int front = -1;
int rear = -1;
int maxSize = 5;

void insertQueue(int item) {
    // Queue is full?
    if (rear == maxSize-1)
    {
        printf("Queue Overflow");
        return;
    }
    // increase rear by 1
    rear = rear + 1;

    // place item 
    queue[rear] = item;

    // First insertion in queue
    if (front == -1)
    {
        front = front + 1;
    }
    
}

void deletionQueue() {
    // Queue is Empty?
    if (front == -1)
    {
        printf("Queue Underflow");
        return;
    }
    //Print deleted item
    printf("Deleted item is: %d",queue[front]);

    //Find front new value
    if (front == rear)
    {
        front = -1;
        rear = -1;
    } else {
        front = front + 1;
    }
}




int main()
{
    return 0;
}