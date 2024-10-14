import { CodeSnippetsProps } from "@/components/coding-exam/editor";

export const API_URL = import.meta.env.VITE_API_URL;
export const SITE_URL = import.meta.env.VITE_SITE_URL;

export const languageOptions = [
  {
    language: "javascript",
    version: "18.15.0",
    aliases: ["node-javascript", "node-js", "javascript", "js"],
    runtime: "node",
  },
  {
    language: "python",
    version: "3.10.0",
    aliases: ["py", "py3", "python3", "python3.10"],
  },
  {
    language: "c++",
    version: "10.2.0",
    aliases: ["cpp", "g++"],
    runtime: "gcc",
  },
  {
    language: "java",
    version: "15.0.2",
    aliases: [],
  },
  // Commenting out other languages
  /*
  {
      language: "typescript",
      version: "5.0.3",
      aliases: ["ts", "node-ts", "tsc", "typescript5", "ts5"],
  },
  {
      language: "php",
      version: "8.2.3",
      aliases: [],
  },
  {
      language: "ruby",
      version: "3.0.1",
      aliases: ["ruby3", "rb"],
  },
  {
      language: "rust",
      version: "1.68.2",
      aliases: ["rs"],
  },
  {
      language: "csharp",
      version: "6.12.0",
      aliases: ["mono", "mono-csharp", "mono-c#", "mono-cs", "c#", "cs"],
      runtime: "mono",
  },
  {
      language: "go",
      version: "1.16.2",
      aliases: ["go", "golang"],
  },
  */
  {
    language: "c",
    version: "10.2.0",
    aliases: ["gcc"],
    runtime: "gcc",
  },
];

export const codeSnippets: CodeSnippetsProps = {
  javascript: `function main() {
}

main();`,

  python: `def main():
    pass

main()`,

  "c++": `#include <iostream>
using namespace std;

void main() {
}

int main() {
    main();
    return 0;
}`,

  java: `public class Main {
   
    public static void main(String[] args) {
        main();
    }
}`,

  c: `#include <stdio.h>

void main() {
}

int main() {
    main();
    return 0;
}`,

  /*
  typescript: `function main(): void {
}

main();`, 

  php: `function main() {
}

main();`, 

  ruby: `def main
end

main()`, 

  go: `package main

import "fmt"

func main() {
}

func main() {
    main()
}`, 

  csharp: `using System;

public class Program
{
    public static void Main()
    {
    }

    public static void Main(string[] args)
    {
        Main();
    }
}`, 
  */
};


