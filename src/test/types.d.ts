import '@testing-library/jest-dom'
import { expect, vi } from 'vitest'

declare global {
  namespace Vi {
    interface JestAssertion<T = any> extends jest.Matchers<void, T> {}
  }
}

declare module 'vitest' {
  interface JestMatchers<R> {
    toBeInTheDocument(): R
    toHaveBeenCalled(): R
    toHaveBeenCalledWith(...args: any[]): R
  }
} 