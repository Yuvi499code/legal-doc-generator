import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the main app title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Legal Document Generator/i);
  expect(titleElement).toBeInTheDocument();
});