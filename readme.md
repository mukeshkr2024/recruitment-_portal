### C Programming

1. **Which of the following is the correct syntax for declaring a pointer to an integer in C?**
   - a) `int *ptr;`
   - b) `int ptr*;`
   - c) `pointer int ptr;`
   - d) `int ptr;`
   - **Answer: a) `int *ptr;`**

2. **What is the output of the following code?**
   ```c
   int main() {
       int x = 5;
       printf("%d\n", ++x * x++);
       return 0;
   }
   ```
   - a) `30`
   - b) `36`
   - c) `35`
   - d) `25`
   - **Answer: a) `30`**

3. **In C, what will the following code print?**
   ```c
   #include <stdio.h>
   int main() {
       int x = 5;
       printf("%d\n", x++ + ++x);
       return 0;
   }
   ```
   - a) `11`
   - b) `10`
   - c) `12`
   - d) `13`
   - **Answer: a) `11`**

4. **What is the purpose of the `static` keyword in C?**
   - a) It makes a variable local to a function.
   - b) It makes a variable retain its value between function calls.
   - c) It makes a variable global across all files.
   - d) It makes a variable constant.
   - **Answer: b) It makes a variable retain its value between function calls.**

5. **Which header file is required for `malloc()` function in C?**
   - a) `stdlib.h`
   - b) `malloc.h`
   - c) `memory.h`
   - d) `stdio.h`
   - **Answer: a) `stdlib.h`**

### C++ Programming

6. **Which of the following is a valid constructor in C++?**
   - a) `ClassName() {}`
   - b) `ClassName() : {}`
   - c) `void ClassName() {}`
   - d) `ClassName() { : }`
   - **Answer: a) `ClassName() {}`**

7. **What will be the output of the following C++ code?**
   ```cpp
   #include <iostream>
   class A {
   public:
       A() { std::cout << "A"; }
       ~A() { std::cout << "B"; }
   };
   class B : public A {
   public:
       B() { std::cout << "C"; }
       ~B() { std::cout << "D"; }
   };
   int main() {
       B obj;
       return 0;
   }
   ```
   - a) `ACDB`
   - b) `ACBD`
   - c) `CADB`
   - d) `CBAD`
   - **Answer: a) `ACDB`**

8. **In C++, what is the access level of members of a class by default?**
   - a) `public`
   - b) `private`
   - c) `protected`
   - d) `None`
   - **Answer: b) `private`**

9. **What will the following code output?**
   ```cpp
   #include <iostream>
   int main() {
       int a = 5;
       int &b = a;
       b++;
       std::cout << a << " " << b;
       return 0;
   }
   ```
   - a) `6 6`
   - b) `5 6`
   - c) `6 5`
   - d) `5 5`
   - **Answer: a) `6 6`**

10. **Which of the following C++ keywords is used to prevent inheritance?**
    - a) `final`
    - b) `sealed`
    - c) `static`
    - d) `private`
    - **Answer: a) `final`**

### Java Programming

11. **Which method is used to start a thread in Java?**
    - a) `run()`
    - b) `start()`
    - c) `execute()`
    - d) `init()`
    - **Answer: b) `start()`**

12. **What will be the output of the following code?**
    ```java
    class Test {
        public static void main(String[] args) {
            String str1 = "Hello";
            String str2 = new String("Hello");
            System.out.println(str1 == str2);
        }
    }
    ```
    - a) `true`
    - b) `false`
    - c) `Hello`
    - d) `NullPointerException`
    - **Answer: b) `false`**

13. **In Java, which of the following is used to handle exceptions?**
    - a) `catch`
    - b) `try`
    - c) `throw`
    - d) `All of the above`
    - **Answer: d) `All of the above`**

14. **Which of the following methods can be used to convert a string to an integer in Java?**
    - a) `Integer.parseInt()`
    - b) `String.toInteger()`
    - c) `Integer.convert()`
    - d) `String.parse()`
    - **Answer: a) `Integer.parseInt()`**

15. **What is the default value of a boolean variable in Java?**
    - a) `0`
    - b) `false`
    - c) `null`
    - d) `true`
    - **Answer: b) `false`**

### Algorithms

16. **What is the time complexity of binary search?**
    - a) O(n)
    - b) O(log n)
    - c) O(n log n)
    - d) O(1)
    - **Answer: b) O(log n)**

17. **Which of the following algorithms is used for sorting?**
    - a) Binary Search
    - b) Dijkstra's Algorithm
    - c) Merge Sort
    - d) BFS
    - **Answer: c) Merge Sort**

18. **What is the space complexity of quicksort in the worst case?**
    - a) O(1)
    - b) O(n)
    - c) O(log n)
    - d) O(n^2)
    - **Answer: d) O(n^2)**

19. **Which data structure is used in depth-first search (DFS)?**
    - a) Queue
    - b) Stack
    - c) Hash Table
    - d) Array
    - **Answer: b) Stack**

20. **In which algorithm is the concept of 'divide and conquer' used?**
    - a) BFS
    - b) Kruskal's Algorithm
    - c) Merge Sort
    - d) Linear Search
    - **Answer: c) Merge Sort**

### Coding Questions

21. **Write a C++ program to reverse a string.**
    ```cpp
    #include <iostream>
    #include <string>
    void reverseString(std::string &str) {
        int n = str.length();
        for (int i = 0; i < n / 2; i++) {
            std::swap(str[i], str[n - i - 1]);
        }
    }
    int main() {
        std::string s = "hello";
        reverseString(s);
        std::cout << s;
        return 0;
    }
    ```
    - a) `olleh`
    - b) `hello`
    - c) `heoll`
    - d) `oellh`
    - **Answer: a) `olleh`**

