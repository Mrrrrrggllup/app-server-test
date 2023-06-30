import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import ServerDetail from './ServerDetail';
import * as apiService from '../../service/apiService';
import ApiResponse from '../../interfaces/ApiResponse';
import Server from '../../interfaces/Server';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUsedNavigate,
}));

test('Servers detail Update Working', async () => {
  // Mock server data
  const apiResponse : ApiResponse<Server> = {
    data: {
      body: {
        id: 1,
        name: 'Test Server',
        type: 'small',
        status: 'running', 
    }
  },
  error: ''
};

  const apiResponseUpdate : ApiResponse<Server> = {
    data: {
        body: {
          id: 1,
          name: 'updatedName',
          type: 'small',
          status: 'running', 
      }
    },
    error: ''
  };

  // Mock fetchServer to resolve with the server data
  const fetchServerSpy = jest.spyOn(apiService, 'fetchServer');
  fetchServerSpy.mockResolvedValue(apiResponse);

  // Render ServerDetail
  render(
    <MemoryRouter initialEntries={['/server/1']}>
    <Routes>
        <Route path="/server/:id" element={<ServerDetail />} />
      </Routes>
  </MemoryRouter>
  );

  // Vérify the mock

  expect(fetchServerSpy).toBeCalledWith(1);

  // Assert that the server details are rendered

  await screen.findByText(/Test\s*Server\s*#\s*1/i);

  await waitFor(() => {
      const nameInput = screen.getByRole('textbox', { name: 'Name' }) as HTMLInputElement;
      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toHaveValue(apiResponse.data.body.name);
    });
  
  await waitFor(() => {
  const typeInput = screen.getByRole('combobox', { name: 'Type' }) as HTMLInputElement;
    expect(typeInput).toBeInTheDocument();
    expect(typeInput).toHaveValue(apiResponse.data.body.type);
  });

  await waitFor(() => {
    const typeInput = screen.getByRole('combobox', { name: 'Status' }) as HTMLInputElement;
      expect(typeInput).toBeInTheDocument();
      expect(typeInput).toHaveValue(apiResponse.data.body.status);
    });

    // Mock updateServer to resolve with the updated server data with a new not taken name
    const nameInput = screen.getByRole('textbox', { name: 'Name' }) as HTMLInputElement;
    await act(async () => {
      fireEvent.change(nameInput, { target: { value: "updatedName" } });
    });

    await waitFor(() => {
      expect(nameInput.value).toBe("updatedName");
    });

    const updateServerSpy = jest.spyOn(apiService, 'updateServer');
    updateServerSpy.mockResolvedValue(apiResponseUpdate);

    const updateButton = screen.getByText("Update");
    await act(async () => {
      fireEvent.click(updateButton);
    });

  
    expect(updateServerSpy).toHaveBeenCalledWith(apiResponseUpdate.data.body);
    expect(updateServerSpy).toHaveBeenCalledTimes(1);

    // Verify if redirect work
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/');

    // Verify if Toaster is showing.
    expect(await screen.findByText("Server updated successfully")).toBeInTheDocument();
});



