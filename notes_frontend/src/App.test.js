import { render, screen } from '@testing-library/react';
import App from './App';

// PUBLIC_INTERFACE
test('renders Personal Notes header and New Note button', () => {
  render(<App />);
  expect(screen.getByText(/Personal Notes/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /new note/i })).toBeInTheDocument();
});
