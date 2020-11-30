import { render, screen } from '@testing-library/react';
import App from './App';

test('renders loading screen', () => {
  render(<App />);
  const loadingScreen = screen.getByText(/Still signing you in/i);
  expect(loadingScreen).toBeInTheDocument();
});
