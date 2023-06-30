import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Navbar from './Navbar';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUsedNavigate,
}));

test('Click on "add" button navigate to "server"', () => {
  
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
  
    const addButton = screen.getByText('Ajouter');
    fireEvent.click(addButton);
  
    expect(mockedUsedNavigate).toHaveBeenCalledWith('server');
});

test('Click on logo button navigate to root', () => {
  
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
  
    const linkElement = screen.getByText('scaleway-test');
    fireEvent.click(linkElement);
  
    expect(window.location.pathname).toBe('/');
});