#include<stdio.h>
#include<conio.h>
#include<stdlib.h>
struct node
{
    int info;
    struct node *left;
    struct node *right;
};

struct node *root = NULL;

struct node *createNode(int data_value) {
    struct node *newNode = (struct node *) malloc(sizeof(struct node));
    if(newNode == NULL) {
        printf("\n Memory Space Not available");
    }
    newNode->info = data_value;
    newNode->left = NULL;
    newNode->right = NULL;

    return newNode;
}


void insertNode(int data_value, struct node *root_node) {
    if (root == NULL)
    {
        root = createNode(data_value);
        return;
    }
    if (data_value < root_node->info) {
        if (root_node->left == NULL)
        {
            root_node->left = createNode(data_value);;
            return;
        } else {
            insertNode(data_value, root_node->left);
        }        
    } else
    {
        if (root_node->right == NULL)
        {
            root_node->right = createNode(data_value);
            return;
        } else {
            insertNode(data_value, root_node->right);
        }
        
    }   
}

void preOrderTraversal(struct node *root_node) {
    if (root_node == NULL)
    {
        return;
    }
    printf("\n%d", root_node->info);
    preOrderTraversal(root_node->left);
    preOrderTraversal(root_node->right);
}

void inOrderTraversal(struct node *root_node) {
    if (root_node == NULL)
    {
        return;
    }
    inOrderTraversal(root_node->left);
    printf("\n%d", root_node->info);
    inOrderTraversal(root_node->right);
}
void postOrderTraversal(struct node *root_node) {
    if (root_node == NULL)
    {
        return;
    }
    printf("\n%d", root_node->info);
    postOrderTraversal(root_node->left);
    postOrderTraversal(root_node->right);
}



int main() {
    int n;
    printf("\nPlease Enter no. of items you want to insert in tree:");
    scanf("%d",&n);
    for (int i = 0; i < n; i++)
    {
        printf("\nEnter value:");
        int value;
        scanf("%d",&value);
        insertNode(value, root);
    }
    printf("\nPre-Order Traversal\n");
    preOrderTraversal(root);
    printf("\nPre-Order Traversal\n");
    inOrderTraversal(root);
    printf("\nPre-Order Traversal\n");
    postOrderTraversal(root);    
    return 0;
}