22. **What is the output of the following Java code?**
    ```java
    class Example {
        public static void main(String[] args) {
            int a = 10;
            int b = 5;
            System.out.println(a % b);
        }
    }
    ```
    - a) `2`
    - b) `5`
    - c) `0`
    - d) `10`
    - **Answer: c) `0`**

23. **Given a Java array `int[] arr = {1, 2, 3, 4, 5};`, write code to find the sum of all elements.**
    ```java
    int sum = 0;
    for (int i : arr) {
        sum += i;
    }
    System.out.println(sum);
    ```
    - a) `15`
    - b) `14`
    - c) `10`
    - d) `20`
    - **Answer: a) `15`**

24. **Write a C function to check if a number is prime.**
    ```c
    int isPrime(int num) {
        if (num <= 1) return 0;
        for (int i = 2; i <= num / 2; i++) {
            if (num % i == 0) return 0;
        }
        return 1;
    }
    ```
    - a) Returns 1 if the number is prime, 0 otherwise.
    - b) Returns 

0 if the number is prime, 1 otherwise.
    - c) Returns 1 for all numbers.
    - d) Returns 0 for all numbers.
    - **Answer: a) Returns 1 if the number is prime, 0 otherwise.**

25. **Write a function in Java to find the maximum element in an array.**
    ```java
    public static int findMax(int[] arr) {
        int max = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                max = arr[i];
            }
        }
        return max;
    }
    ```
    - a) Finds the maximum element in the array.
    - b) Finds the minimum element in the array.
    - c) Calculates the sum of the array.
    - d) Calculates the average of the array.
    - **Answer: a) Finds the maximum element in the array.**

### Additional Questions

26. **In C++, which of the following is a valid way to declare a constant?**
    - a) `const int x = 10;`
    - b) `int const x = 10;`
    - c) `const int x;`
    - d) Both a and b
    - **Answer: d) Both a and b**

27. **Which method is used to make a class immutable in Java?**
    - a) Define all fields as `final`.
    - b) Use only getters without setters.
    - c) Both a and b
    - d) Use `private` access modifier for fields.
    - **Answer: c) Both a and b**

28. **What is the output of the following C++ code?**
    ```cpp
    #include <iostream>
    int main() {
        int x = 5;
        int *ptr = &x;
        *ptr = 10;
        std::cout << x;
        return 0;
    }
    ```
    - a) `10`
    - b) `5`
    - c) `15`
    - d) `0`
    - **Answer: a) `10`**

29. **What will be the output of the following Java code?**
    ```java
    class Test {
        public static void main(String[] args) {
            String str = "abc";
            str.toUpperCase();
            System.out.println(str);
        }
    }
    ```
    - a) `ABC`
    - b) `abc`
    - c) `null`
    - d) `Exception`
    - **Answer: b) `abc`**

30. **Which of the following is used to avoid collisions in hashing?**
    - a) Chaining
    - b) Linear Probing
    - c) Quadratic Probing
    - d) All of the above
    - **Answer: d) All of the above**

31. **What is the worst-case time complexity of insertion sort?**
    - a) O(n)
    - b) O(n^2)
    - c) O(n log n)
    - d) O(log n)
    - **Answer: b) O(n^2)**

32. **Which algorithm is known as a 'greedy' algorithm?**
    - a) Quick Sort
    - b) Dijkstra's Algorithm
    - c) Merge Sort
    - d) Binary Search
    - **Answer: b) Dijkstra's Algorithm**

33. **What is the space complexity of the merge sort algorithm?**
    - a) O(1)
    - b) O(n)
    - c) O(n log n)
    - d) O(log n)
    - **Answer: b) O(n)**

34. **Which data structure is used in the breadth-first search (BFS) algorithm?**
    - a) Stack
    - b) Queue
    - c) Tree
    - d) Graph
    - **Answer: b) Queue**

35. **What is the result of the following Python code?**
    ```python
    def f(x):
        return x ** 2

    print(f(3))
    ```
    - a) `6`
    - b) `9`
    - c) `3`
    - d) `None`
    - **Answer: b) `9`**

36. **In which scenario is a hash table more efficient compared to a binary search tree?**
    - a) When the data is sorted
    - b) When the data is unsorted
    - c) When there are frequent insertions and deletions
    - d) When there are infrequent queries
    - **Answer: c) When there are frequent insertions and deletions**

37. **What is the time complexity of accessing an element in an array?**
    - a) O(n)
    - b) O(log n)
    - c) O(1)
    - d) O(n log n)
    - **Answer: c) O(1)**

38. **Which of the following sorting algorithms is stable?**
    - a) Quick Sort
    - b) Heap Sort
    - c) Merge Sort
    - d) Selection Sort
    - **Answer: c) Merge Sort**

39. **In a balanced binary search tree, what is the time complexity for search, insert, and delete operations?**
    - a) O(1)
    - b) O(n)
    - c) O(log n)
    - d) O(n log n)
    - **Answer: c) O(log n)**

40. **Which of the following problems can be solved using dynamic programming?**
    - a) Finding the shortest path in a graph
    - b) Sorting a list
    - c) Counting the number of inversions in an array
    - d) All of the above
    - **Answer: d) All of the above**

Feel free to adjust the difficulty level or specific focus areas based on your needs!