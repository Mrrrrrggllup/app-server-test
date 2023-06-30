import React from 'react';
import { act, fireEvent, getByTestId, render, screen, waitFor, within } from '@testing-library/react';
import ServerDetail from './ServerDetail';
import * as apiService from '../../service/apiService';
import ApiResponse from '../../interfaces/ApiResponse';
import Server from '../../interfaces/Server';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { ignoreMuiWarningAboutAutompleteEmptyValue, switchAutocompleteValue } from '../../utils/TestUtils';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUsedNavigate,
}));

ignoreMuiWarningAboutAutompleteEmptyValue();

describe('ServerDetail component Update tests', () => {
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
        expect(nameInput).toHaveValue(apiResponse?.data?.body.name);
      });
    
    await waitFor(() => {
    const typeInput = screen.getByRole('combobox', { name: 'Type' }) as HTMLInputElement;
      expect(typeInput).toBeInTheDocument();
      expect(typeInput).toHaveValue(apiResponse?.data?.body.type);
    });

    await waitFor(() => {
      const typeInput = screen.getByRole('combobox', { name: 'Status' }) as HTMLInputElement;
        expect(typeInput).toBeInTheDocument();
        expect(typeInput).toHaveValue(apiResponse?.data?.body.status);
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

    
      expect(updateServerSpy).toHaveBeenCalledWith(apiResponseUpdate?.data?.body);
      expect(updateServerSpy).toHaveBeenCalledTimes(1);

      // Verify if redirect work
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/');

      // Verify if Toaster is showing.
      expect(await screen.findByText("Server updated successfully")).toBeInTheDocument();
  });

  test('Servers detail Update 409 With already exist', async () => {
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
      error: 'Server name nameTaken already exists'
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

    // Mock updateServer to resolve with the updated server data with already taken name
    const nameInput = screen.getByRole('textbox', { name: 'Name' }) as HTMLInputElement;
    await act(async () => {
      fireEvent.change(nameInput, { target: { value: "nameTaken" } });
    });

    const updateServerSpy = jest.spyOn(apiService, 'updateServer');
    updateServerSpy.mockResolvedValue(apiResponseUpdate);
    const updateButton = screen.getByText("Update");
    await act(async () => {
      fireEvent.click(updateButton);
    });

    let expectedServerCall = apiResponse?.data?.body;
    if (expectedServerCall) {
      expectedServerCall.name = "nameTaken";
    }

    expect(updateServerSpy).toHaveBeenCalledWith(expectedServerCall);
    expect(updateServerSpy).toHaveBeenCalledTimes(1);
    // Verify if redirect work
    expect(mockedUsedNavigate).toHaveBeenCalledTimes(0);

    // Verify if Toaster and error on input is showing.
    expect(await screen.findByText("Server name nameTaken already exists")).toBeInTheDocument();
    expect(await screen.findByText("Name already exist")).toBeInTheDocument();

  });
});

