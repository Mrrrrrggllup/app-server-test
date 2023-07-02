import React from 'react';
import { act, fireEvent, getAllByAltText, getAllByTestId, getByTestId, getByText, render, screen, waitFor, within } from '@testing-library/react';
import * as apiService from '../../service/apiService';
import Server from '../../interfaces/Server';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import ServerList from './ServerList';
import ServerDetail from '../serverDetail/ServerDetail';
import ApiResponse from '../../interfaces/ApiResponse';
import UpdateServerStatusPayload from '../../interfaces/UpdateServerStatusPayload';
import excludeVariablesFromRoot from '@mui/material/styles/excludeVariablesFromRoot';
import { log } from 'console';

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUsedNavigate,
}));

describe('ServerList component properly display servers', () => {
    test('Servers Are render in table', async () => {
      // Mock server data
      const apiResponseArray : Server[] = [
        {
            id: 1,
            name: 'Test Server #1',
            type: 'small',
            status: 'running',
        } , 
        {
            id: 2,
            name: 'Test Server #2',
            type: 'medium',
            status: 'stopped',
        }
      ];

      const apiResponse : ApiResponse<Server[]> = {
            data: {
                body: apiResponseArray,
            }
        };
  
      // Mock fetchServer to resolve with the server data
      const fetchServersSpy = jest.spyOn(apiService, 'fetchServers');
      fetchServersSpy.mockResolvedValue(apiResponse);
  
      // Render ServerDetail
      render(
        <MemoryRouter initialEntries={['/']}>
        <Routes>
            <Route path="/" element={<ServerList />} />
          </Routes>
      </MemoryRouter>
      );
  
      // Vérify the mock
  
      expect(fetchServersSpy).toBeCalledTimes(1);
  
      // Assert that the servers details are rendered
      await screen.findByText(/Test\s*Server\s*#\s*1/i);
      await screen.findByText(/Test\s*Server\s*#\s*2/i);
      await screen.findByText(apiResponse?.data?.body[0].type || '');
      await screen.findByText(apiResponse?.data?.body[1].type || '');
      const runningElement = getByText(document.body, '✅');
      expect(runningElement).toBeInTheDocument();
      const crossElement = getByText(document.body, '❌');
      expect(crossElement).toBeInTheDocument();
    });

    test('No servers to render message and button are display ', async () => {
        // Mock server data

        const apiResponseArray : Server[] = [];
        const apiResponse : ApiResponse<Server[]> = {
            data: {
                body: apiResponseArray,
            }
        };
    
        // Mock fetchServer to resolve with the server data
        const fetchServersSpy = jest.spyOn(apiService, 'fetchServers');
        fetchServersSpy.mockResolvedValue(apiResponse);
    
        // Render ServerDetail
        render(
          <MemoryRouter initialEntries={['/']}>
          <Routes>
              <Route path="/" element={<ServerList />} />
            </Routes>
        </MemoryRouter>
        );
    
        // Vérify the mock
    
        expect(fetchServersSpy).toBeCalledTimes(1);
    
        // Assert that the no server message is rendered
        await screen.findByText(/You have no server yet !/i);
        const linkElement = screen.getByText('Create one ?');
        expect(linkElement).toBeInTheDocument();
      });

      test('Servers Are render in table and we test stop button', async () => {
        // Mock server data
        const apiResponseArray : Server[] = [
          {
              id: 1,
              name: 'Test Server #1',
              type: 'small',
              status: 'running',
          } , 
          {
              id: 2,
              name: 'Test Server #2',
              type: 'medium',
              status: 'stopped',
          }
        ];

        const apiResponse : ApiResponse<Server[]> = {
            data: {
                body: apiResponseArray
            }
        }
    
        // Mock fetchServer to resolve with the server data
        const fetchServersSpy = jest.spyOn(apiService, 'fetchServers');
        fetchServersSpy.mockResolvedValue(apiResponse);
    
        // Render ServerDetail
        render(
          <MemoryRouter initialEntries={['/']}>
          <Routes>
              <Route path="/" element={<ServerList />} />
            </Routes>
        </MemoryRouter>
        );
    
        // Vérify the mock
    
        act(() => {
          expect(fetchServersSpy).toBeCalledTimes(1);
        });
        // Assert that the servers details are rendered
        await screen.findByText(/Test\s*Server\s*#\s*1/i);
        await screen.findByText(/Test\s*Server\s*#\s*2/i);
        await screen.findByText(apiResponse.data?.body[0].type || '');
        await screen.findByText(apiResponse.data?.body[1].type || '');
        const runningElement = getByText(document.body, '✅');
        expect(runningElement).toBeInTheDocument();
        const crossElement = getByText(document.body, '❌');
        expect(crossElement).toBeInTheDocument();

        const selectAllInput = screen.getByLabelText('select all servers') as HTMLInputElement;
        // Verify that the input is not checked and the subElements are hidden
        expect(selectAllInput.checked).toBe(false);
        await waitFor(() => {
            const startButton = screen.queryByRole('button', { name: 'Start Server' });
            const stopButton = screen.queryByRole('button', { name: 'Stop Server' });
            expect(startButton).toBeNull();
            expect(stopButton).toBeNull();
          });

        // Click on the input and verify that the subElements are displayed
        fireEvent.click(selectAllInput);
        expect(selectAllInput.checked).toBe(true);
        const startButton = screen.queryByRole('button', { name: 'Start Server' });
        const stopButton = screen.queryByRole('button', { name: 'Stop Server' });
        expect(startButton).toBeInTheDocument();
        expect(stopButton).toBeInTheDocument();

        let payload: UpdateServerStatusPayload = {
            ids: [1,2],
            status: 'stopped'
        };

        let apiResponseStatusUpdate : ApiResponse<Server[]> = {
            error: '',
            data: {
                body: 
                    [{
                        id: 1,
                        name: 'Test Server #1',
                        type: 'small',
                        status: 'stopped',
                    } , 
                    {
                        id: 2,
                        name: 'Test Server #2',
                        type: 'medium',
                        status: 'stopped',
                    }]
            }
        };

         // Mock updateServerStatus to resolve with the server data
         const updateServerStatusSpy = jest.spyOn(apiService, 'updateServersStatus');
         updateServerStatusSpy.mockResolvedValue(apiResponseStatusUpdate);
         const getServers = jest.spyOn(apiService, 'fetchServers');
         getServers.mockResolvedValue(apiResponseStatusUpdate);

        if (stopButton) {
            // Click on the stop button and verify that the api is called
            await act(async () => {
                fireEvent.click(stopButton);
                expect(updateServerStatusSpy).toBeCalledTimes(1);
                expect(updateServerStatusSpy).toBeCalledWith(payload);
              });

              waitFor(() => {
                const newCrossElement = getAllByTestId(document.body, "stopped");
                expect(newCrossElement).toHaveLength(2);
              });
        }
       
        
      });

      test('Servers Are render in table and we test start button', async () => {
        // Mock server data
        const apiResponseArray : Server[] = [
          {
              id: 1,
              name: 'Test Server #1',
              type: 'small',
              status: 'running',
          } , 
          {
              id: 2,
              name: 'Test Server #2',
              type: 'medium',
              status: 'stopped',
          }
        ];

        const apiResponse : ApiResponse<Server[]> = {
            data: {
                body: apiResponseArray
            }
        }
    
        // Mock fetchServer to resolve with the server data
        const fetchServersSpy = jest.spyOn(apiService, 'fetchServers');
        fetchServersSpy.mockResolvedValue(apiResponse);
    
        // Render ServerDetail
        render(
          <MemoryRouter initialEntries={['/']}>
          <Routes>
              <Route path="/" element={<ServerList />} />
            </Routes>
        </MemoryRouter>
        );
    
        // Vérify the mock
    
        act(() => {
          expect(fetchServersSpy).toBeCalledTimes(1);
        });
        // Assert that the servers details are rendered
        await screen.findByText(/Test\s*Server\s*#\s*1/i);
        await screen.findByText(/Test\s*Server\s*#\s*2/i);
        await screen.findByText(apiResponse.data?.body[0].type || '');
        await screen.findByText(apiResponse.data?.body[1].type || '');
        const runningElement = getByText(document.body, '✅');
        expect(runningElement).toBeInTheDocument();
        const crossElement = getByText(document.body, '❌');
        expect(crossElement).toBeInTheDocument();

        const selectAllInput = screen.getByLabelText('select all servers') as HTMLInputElement;
        // Verify that the input is not checked and the subElements are hidden
        expect(selectAllInput.checked).toBe(false);
        await waitFor(() => {
            const startButton = screen.queryByRole('button', { name: 'Start Server' });
            const stopButton = screen.queryByRole('button', { name: 'Stop Server' });
            expect(startButton).toBeNull();
            expect(stopButton).toBeNull();
          });

        // Click on the input and verify that the subElements are displayed
        fireEvent.click(selectAllInput);
        expect(selectAllInput.checked).toBe(true);
        const startButton = screen.queryByRole('button', { name: 'Start Server' });
        const stopButton = screen.queryByRole('button', { name: 'Stop Server' });
        expect(startButton).toBeInTheDocument();
        expect(stopButton).toBeInTheDocument();

        let payload: UpdateServerStatusPayload = {
            ids: [1,2],
            status: 'running'
        };

        let apiResponseStatusUpdate : ApiResponse<Server[]> = {
            error: '',
            data: {
                body: 
                    [{
                        id: 1,
                        name: 'Test Server #1',
                        type: 'small',
                        status: 'running',
                    } , 
                    {
                        id: 2,
                        name: 'Test Server #2',
                        type: 'medium',
                        status: 'running',
                    }]
            }
        };

         // Mock updateServerStatus to resolve with the server data
         const updateServerStatusSpy = jest.spyOn(apiService, 'updateServersStatus');
         updateServerStatusSpy.mockResolvedValue(apiResponseStatusUpdate);
          const getServers = jest.spyOn(apiService, 'fetchServers');
          getServers.mockResolvedValue(apiResponseStatusUpdate);


        if (startButton) {
            // Click on the stop button and verify that the api is called
            await act(async () => {
                fireEvent.click(startButton);
              });
            expect(updateServerStatusSpy).toBeCalledTimes(1);
            expect(updateServerStatusSpy).toBeCalledWith(payload);
            
        }
       
        waitFor(() => {
          const newCrossElement = getAllByTestId(document.body, "running");
          expect(newCrossElement).toHaveLength(2);
        });

      });

      test('Servers Are render in table and we test delete button', async () => {
        // Mock server data
        const apiResponseArray : Server[] = [
          {
              id: 1,
              name: 'Test Server #1',
              type: 'large',
              status: 'running',
          } , 
          {
              id: 2,
              name: 'Test Server #2',
              type: 'large',
              status: 'stopped',
          }, {
            id: 3,
            name: 'Test Server #3',
            type: 'large',
            status: 'starting',
          }
        ];

        const apiResponse : ApiResponse<Server[]> = {
            data: {
                body: apiResponseArray
            }
        }
    
        // Mock fetchServer to resolve with the server data
        const fetchServersSpy = jest.spyOn(apiService, 'fetchServers');
        fetchServersSpy.mockResolvedValue(apiResponse);
    
        // Render ServerDetail
        render(
          <MemoryRouter initialEntries={['/']}>
          <Routes>
              <Route path="/" element={<ServerList />} />
            </Routes>
        </MemoryRouter>
        );
    
        // Vérify the mock
    
        act(() => {
          expect(fetchServersSpy).toBeCalledTimes(1);
        });
        // Assert that the servers details are rendered
        await screen.findByText(/Test\s*Server\s*#\s*1/i);
        await screen.findByText(/Test\s*Server\s*#\s*2/i);
        const runningElement = getByText(document.body, '✅');
        expect(runningElement).toBeInTheDocument();
        const crossElement = getByText(document.body, '❌');
        expect(crossElement).toBeInTheDocument();

        const selectAllInput = screen.getByLabelText('select all servers') as HTMLInputElement;
        // Verify that the input is not checked and the subElements are hidden
        expect(selectAllInput.checked).toBe(false);
        await waitFor(() => {
            const deleteButton = screen.queryByRole('button', { name: 'Delete' });
            expect(deleteButton).toBeNull();
          });

        // Click on the input and verify that the subElements are displayed
        fireEvent.click(selectAllInput);
        expect(selectAllInput.checked).toBe(true);
        const deleteButton = screen.queryByRole('button', { name: 'Delete' }) as HTMLInputElement;
        expect(deleteButton).toBeInTheDocument();

        let payload: number[] = [1, 2, 3];

        let apiResponseDelete : ApiResponse<boolean> = {
            error: '',
            data: {
                body: true
            }
        };

         // Mock updateServerStatus to resolve with the server data
         const deleteServerSpy = jest.spyOn(apiService, 'deleteServers');
         deleteServerSpy.mockResolvedValue(apiResponseDelete);
         await act(async () => {
          fireEvent.click(deleteButton);
        })

        // Modal is showing
        const aggreeButton = screen.queryByTestId('modal-agree') as HTMLInputElement;
        expect(aggreeButton).toBeInTheDocument();
        const getServerSpy = jest.spyOn(apiService, 'fetchServers');
        getServerSpy.mockResolvedValue({data: {body: []}} as ApiResponse<Server[]>);
        await act(async () => {
          fireEvent.click(aggreeButton);
          expect(deleteServerSpy).toBeCalledWith(payload);
          expect(getServerSpy).toBeCalledTimes(1);
        });

        await screen.findByText(/You have no server yet !/i);

      });

      test('Servers Are render in table and we test update button', async () => {
        // Mock server data
        const apiResponseArray : Server[] = [
          {
              id: 1,
              name: 'Test Server #1',
              type: 'large',
              status: 'running',
          }
        ];

        const apiResponse : ApiResponse<Server[]> = {
            data: {
                body: apiResponseArray
            }
        }
    
        // Mock fetchServer to resolve with the server data
        const fetchServersSpy = jest.spyOn(apiService, 'fetchServers');
        fetchServersSpy.mockResolvedValue(apiResponse);
    
        // Render ServerDetail
        render(
          <MemoryRouter initialEntries={['/']}>
          <Routes>
              <Route path="/" element={<ServerList />} />
            </Routes>
        </MemoryRouter>
        );
    
        // Vérify the mock
    
        act(() => {
          expect(fetchServersSpy).toBeCalledTimes(1);
        });
        // Assert that the servers details are rendered
        await screen.findByText(/Test\s*Server\s*#\s*1/i);
        const runningElement = getByText(document.body, '✅');
        expect(runningElement).toBeInTheDocument();

        const selectOne = screen.getByLabelText('select all servers') as HTMLInputElement;
        // Verify that the input is not checked and the subElements are hidden
        expect(selectOne.checked).toBe(false);
        await waitFor(() => {
            const updateButton = screen.queryByRole('button', { name: 'Update' });
            expect(updateButton).toBeNull();
          });

        // Click on the input and verify that the subElements are displayed
        fireEvent.click(selectOne);
        expect(selectOne.checked).toBe(true);
        const updateButton = screen.queryByRole('button', { name: 'Update' }) as HTMLInputElement;
        expect(updateButton).toBeInTheDocument();
        fireEvent.click(updateButton);
        expect(mockedUsedNavigate).toHaveBeenCalledWith('server/1');
        
      });
  });