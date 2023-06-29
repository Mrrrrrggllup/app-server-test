import React from 'react';
import { render, screen } from '@testing-library/react';
import ServerDetail from './ServerDetail';
import * as apiService from '../../service/apiService';
import ApiResponse from '../../interfaces/ApiResponse';
import Server from '../../interfaces/Server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

test('renders server details', async () => {
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

  expect(fetchServerSpy).toBeCalledWith(1);

  // Assert that the server details are rendered
  await screen.findByText(/Test\s*Server/i);
  // const serverStatusElement = screen.getByText('Status: running');
});