describe('ServerDetail component Create tests', () => {
  test('Servers detail Create Working', async () => {
    // Mock server data
    const apiResponse : ApiResponse<Server> = {
      data: {
        body: {
          id: 1,
          name: 'Create Server',
          type: 'medium',
          status: 'running', 
      }
    },
    error: ''
  };

  let mockCreateServer = {
    name: 'Create Server',
    type: 'medium',
    status: 'running',
  }

    // Render ServerDetail
    render(
      <MemoryRouter initialEntries={['/server']}>
      <Routes>
          <Route path="/server" element={<ServerDetail />} />
        </Routes>
    </MemoryRouter>
    );

    // Assert that the server details are rendered

    await screen.findByText(/New\s*server/i);

    await waitFor(() => {
        const nameInput = screen.getByRole('textbox', { name: 'Name' }) as HTMLInputElement;
        expect(nameInput).toBeInTheDocument();
        expect(nameInput).toHaveValue('');
      });
    
    await waitFor(() => {
    const typeInput = screen.getByRole('combobox', { name: 'Type' }) as HTMLInputElement;
      expect(typeInput).toBeInTheDocument();
      expect(typeInput).toHaveValue('');
    });

    await waitFor(() => {
      const typeInput = screen.getByRole('combobox', { name: 'Status' }) as HTMLInputElement;
        expect(typeInput).toBeInTheDocument();
        expect(typeInput).toHaveValue('');
      });

      // Set values to fields
      const nameInput = screen.getByRole('textbox', { name: 'Name' }) as HTMLInputElement;
      await act(async () => {
        fireEvent.change(nameInput, { target: { value: mockCreateServer.name } });
        expect(nameInput.value).toBe("Create Server");
      });

      const statusInput = screen.getByRole('combobox', { name: 'Status' }) as HTMLInputElement;
      await act(async () => {
        switchAutocompleteValue(statusInput, mockCreateServer.status);
      });

      const typeInput = screen.getByRole('combobox', { name: 'Type' }) as HTMLInputElement;
      await act(async () => {
        switchAutocompleteValue(typeInput, mockCreateServer.type);
      });

      await waitFor(() => {
        expect(nameInput.value).toBe(mockCreateServer.name);
        expect(statusInput.value).toBe(mockCreateServer.status);
        expect(typeInput.value).toBe(mockCreateServer.type);
      });

     // Mock creatServer to resolve with the server data
     const createServerMock = jest.spyOn(apiService, 'createServer');
     createServerMock.mockResolvedValue(apiResponse);

      const createButton = screen.getByText("Create");
      await act(async () => {
        fireEvent.click(createButton);
      });

      expect(createServerMock).toHaveBeenCalledWith(mockCreateServer);
      expect(createServerMock).toBeCalledTimes(1);

      // Verify if redirect work
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/');

      // Verify if Toaster is showing.
      expect(await screen.findByText("Server created successfully")).toBeInTheDocument();

  });

  test('Servers detail Create with required issue', async () => {

  let mockCreateServer = {
    name: 'Create Server',
    type: 'medium',
    status: 'running',
  }

    // Render ServerDetail
    render(
      <MemoryRouter initialEntries={['/server']}>
      <Routes>
          <Route path="/server" element={<ServerDetail />} />
        </Routes>
    </MemoryRouter>
    );

    // Assert that the server details are rendered

    await screen.findByText(/New\s*server/i);

    await waitFor(() => {
        const nameInput = screen.getByRole('textbox', { name: 'Name' }) as HTMLInputElement;
        expect(nameInput).toBeInTheDocument();
        expect(nameInput).toHaveValue('');
      });
    
    await waitFor(() => {
    const typeInput = screen.getByRole('combobox', { name: 'Type' }) as HTMLInputElement;
      expect(typeInput).toBeInTheDocument();
      expect(typeInput).toHaveValue('');
    });

    await waitFor(() => {
      const typeInput = screen.getByRole('combobox', { name: 'Status' }) as HTMLInputElement;
        expect(typeInput).toBeInTheDocument();
        expect(typeInput).toHaveValue('');
      });

     // Mock creatServer to resolve with the server data
     const createServerMock = jest.spyOn(apiService, 'createServer');

      const createButton = screen.getByText("Create");
      await act(async () => {
        fireEvent.click(createButton);
      });

      expect(createServerMock).toBeCalledTimes(0);
      expect(mockedUsedNavigate).toBeCalledTimes(0);

      const requiredElements = screen.getAllByText("Required");
      expect(requiredElements.length).toBe(3);

  });

  test('Servers detail Create With 409 Name Already Exist', async () => {
    // Mock server data

  let mockCreateServer = {
    name: 'nameTaken',
    type: 'medium',
    status: 'running',
  }

    // Render ServerDetail
    render(
      <MemoryRouter initialEntries={['/server']}>
      <Routes>
          <Route path="/server" element={<ServerDetail />} />
        </Routes>
    </MemoryRouter>
    );

      // Set values to fields
      const nameInput = screen.getByRole('textbox', { name: 'Name' }) as HTMLInputElement;
      await act(async () => {
        fireEvent.change(nameInput, { target: { value: mockCreateServer.name } });
        expect(nameInput.value).toBe(mockCreateServer.name);
      });

      const statusInput = screen.getByRole('combobox', { name: 'Status' }) as HTMLInputElement;
      await act(async () => {
        switchAutocompleteValue(statusInput, mockCreateServer.status);
      });

      const typeInput = screen.getByRole('combobox', { name: 'Type' }) as HTMLInputElement;
      await act(async () => {
        switchAutocompleteValue(typeInput, mockCreateServer.type);
      });

      await waitFor(() => {
        expect(nameInput.value).toBe(mockCreateServer.name);
        expect(statusInput.value).toBe(mockCreateServer.status);
        expect(typeInput.value).toBe(mockCreateServer.type);
      });

      const apiResponse : ApiResponse<Server> = {
        error: 'Server name nameTaken already exists'
      };

     // Mock creatServer to resolve with the server data
     const createServerMock = jest.spyOn(apiService, 'createServer');
     createServerMock.mockResolvedValue(apiResponse);

      const createButton = screen.getByText("Create");
      await act(async () => {
        fireEvent.click(createButton);
      });

      expect(createServerMock).toHaveBeenCalledWith(mockCreateServer);
      expect(createServerMock).toBeCalledTimes(1);

      // Verify if redirect work
      expect(mockedUsedNavigate).toBeCalledTimes(0);

      // Verify if Toaster is showing.
      expect(await screen.findByText("Server name nameTaken already exists")).toBeInTheDocument();
      expect(await screen.findByText("Name already exist")).toBeInTheDocument();
  });

  test('Servers detail Create With 400 server error', async () => {
    // Mock server data

  let mockCreateServer = {
    name: 'create server',
    type: 'medium',
    status: 'running',
  }

    // Render ServerDetail
    render(
      <MemoryRouter initialEntries={['/server']}>
      <Routes>
          <Route path="/server" element={<ServerDetail />} />
        </Routes>
    </MemoryRouter>
    );

      // Set values to fields
      const nameInput = screen.getByRole('textbox', { name: 'Name' }) as HTMLInputElement;
      await act(async () => {
        fireEvent.change(nameInput, { target: { value: mockCreateServer.name } });
        expect(nameInput.value).toBe(mockCreateServer.name);
      });

      const statusInput = screen.getByRole('combobox', { name: 'Status' }) as HTMLInputElement;
      await act(async () => {
        switchAutocompleteValue(statusInput, mockCreateServer.status);
      });

      const typeInput = screen.getByRole('combobox', { name: 'Type' }) as HTMLInputElement;
      await act(async () => {
        switchAutocompleteValue(typeInput, mockCreateServer.type);
      });

      await waitFor(() => {
        expect(nameInput.value).toBe(mockCreateServer.name);
        expect(statusInput.value).toBe(mockCreateServer.status);
        expect(typeInput.value).toBe(mockCreateServer.type);
      });

      const apiResponse : ApiResponse<Server> = {
        error: 'Internal server error'
      };

     // Mock creatServer to resolve with the server data
     const createServerMock = jest.spyOn(apiService, 'createServer');
     createServerMock.mockResolvedValue(apiResponse);

      const createButton = screen.getByText("Create");
      await act(async () => {
        fireEvent.click(createButton);
      });

      expect(createServerMock).toHaveBeenCalledWith(mockCreateServer);
      expect(createServerMock).toBeCalledTimes(1);

      // Verify if redirect work
      expect(mockedUsedNavigate).toBeCalledTimes(0);

      // Verify if Toaster is showing.
      expect(await screen.findByText("Internal server error")).toBeInTheDocument();
      const required = screen.queryByText("Required");

      // Verify if the other error are not showing
      const alreadyExist = screen.queryByText("Name already exist");
      expect(required).toBeNull();
      expect(alreadyExist).toBeNull();
  });
});



