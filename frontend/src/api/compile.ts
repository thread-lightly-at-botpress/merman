import type { GeneratedCppFile } from '../types'

// STUB — replace with real POST /compile when backend is ready.
// Backend should return `{ files: GeneratedCppFile[] }` (.h / .cpp pairs).
export async function compileUML(source: string): Promise<{ files: GeneratedCppFile[] }> {
  console.log('[stub] compileUML called')
  console.log('[stub] source preview:', source.slice(0, 120))
  await new Promise((r) => setTimeout(r, 1200))

  return {
    files: [
      {
        path: 'Animal.h',
        content: `#pragma once

#include <string>

// Stub output — replace with backend-generated declarations.

class Animal {
public:
    std::string name;
    int age{};
    virtual std::string makeSound() const;
    virtual ~Animal() = default;
};
`,
      },
      {
        path: 'Animal.cpp',
        content: `#include "Animal.h"

std::string Animal::makeSound() const {
    return "…";
}
`,
      },
      {
        path: 'Dog.h',
        content: `#pragma once

#include "Animal.h"
#include <string>

class Dog : public Animal {
public:
    std::string breed;
    void fetch();
};
`,
      },
      {
        path: 'Dog.cpp',
        content: `#include "Dog.h"

void Dog::fetch() {
    // stub
}
`,
      },
    ],
  }
}
